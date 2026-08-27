import { useCallback, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

const difficultyFromDatabase = {
  easy: "Facil",
  medium: "Media",
  hard: "Dificil",
};

const difficultyToDatabase = {
  Facil: "easy",
  Media: "medium",
  Dificil: "hard",
};

const recipeFields =
  "id,user_id,title,description,category_id,time_minutes,difficulty,image_url,rating,rating_count,status,created_at,updated_at,recipe_ingredients(ingredient_id),recipe_steps(step_number,text,has_timer,timer_minutes)";
const legacyRecipeFields =
  "id,user_id,title,description,category_id,time_minutes,difficulty,image_url,rating,status,created_at,updated_at,recipe_ingredients(ingredient_id),recipe_steps(step_number,text,has_timer,timer_minutes)";

async function fetchRemoteRecipes() {
  let result = await supabase
    .from("recipes")
    .select(recipeFields)
    .order("created_at", { ascending: false });

  if (result.error?.message.includes("rating_count")) {
    result = await supabase
      .from("recipes")
      .select(legacyRecipeFields)
      .order("created_at", { ascending: false });
  }

  return result;
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

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no esta configurado en este entorno.");
  }
}

export function useRecipeCatalog(user, profile) {
  const [recipeCatalog, setRecipeCatalog] = useState([]);
  const [categoryCatalog, setCategoryCatalog] = useState([]);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [syncState, setSyncState] = useState({
    status: "loading",
    message: "Cargando informacion desde Supabase...",
  });

  const loadCatalog = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setRecipeCatalog([]);
      setCategoryCatalog([]);
      setPantryIngredients([]);
      setSyncState({
        status: "error",
        message: "Configura Supabase para cargar la informacion.",
      });
      return;
    }

    setSyncState({
      status: "loading",
      message: "Cargando informacion desde Supabase...",
    });

    const [recipesResult, categoriesResult, ingredientsResult] =
      await Promise.all([
        fetchRemoteRecipes(),
        supabase.from("categories").select("id,name").order("name"),
        supabase.from("ingredients").select("id,name").order("name"),
      ]);

    const requestError =
      recipesResult.error ?? categoriesResult.error ?? ingredientsResult.error;

    if (requestError) {
      setRecipeCatalog([]);
      setCategoryCatalog([]);
      setPantryIngredients([]);
      setSyncState({ status: "error", message: requestError.message });
      return;
    }

    setRecipeCatalog(
      recipesResult.data.map((recipe) => mapRemoteRecipe(recipe, profile)),
    );
    setCategoryCatalog(
      categoriesResult.data.map((category) => ({
        id: category.id,
        label: category.name,
      })),
    );
    setPantryIngredients(
      ingredientsResult.data.map((ingredient) => ({
        id: ingredient.id,
        label: ingredient.name,
      })),
    );
    setSyncState({ status: "synced", message: "Conectado con Supabase." });
  }, [profile]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog, user]);

  const categories = useMemo(
    () => [{ id: "all", label: "Todas" }, ...categoryCatalog],
    [categoryCatalog],
  );
  const approvedRecipes = useMemo(
    () => recipeCatalog.filter((recipe) => recipe.status === "approved"),
    [recipeCatalog],
  );
  const pendingRecipes = useMemo(
    () => recipeCatalog.filter((recipe) => recipe.status === "pending"),
    [recipeCatalog],
  );

  async function submitRecipe(recipeDraft) {
    requireSupabase();

    if (!user) {
      throw new Error("Inicia sesion para publicar una receta.");
    }

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

      const recipeSteps = recipeDraft.steps.map((step, index) => ({
        recipe_id: remoteRecipe.id,
        step_number: index + 1,
        text: step,
        has_timer: Boolean(recipeDraft.stepTimers?.[index]),
        timer_minutes: recipeDraft.stepTimers?.[index] ?? null,
      }));
      const { error: stepsError } = await supabase
        .from("recipe_steps")
        .insert(recipeSteps);

      if (stepsError) {
        throw stepsError;
      }

      const recipe = mapRemoteRecipe(
        {
          ...remoteRecipe,
          recipe_ingredients: recipeDraft.ingredientIds.map(
            (ingredientId) => ({ ingredient_id: ingredientId }),
          ),
          recipe_steps: recipeSteps,
        },
        profile,
      );
      setRecipeCatalog((currentCatalog) => [recipe, ...currentCatalog]);
      setSyncState({ status: "synced", message: "Receta sincronizada." });
      return { recipe, synced: true };
    } catch (error) {
      if (insertedRecipeId) {
        await supabase
          .from("recipe_steps")
          .delete()
          .eq("recipe_id", insertedRecipeId);
        await supabase
          .from("recipe_ingredients")
          .delete()
          .eq("recipe_id", insertedRecipeId);
        await supabase.from("recipes").delete().eq("id", insertedRecipeId);
      }

      setSyncState({ status: "error", message: error.message });
      throw error;
    }
  }

  async function updateRecipe(recipeId, changes) {
    requireSupabase();
    const currentRecipe = recipeCatalog.find((recipe) => recipe.id === recipeId);

    if (!currentRecipe) {
      throw new Error("La receta ya no existe en Supabase.");
    }

    const updatedRecipe = {
      ...currentRecipe,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
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
      throw recipeError;
    }

    if (changes.ingredientIds) {
      const { error: deleteIngredientsError } = await supabase
        .from("recipe_ingredients")
        .delete()
        .eq("recipe_id", recipeId);
      if (deleteIngredientsError) {
        throw deleteIngredientsError;
      }

      const { error: insertIngredientsError } = await supabase
        .from("recipe_ingredients")
        .insert(
          changes.ingredientIds.map((ingredientId) => ({
            recipe_id: recipeId,
            ingredient_id: ingredientId,
          })),
        );
      if (insertIngredientsError) {
        throw insertIngredientsError;
      }
    }

    if (changes.steps) {
      const { error: deleteStepsError } = await supabase
        .from("recipe_steps")
        .delete()
        .eq("recipe_id", recipeId);
      if (deleteStepsError) {
        throw deleteStepsError;
      }

      const { error: insertStepsError } = await supabase
        .from("recipe_steps")
        .insert(
          changes.steps.map((step, index) => ({
            recipe_id: recipeId,
            step_number: index + 1,
            text: step,
            has_timer: false,
            timer_minutes: null,
          })),
        );
      if (insertStepsError) {
        throw insertStepsError;
      }
    }

    setRecipeCatalog((currentCatalog) =>
      currentCatalog.map((recipe) =>
        recipe.id === recipeId ? updatedRecipe : recipe,
      ),
    );
    setSyncState({ status: "synced", message: "Cambios sincronizados." });
    return { synced: true };
  }

  async function moderateRecipe(recipeId, status) {
    requireSupabase();
    const { error } = await supabase
      .from("recipes")
      .update({ status })
      .eq("id", recipeId);

    if (error) {
      setSyncState({ status: "error", message: error.message });
      throw error;
    }

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
    setSyncState({ status: "synced", message: "Moderacion sincronizada." });
    return { synced: true };
  }

  return {
    approvedRecipes,
    categories,
    moderateRecipe,
    pantryIngredients,
    pendingRecipes,
    recipeCatalog,
    reloadCatalog: loadCatalog,
    submitRecipe,
    syncState,
    updateRecipe,
  };
}
