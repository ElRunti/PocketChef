import { useMemo, useState } from "react";
import {
  filterRecipes,
  getRecipeById,
} from "../model/recipeModel.js";

export const difficultyOptions = [
  { id: "all", label: "Todas" },
  { id: "Facil", label: "Facil" },
  { id: "Media", label: "Media" },
  { id: "Dificil", label: "Dificil" },
];

export const timeOptions = [
  { id: "all", label: "Cualquier tiempo" },
  { id: "10", label: "10 min" },
  { id: "15", label: "15 min" },
  { id: "20", label: "20 min" },
  { id: "30", label: "30 min" },
];

export function useRecipeFilters(
  selectedIngredientIds,
  selectedRecipeId,
  approvedRecipes,
) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [maxTime, setMaxTime] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const filteredRecipes = useMemo(
    () =>
      filterRecipes({
        recipeList: approvedRecipes,
        query,
        categoryId,
        difficulty,
        maxTime,
        selectedIngredientIds,
        onlyAvailable,
      }),
    [
      approvedRecipes,
      categoryId,
      difficulty,
      maxTime,
      onlyAvailable,
      query,
      selectedIngredientIds,
    ],
  );

  const selectedRecipe = useMemo(() => {
    return (
      getRecipeById(selectedRecipeId, approvedRecipes) ??
      filteredRecipes[0] ??
      approvedRecipes[0]
    );
  }, [approvedRecipes, filteredRecipes, selectedRecipeId]);

  return {
    approvedRecipes,
    filteredRecipes,
    selectedRecipe,
    filters: {
      categoryId,
      difficulty,
      maxTime,
      onlyAvailable,
      query,
    },
    actions: {
      setCategoryId,
      setDifficulty,
      setMaxTime,
      setOnlyAvailable,
      setQuery,
    },
  };
}
