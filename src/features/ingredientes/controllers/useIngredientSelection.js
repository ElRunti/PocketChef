import { useMemo } from "react";
import {
  getIngredientLabel,
  getRecommendedRecipes,
} from "../../recipes/model/recipeModel.js";

export function useIngredientSelection(
  selectedIngredientIds,
  approvedRecipes,
  pantryIngredients,
) {
  const selectedIngredientLabels = useMemo(
    () =>
      selectedIngredientIds.map((ingredientId) =>
        getIngredientLabel(ingredientId, pantryIngredients),
      ),
    [pantryIngredients, selectedIngredientIds],
  );

  const recommendedRecipes = useMemo(
    () => getRecommendedRecipes(selectedIngredientIds, approvedRecipes).slice(0, 4),
    [approvedRecipes, selectedIngredientIds],
  );

  const selectedCount = selectedIngredientIds.length;
  const pantryProgress = Math.round(
    pantryIngredients.length > 0
      ? (selectedCount / pantryIngredients.length) * 100
      : 0,
  );

  return {
    ingredients: pantryIngredients,
    selectedCount,
    selectedIngredientLabels,
    recommendedRecipes,
    pantryProgress,
  };
}
