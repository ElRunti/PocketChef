import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

const STORAGE_KEY = "pocket-chef-community-v1";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const seedComments = {
  "egg-taco": [
    {
      id: "seed-egg-taco-1",
      author: "Mariana",
      text: "Le agregue un poco de limon al aguacate y quedo buenisimo.",
      createdAt: "Hace 2 dias",
    },
  ],
  "chicken-rice": [
    {
      id: "seed-chicken-rice-1",
      author: "Diego",
      text: "Ideal para dejar listo el almuerzo de la universidad.",
      createdAt: "Hace 4 dias",
    },
  ],
};

function loadCommunity() {
  try {
    const savedCommunity = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      ratings: savedCommunity?.ratings ?? {},
      comments: savedCommunity?.comments ?? {},
    };
  } catch {
    return { ratings: {}, comments: {} };
  }
}

function formatCommentDate(value) {
  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function getBaseRatingCount(recipe) {
  if (recipe.source === "supabase") {
    return recipe.ratingCount ?? 0;
  }

  return recipe.ratingCount || 18 + recipe.title.length * 2;
}

export function useRecipeCommunity(user, profile) {
  const [community, setCommunity] = useState(loadCommunity);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(community));
    } catch {
      // Ratings and comments remain available for the current session.
    }
  }, [community]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let active = true;

    async function loadRemoteCommunity() {
      const commentsRequest = supabase
        .from("recipe_comments")
        .select("id,recipe_id,author_name,text,created_at")
        .order("created_at", { ascending: false });
      const ratingsRequest = user
        ? supabase
            .from("recipe_ratings")
            .select("recipe_id,rating")
            .eq("user_id", user.id)
        : Promise.resolve({ data: [], error: null });
      const [commentsResult, ratingsResult] = await Promise.all([
        commentsRequest,
        ratingsRequest,
      ]);

      if (!active || commentsResult.error || ratingsResult.error) {
        return;
      }

      const comments = commentsResult.data.reduce((groupedComments, comment) => {
        const recipeComments = groupedComments[comment.recipe_id] ?? [];
        groupedComments[comment.recipe_id] = [
          ...recipeComments,
          {
            id: comment.id,
            author: comment.author_name,
            text: comment.text,
            createdAt: formatCommentDate(comment.created_at),
          },
        ];
        return groupedComments;
      }, {});
      const ratings = ratingsResult.data.reduce((groupedRatings, rating) => {
        groupedRatings[rating.recipe_id] = rating.rating;
        return groupedRatings;
      }, {});

      setCommunity((currentCommunity) => ({
        ratings: { ...currentCommunity.ratings, ...ratings },
        comments: { ...currentCommunity.comments, ...comments },
      }));
    }

    loadRemoteCommunity();

    return () => {
      active = false;
    };
  }, [user]);

  const rateRecipe = useCallback(
    (recipeId, rating) => {
      setCommunity((currentCommunity) => ({
        ...currentCommunity,
        ratings: { ...currentCommunity.ratings, [recipeId]: rating },
      }));

      if (supabase && user && UUID_PATTERN.test(recipeId)) {
        supabase.from("recipe_ratings").upsert({
          user_id: user.id,
          recipe_id: recipeId,
          rating,
        });
      }
    },
    [user],
  );

  const addComment = useCallback(
    (recipeId, text) => {
      const comment = {
        id: `${recipeId}-${Date.now().toString(36)}`,
        author: profile?.name ?? "Chef invitado",
        text: text.trim(),
        createdAt: "Ahora",
      };

      setCommunity((currentCommunity) => ({
        ...currentCommunity,
        comments: {
          ...currentCommunity.comments,
          [recipeId]: [
            comment,
            ...(currentCommunity.comments[recipeId] ?? []),
          ],
        },
      }));

      if (supabase && user && UUID_PATTERN.test(recipeId)) {
        supabase.from("recipe_comments").insert({
          user_id: user.id,
          recipe_id: recipeId,
          author_name: profile?.name ?? "Chef",
          text: text.trim(),
        });
      }
    },
    [profile, user],
  );

  const getRecipeRating = useCallback(
    (recipe) => {
      if (!recipe) {
        return { average: 0, count: 0, userRating: 0 };
      }

      const userRating = community.ratings[recipe.id] ?? 0;
      const baseCount = getBaseRatingCount(recipe);
      const count = baseCount + (userRating ? 1 : 0);
      const average = userRating
        ? (recipe.rating * baseCount + userRating) / count
        : recipe.rating;

      return {
        average: Number(average.toFixed(1)),
        count,
        userRating,
      };
    },
    [community.ratings],
  );

  const getRecipeComments = useCallback(
    (recipeId) => [
      ...(community.comments[recipeId] ?? []),
      ...(seedComments[recipeId] ?? []),
    ],
    [community.comments],
  );

  return {
    addComment,
    getRecipeComments,
    getRecipeRating,
    rateRecipe,
  };
}
