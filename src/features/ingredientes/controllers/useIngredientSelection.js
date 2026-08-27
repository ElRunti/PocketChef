import { useMemo } from "react";
import {
  getIngredientLabel,
  getRecommendedRecipes,
  pantryIngredients,
} from "../../recipes/model/recipeModel.js";

export function useIngredientSelection(selectedIngredientIds, approvedRecipes) {
  const selectedIngredientLabels = useMemo(
    () => selectedIngredientIds.map((ingredientId) => getIngredientLabel(ingredientId)),
    [selectedIngredientIds],
  );

  const recommendedRecipes = useMemo(
    () => getRecommendedRecipes(selectedIngredientIds, approvedRecipes).slice(0, 4),
    [approvedRecipes, selectedIngredientIds],
  );

  const selectedCount = selectedIngredientIds.length;
  const pantryProgress = Math.round(
    (selectedCount / pantryIngredients.length) * 100,
  );

  return {
    ingredients: pantryIngredients,
    selectedCount,
    selectedIngredientLabels,
    recommendedRecipes,
    pantryProgress,
  };
}
