import { useEffect, useMemo, useState } from "react";
import { recipes as seedRecipes } from "../data/recipes.js";

const STORAGE_KEY = "pocket-chef-recipe-catalog-v1";

function loadRecipeCatalog() {
  if (typeof window === "undefined") {
    return seedRecipes;
  }

  try {
    const savedRecipes = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!Array.isArray(savedRecipes)) {
      return seedRecipes;
    }

    const savedById = new Map(savedRecipes.map((recipe) => [recipe.id, recipe]));
    const mergedSeeds = seedRecipes.map(
      (recipe) => savedById.get(recipe.id) ?? recipe,
    );
    const communityRecipes = savedRecipes.filter(
      (recipe) => !seedRecipes.some((seedRecipe) => seedRecipe.id === recipe.id),
    );

    return [...mergedSeeds, ...communityRecipes];
  } catch {
    return seedRecipes;
  }
}

function createRecipeId(title) {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 42);

  return `${slug || "receta"}-${Date.now().toString(36)}`;
}

export function useRecipeCatalog() {
  const [recipeCatalog, setRecipeCatalog] = useState(loadRecipeCatalog);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipeCatalog));
    } catch {
      // The in-memory catalog remains usable if browser storage is unavailable.
    }
  }, [recipeCatalog]);

  const approvedRecipes = useMemo(
    () => recipeCatalog.filter((recipe) => recipe.status === "approved"),
    [recipeCatalog],
  );
  const pendingRecipes = useMemo(
    () => recipeCatalog.filter((recipe) => recipe.status === "pending"),
    [recipeCatalog],
  );

  function submitRecipe(recipeDraft) {
    const recipe = {
      ...recipeDraft,
      id: recipeDraft.id ?? createRecipeId(recipeDraft.title),
      author: recipeDraft.author ?? "Hector",
      createdAt: recipeDraft.createdAt ?? new Date().toISOString(),
      rating: recipeDraft.rating ?? 0,
      ratingCount: recipeDraft.ratingCount ?? 0,
      status: "pending",
    };

    setRecipeCatalog((currentCatalog) => [recipe, ...currentCatalog]);
    return recipe;
  }

  function updateRecipe(recipeId, changes) {
    setRecipeCatalog((currentCatalog) =>
      currentCatalog.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, ...changes, updatedAt: new Date().toISOString() }
          : recipe,
      ),
    );
  }

  function moderateRecipe(recipeId, status) {
    updateRecipe(recipeId, {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "Administrador Pocket Chef",
    });
  }

  return {
    recipeCatalog,
    approvedRecipes,
    pendingRecipes,
    submitRecipe,
    updateRecipe,
    moderateRecipe,
  };
}
