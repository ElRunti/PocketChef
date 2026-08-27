import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";

export function useFavorites(user) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !user) {
      setFavorites([]);
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

        setFavorites(data.map((favorite) => favorite.recipe_id));
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function toggleFavorite(recipeId) {
    if (!isSupabaseConfigured || !supabase || !user) {
      throw new Error("Inicia sesion para guardar favoritos.");
    }

    const removing = favorites.includes(recipeId);
    const request = removing
      ? supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipeId)
      : supabase.from("favorites").upsert({
          user_id: user.id,
          recipe_id: recipeId,
        });
    const { error } = await request;

    if (error) {
      throw error;
    }

    setFavorites((currentFavorites) =>
      removing
        ? currentFavorites.filter((id) => id !== recipeId)
        : [...currentFavorites, recipeId],
    );
  }

  function isFavorite(recipeId) {
    return favorites.includes(recipeId);
  }

  return { favorites, isFavorite, toggleFavorite };
}
