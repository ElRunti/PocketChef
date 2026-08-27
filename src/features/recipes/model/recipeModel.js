const approvedStatus = "approved";
const pendingStatus = "pending";

function normalizeText(value) {
  return value.trim().toLowerCase();
}

export function getApprovedRecipes(recipeList = []) {
  return recipeList.filter((recipe) => recipe.status === approvedStatus);
}

export function getPendingRecipes(recipeList = []) {
  return recipeList.filter((recipe) => recipe.status === pendingStatus);
}

export function getRecipeById(recipeId, recipeList = []) {
  return recipeList.find((recipe) => recipe.id === recipeId);
}

export function getIngredientLabel(ingredientId, ingredients = []) {
  return (
    ingredients.find((ingredient) => ingredient.id === ingredientId)?.label ??
    ingredientId
  );
}

export function getCategoryLabel(categoryId, categories = []) {
  return (
    categories.find((category) => category.id === categoryId)?.label ??
    "Sin categoria"
  );
}

export function getRecipeTimeMinutes(recipe) {
  return Number.parseInt(recipe?.time, 10) || 0;
}

export function getMissingIngredientIds(recipe, selectedIngredientIds) {
  return recipe.ingredientIds.filter(
    (ingredientId) => !selectedIngredientIds.includes(ingredientId),
  );
}

export function countMissingIngredients(recipe, selectedIngredientIds) {
  if (selectedIngredientIds.length === 0) {
    return 0;
  }

  return getMissingIngredientIds(recipe, selectedIngredientIds).length;
}

export function getRecipeMatchPercent(recipe, selectedIngredientIds) {
  if (selectedIngredientIds.length === 0 || recipe.ingredientIds.length === 0) {
    return 100;
  }

  const availableCount = recipe.ingredientIds.length - countMissingIngredients(
    recipe,
    selectedIngredientIds,
  );

  return Math.round((availableCount / recipe.ingredientIds.length) * 100);
}

export function filterRecipes({
  recipeList = [],
  query = "",
  categoryId = "all",
  difficulty = "all",
  maxTime = "all",
  selectedIngredientIds = [],
  onlyAvailable = false,
}) {
  const normalizedQuery = normalizeText(query);

  return recipeList.filter((recipe) => {
    const matchesSearch = normalizeText(recipe.title).includes(normalizedQuery);
    const matchesCategory =
      categoryId === "all" || recipe.categoryId === categoryId;
    const matchesDifficulty =
      difficulty === "all" || recipe.difficulty === difficulty;
    const matchesTime =
      maxTime === "all" || getRecipeTimeMinutes(recipe) <= Number(maxTime);
    const matchesIngredients =
      !onlyAvailable ||
      selectedIngredientIds.length === 0 ||
      countMissingIngredients(recipe, selectedIngredientIds) === 0;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty &&
      matchesTime &&
      matchesIngredients
    );
  });
}

export function getRecommendedRecipes(
  selectedIngredientIds,
  recipeList = [],
) {
  return getApprovedRecipes(recipeList)
    .map((recipe) => ({
      ...recipe,
      missingCount: countMissingIngredients(recipe, selectedIngredientIds),
      matchPercent: getRecipeMatchPercent(recipe, selectedIngredientIds),
    }))
    .sort((firstRecipe, secondRecipe) => {
      if (firstRecipe.missingCount !== secondRecipe.missingCount) {
        return firstRecipe.missingCount - secondRecipe.missingCount;
      }

      return secondRecipe.rating - firstRecipe.rating;
    });
}

export function getPopularRecipes(recipeList = []) {
  return getApprovedRecipes(recipeList)
    .map((recipe) => ({
      ...recipe,
      popularityScore: recipe.rating * Math.max(recipe.ratingCount ?? 0, 1),
    }))
    .sort(
      (firstRecipe, secondRecipe) =>
        secondRecipe.popularityScore - firstRecipe.popularityScore,
    );
}

export function getRecipesByInterests(
  interestCategoryIds,
  selectedIngredientIds,
  recipeList = [],
) {
  const approvedRecipes = getApprovedRecipes(recipeList);
  const hasInterests = interestCategoryIds.length > 0;

  return approvedRecipes
    .map((recipe) => ({
      ...recipe,
      matchPercent: getRecipeMatchPercent(recipe, selectedIngredientIds),
      interestMatch:
        !hasInterests || interestCategoryIds.includes(recipe.categoryId),
    }))
    .sort((firstRecipe, secondRecipe) => {
      if (firstRecipe.interestMatch !== secondRecipe.interestMatch) {
        return Number(secondRecipe.interestMatch) - Number(firstRecipe.interestMatch);
      }

      if (firstRecipe.matchPercent !== secondRecipe.matchPercent) {
        return secondRecipe.matchPercent - firstRecipe.matchPercent;
      }

      return secondRecipe.rating - firstRecipe.rating;
    });
}
