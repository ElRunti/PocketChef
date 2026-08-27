import { useMemo } from "react";
import {
  getIngredientLabel,
  getRecommendedRecipes,
  pantryIngredients,
} from "../../recipes/model/recipeModel.js";

export function useIngredientSelection(selectedIngredientIds) {
  const selectedIngredientLabels = useMemo(
    () => selectedIngredientIds.map((ingredientId) => getIngredientLabel(ingredientId)),
    [selectedIngredientIds],
  );

  const recommendedRecipes = useMemo(
    () => getRecommendedRecipes(selectedIngredientIds).slice(0, 4),
    [selectedIngredientIds],
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
