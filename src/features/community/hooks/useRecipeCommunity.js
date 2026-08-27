import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pocket-chef-community-v1";

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

function getBaseRatingCount(recipe) {
  return recipe.ratingCount ?? 18 + recipe.title.length * 2;
}

export function useRecipeCommunity() {
  const [community, setCommunity] = useState(loadCommunity);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(community));
    } catch {
      // Ratings and comments still work for the current session.
    }
  }, [community]);

  const rateRecipe = useCallback((recipeId, rating) => {
    setCommunity((currentCommunity) => ({
      ...currentCommunity,
      ratings: { ...currentCommunity.ratings, [recipeId]: rating },
    }));
  }, []);

  const addComment = useCallback((recipeId, text) => {
    const comment = {
      id: `${recipeId}-${Date.now().toString(36)}`,
      author: "Hector",
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
  }, []);

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
