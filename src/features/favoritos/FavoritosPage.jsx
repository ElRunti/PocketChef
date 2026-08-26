import { useMemo } from "react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { recipes } from "../recipes/data/recipes.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { FavoriteRecipeCard } from "./components/FavoriteRecipeCard.jsx";

export function FavoritosPage({ onNavigate }) {
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteRecipes = useMemo(() => {
    return recipes.filter((recipe) => favorites.includes(recipe.id));
  }, [favorites]);

  return (
    <main className="app-shell">
      <div className="page-container">
        <header className="app-header">
          <div className="brand">
            <div className="brand-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                <line x1="6" x2="18" y1="17" y2="17" />
              </svg>
            </div>
            <div>
              <p>Hola, equipo</p>
              <h1>Favoritos</h1>
            </div>
          </div>
        </header>

        <section className="recipe-results">
          <div className="section-heading">
            <div>
              <p>Tu coleccion</p>
              <h2>Recetas favoritas</h2>
            </div>
            <span>{favoriteRecipes.length} guardadas</span>
          </div>

          <div className="recipe-list">
            {favoriteRecipes.length > 0 ? (
              favoriteRecipes.map((recipe) => (
                <FavoriteRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRemove={toggleFavorite}
                />
              ))
            ) : (
              <div className="empty-state">
                <strong>No tienes favoritos</strong>
                <p>
                  Explora las recetas y marca tus favoritas para verlas aqui.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNavigation activePage="favoritos" onNavigate={onNavigate} />
    </main>
  );
}
