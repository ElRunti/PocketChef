import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";
import { recipes as seedRecipes } from "../data/recipes.js";

const STORAGE_KEY = "pocket-chef-recipe-catalog-v1";

const difficultyFromDatabase = {
  easy: "Facil",
  medium: "Media",
  hard: "Dificil",
  Facil: "Facil",
  Media: "Media",
  Dificil: "Dificil",
};

const difficultyToDatabase = {
  Facil: "easy",
  Media: "medium",
  Dificil: "hard",
};

function loadLocalCatalog() {
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

function mapRemoteRecipe(recipe, profile) {
  const sortedSteps = [...(recipe.recipe_steps ?? [])].sort(
    (firstStep, secondStep) => firstStep.step_number - secondStep.step_number,
  );

  return {
    id: recipe.id,
    userId: recipe.user_id,
    title: recipe.title,
    description: recipe.description,
    categoryId: recipe.category_id,
    time: `${recipe.time_minutes} min`,
    difficulty: difficultyFromDatabase[recipe.difficulty] ?? recipe.difficulty,
    image: recipe.image_url,
    ingredientIds: (recipe.recipe_ingredients ?? []).map(
      (ingredient) => ingredient.ingredient_id,
    ),
    steps: sortedSteps.map((step) => step.text),
    stepTimers: sortedSteps.map((step) =>
      step.has_timer ? step.timer_minutes : null,
    ),
    rating: Number(recipe.rating) || 0,
    ratingCount: recipe.rating_count ?? 0,
    status: recipe.status,
    author: recipe.user_id === profile?.id ? profile.name : "Comunidad",
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
    source: "supabase",
  };
}

function createLocalRecipe(recipeDraft, profile) {
  return {
    ...recipeDraft,
    id: recipeDraft.id ?? createRecipeId(recipeDraft.title),
    author: recipeDraft.author ?? profile?.name ?? "Chef invitado",
    createdAt: recipeDraft.createdAt ?? new Date().toISOString(),
    rating: recipeDraft.rating ?? 0,
    ratingCount: recipeDraft.ratingCount ?? 0,
    source: recipeDraft.source ?? "local",
    status: "pending",
  };
}

function getRecipePayload(recipeDraft, userId) {
  return {
    user_id: userId,
    title: recipeDraft.title.trim(),
    description: recipeDraft.description.trim(),
    category_id: recipeDraft.categoryId,
    time_minutes: Number.parseInt(recipeDraft.time, 10),
    difficulty:
      difficultyToDatabase[recipeDraft.difficulty] ?? recipeDraft.difficulty,
    image_url: recipeDraft.image,
    status: "pending",
  };
}

export function useRecipeCatalog(user, profile) {
  const [recipeCatalog, setRecipeCatalog] = useState(loadLocalCatalog);
  const [syncState, setSyncState] = useState({ status: "local", message: "" });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipeCatalog));
    } catch {
      // The in-memory catalog remains usable if browser storage is unavailable.
    }
  }, [recipeCatalog]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let active = true;

    async function loadRemoteCatalog() {
      setSyncState({ status: "loading", message: "" });
      const { data, error } = await supabase
        .from("recipes")
        .select(
          "id,user_id,title,description,category_id,time_minutes,difficulty,image_url,rating,rating_count,status,created_at,updated_at,recipe_ingredients(ingredient_id),recipe_steps(step_number,text,has_timer,timer_minutes)",
        )
        .order("created_at", { ascending: false });

      if (!active) {
        return;
      }

      if (error) {
        setSyncState({
          status: "local",
          message: "Supabase requiere ejecutar la migracion incluida.",
        });
        return;
      }

      const remoteRecipes = data.map((recipe) => mapRemoteRecipe(recipe, profile));
      const localCatalog = loadLocalCatalog();
      const approvedSeeds = seedRecipes.filter(
        (recipe) => recipe.status === "approved",
      );
      const localCommunityRecipes = localCatalog.filter(
        (recipe) =>
          recipe.source === "local" &&
          !seedRecipes.some((seedRecipe) => seedRecipe.id === recipe.id),
      );
      const remoteIds = new Set(remoteRecipes.map((recipe) => recipe.id));

      setRecipeCatalog([
        ...remoteRecipes,
        ...approvedSeeds.filter((recipe) => !remoteIds.has(recipe.id)),
        ...localCommunityRecipes.filter((recipe) => !remoteIds.has(recipe.id)),
      ]);
      setSyncState({ status: "synced", message: "Conectado con Supabase." });
    }

    loadRemoteCatalog();

    return () => {
      active = false;
    };
  }, [profile, user]);

  const approvedRecipes = useMemo(
    () => recipeCatalog.filter((recipe) => recipe.status === "approved"),
    [recipeCatalog],
  );
  const pendingRecipes = useMemo(
    () => recipeCatalog.filter((recipe) => recipe.status === "pending"),
    [recipeCatalog],
  );

  async function submitRecipe(recipeDraft) {
    let recipe = createLocalRecipe(recipeDraft, profile);

    if (isSupabaseConfigured && supabase && user) {
      let insertedRecipeId;

      try {
        const { data: remoteRecipe, error: recipeError } = await supabase
          .from("recipes")
          .insert(getRecipePayload(recipeDraft, user.id))
          .select()
          .single();

        if (recipeError) {
          throw recipeError;
        }

        insertedRecipeId = remoteRecipe.id;

        const { error: ingredientsError } = await supabase
          .from("recipe_ingredients")
          .insert(
            recipeDraft.ingredientIds.map((ingredientId) => ({
              recipe_id: remoteRecipe.id,
              ingredient_id: ingredientId,
            })),
          );

        if (ingredientsError) {
          throw ingredientsError;
        }

        const { error: stepsError } = await supabase.from("recipe_steps").insert(
          recipeDraft.steps.map((step, index) => ({
            recipe_id: remoteRecipe.id,
            step_number: index + 1,
            text: step,
            has_timer: Boolean(recipeDraft.stepTimers?.[index]),
            timer_minutes: recipeDraft.stepTimers?.[index] ?? null,
          })),
        );

        if (stepsError) {
          throw stepsError;
        }

        recipe = mapRemoteRecipe(
          {
            ...remoteRecipe,
            recipe_ingredients: recipeDraft.ingredientIds.map(
              (ingredientId) => ({ ingredient_id: ingredientId }),
            ),
            recipe_steps: recipeDraft.steps.map((step, index) => ({
              step_number: index + 1,
              text: step,
              has_timer: Boolean(recipeDraft.stepTimers?.[index]),
              timer_minutes: recipeDraft.stepTimers?.[index] ?? null,
            })),
          },
          profile,
        );
        setSyncState({ status: "synced", message: "Receta sincronizada." });
      } catch {
        if (insertedRecipeId) {
          await supabase.from("recipes").delete().eq("id", insertedRecipeId);
        }
        setSyncState({
          status: "local",
          message: "La receta quedo local hasta ejecutar la migracion.",
        });
      }
    }

    setRecipeCatalog((currentCatalog) => [recipe, ...currentCatalog]);
    return { recipe, synced: recipe.source === "supabase" };
  }

  async function updateRecipe(recipeId, changes) {
    const currentRecipe = recipeCatalog.find((recipe) => recipe.id === recipeId);
    const updatedRecipe = {
      ...currentRecipe,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    setRecipeCatalog((currentCatalog) =>
      currentCatalog.map((recipe) =>
        recipe.id === recipeId ? updatedRecipe : recipe,
      ),
    );

    if (currentRecipe?.source !== "supabase" || !supabase) {
      return { synced: false };
    }

    const { error: recipeError } = await supabase
      .from("recipes")
      .update({
        title: updatedRecipe.title,
        description: updatedRecipe.description,
        category_id: updatedRecipe.categoryId,
        time_minutes: Number.parseInt(updatedRecipe.time, 10),
        difficulty:
          difficultyToDatabase[updatedRecipe.difficulty] ??
          updatedRecipe.difficulty,
        image_url: updatedRecipe.image,
      })
      .eq("id", recipeId);

    if (recipeError) {
      setSyncState({ status: "error", message: recipeError.message });
      return { synced: false };
    }

    if (changes.ingredientIds) {
      await supabase.from("recipe_ingredients").delete().eq("recipe_id", recipeId);
      await supabase.from("recipe_ingredients").insert(
        changes.ingredientIds.map((ingredientId) => ({
          recipe_id: recipeId,
          ingredient_id: ingredientId,
        })),
      );
    }

    if (changes.steps) {
      await supabase.from("recipe_steps").delete().eq("recipe_id", recipeId);
      await supabase.from("recipe_steps").insert(
        changes.steps.map((step, index) => ({
          recipe_id: recipeId,
          step_number: index + 1,
          text: step,
          has_timer: false,
          timer_minutes: null,
        })),
      );
    }

    setSyncState({ status: "synced", message: "Cambios sincronizados." });
    return { synced: true };
  }

  async function moderateRecipe(recipeId, status) {
    const currentRecipe = recipeCatalog.find((recipe) => recipe.id === recipeId);
    setRecipeCatalog((currentCatalog) =>
      currentCatalog.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              status,
              reviewedAt: new Date().toISOString(),
              reviewedBy: profile?.name ?? "Administrador Pocket Chef",
            }
          : recipe,
      ),
    );

    if (currentRecipe?.source !== "supabase" || !supabase) {
      return { synced: false };
    }

    const { error } = await supabase
      .from("recipes")
      .update({ status })
      .eq("id", recipeId);

    if (error) {
      setSyncState({ status: "error", message: error.message });
      return { synced: false };
    }

    setSyncState({ status: "synced", message: "Moderacion sincronizada." });
    return { synced: true };
  }

  return {
    approvedRecipes,
    moderateRecipe,
    pendingRecipes,
    recipeCatalog,
    submitRecipe,
    syncState,
    updateRecipe,
  };
}
