import {
  categories,
  pantryIngredients,
  recipes,
} from "../data/recipes.js";

const approvedStatus = "approved";
const pendingStatus = "pending";

function normalizeText(value) {
  return value.trim().toLowerCase();
}

export function getApprovedRecipes() {
  return recipes.filter((recipe) => recipe.status === approvedStatus);
}

export function getPendingRecipes() {
  return recipes.filter((recipe) => recipe.status === pendingStatus);
}

export function getRecipeById(recipeId) {
  return recipes.find((recipe) => recipe.id === recipeId);
}

export function getDefaultRecipe() {
  return getApprovedRecipes()[0];
}

export function getIngredientById(ingredientId) {
  return pantryIngredients.find((ingredient) => ingredient.id === ingredientId);
}

export function getIngredientLabel(ingredientId) {
  return getIngredientById(ingredientId)?.label ?? ingredientId;
}

export function getCategoryById(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

export function getCategoryLabel(categoryId) {
  return getCategoryById(categoryId)?.label ?? "Sin categoria";
}

export function getRecipeTimeMinutes(recipe) {
  return Number.parseInt(recipe.time, 10) || 0;
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
  if (selectedIngredientIds.length === 0) {
    return 100;
  }

  const availableCount = recipe.ingredientIds.length - countMissingIngredients(
    recipe,
    selectedIngredientIds,
  );

  return Math.round((availableCount / recipe.ingredientIds.length) * 100);
}

export function filterRecipes({
  recipeList = getApprovedRecipes(),
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

export function getRecommendedRecipes(selectedIngredientIds) {
  return getApprovedRecipes()
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

export { categories, pantryIngredients, recipes };
