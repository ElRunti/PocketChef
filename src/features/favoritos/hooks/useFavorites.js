import { useState, useEffect } from "react";

const STORAGE_KEY = "pocket-chef-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(recipeId) {
    setFavorites((current) =>
      current.includes(recipeId)
        ? current.filter((id) => id !== recipeId)
        : [...current, recipeId]
    );
  }

  function isFavorite(recipeId) {
    return favorites.includes(recipeId);
  }

  return { favorites, toggleFavorite, isFavorite };
}
