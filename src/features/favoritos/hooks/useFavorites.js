import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

const STORAGE_KEY = "pocket-chef-favorites";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function loadLocalFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites(user) {
  const [favorites, setFavorites] = useState(loadLocalFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Favorites remain available for the current session.
    }
  }, [favorites]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !user) {
      return undefined;
    }

    let active = true;

    supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!active || error) {
          return;
        }

        const localSeedFavorites = loadLocalFavorites().filter(
          (recipeId) => !UUID_PATTERN.test(recipeId),
        );
        setFavorites([
          ...localSeedFavorites,
          ...data.map((favorite) => favorite.recipe_id),
        ]);
      });

    return () => {
      active = false;
    };
  }, [user]);

  function toggleFavorite(recipeId) {
    const removing = favorites.includes(recipeId);

    setFavorites((currentFavorites) =>
      removing
        ? currentFavorites.filter((id) => id !== recipeId)
        : [...currentFavorites, recipeId],
    );

    if (
      !isSupabaseConfigured ||
      !supabase ||
      !user ||
      !UUID_PATTERN.test(recipeId)
    ) {
      return;
    }

    if (removing) {
      supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId);
      return;
    }

    supabase.from("favorites").upsert({
      user_id: user.id,
      recipe_id: recipeId,
    });
  }

  function isFavorite(recipeId) {
    return favorites.includes(recipeId);
  }

  return { favorites, isFavorite, toggleFavorite };
}
