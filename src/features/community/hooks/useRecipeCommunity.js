import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

function formatCommentDate(value) {
  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function mapComment(comment) {
  return {
    id: comment.id,
    author: comment.author_name,
    text: comment.text,
    createdAt: formatCommentDate(comment.created_at),
  };
}

export function useRecipeCommunity(user, profile) {
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const [ratingAggregates, setRatingAggregates] = useState({});

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setComments({});
      setRatings({});
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

      const remoteComments = commentsResult.data.reduce(
        (groupedComments, comment) => {
          groupedComments[comment.recipe_id] = [
            ...(groupedComments[comment.recipe_id] ?? []),
            mapComment(comment),
          ];
          return groupedComments;
        },
        {},
      );
      const remoteRatings = ratingsResult.data.reduce(
        (groupedRatings, rating) => {
          groupedRatings[rating.recipe_id] = rating.rating;
          return groupedRatings;
        },
        {},
      );

      setComments(remoteComments);
      setRatings(remoteRatings);
    }

    loadRemoteCommunity();

    return () => {
      active = false;
    };
  }, [user]);

  const rateRecipe = useCallback(
    async (recipeId, rating) => {
      if (!supabase || !user) {
        throw new Error("Inicia sesion para calificar recetas.");
      }

      const { error } = await supabase.from("recipe_ratings").upsert({
        user_id: user.id,
        recipe_id: recipeId,
        rating,
      });

      if (error) {
        throw error;
      }

      const { data: aggregate, error: aggregateError } = await supabase
        .from("recipes")
        .select("rating,rating_count")
        .eq("id", recipeId)
        .single();

      setRatings((currentRatings) => ({
        ...currentRatings,
        [recipeId]: rating,
      }));

      if (!aggregateError) {
        setRatingAggregates((currentAggregates) => ({
          ...currentAggregates,
          [recipeId]: {
            average: Number(aggregate.rating) || 0,
            count: aggregate.rating_count ?? 0,
          },
        }));
      }
    },
    [user],
  );

  const addComment = useCallback(
    async (recipeId, text) => {
      if (!supabase || !user || !profile) {
        throw new Error("Inicia sesion para comentar recetas.");
      }

      const { data, error } = await supabase
        .from("recipe_comments")
        .insert({
          user_id: user.id,
          recipe_id: recipeId,
          author_name: profile.name,
          text: text.trim(),
        })
        .select("id,recipe_id,author_name,text,created_at")
        .single();

      if (error) {
        throw error;
      }

      setComments((currentComments) => ({
        ...currentComments,
        [recipeId]: [
          mapComment(data),
          ...(currentComments[recipeId] ?? []),
        ],
      }));
    },
    [profile, user],
  );

  const getRecipeRating = useCallback(
    (recipe) => {
      if (!recipe) {
        return { average: 0, count: 0, userRating: 0 };
      }

      const aggregate = ratingAggregates[recipe.id];
      return {
        average: aggregate?.average ?? recipe.rating ?? 0,
        count: aggregate?.count ?? recipe.ratingCount ?? 0,
        userRating: ratings[recipe.id] ?? 0,
      };
    },
    [ratingAggregates, ratings],
  );

  const getRecipeComments = useCallback(
    (recipeId) => comments[recipeId] ?? [],
    [comments],
  );

  return {
    addComment,
    getRecipeComments,
    getRecipeRating,
    rateRecipe,
  };
}
