import { useMemo } from "react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { recipes } from "../recipes/data/recipes.js";
import { FavoriteRecipeCard } from "./components/FavoriteRecipeCard.jsx";

export function FavoritosPage({
  favoriteRecipeIds,
  onOpenRecipeDetail,
  onToggleFavorite,
  activeView,
  navItems,
  onNavigate,
}) {
  const favoriteRecipes = useMemo(() => {
    return recipes.filter((recipe) => favoriteRecipeIds.includes(recipe.id));
  }, [favoriteRecipeIds]);

  return (
    <main className="app-shell screen-page">
      <div className="page-container favorites-page">
        <div className="section-heading page-title-row">
          <div>
            <p>Favoritos</p>
            <h1>Recetas guardadas</h1>
          </div>
          <span>{favoriteRecipes.length} guardadas</span>
        </div>

        <section className="recipe-results">
          <div className="recipe-list">
            {favoriteRecipes.length > 0 ? (
              favoriteRecipes.map((recipe) => (
                <FavoriteRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpenRecipe={onOpenRecipeDetail}
                  onRemove={onToggleFavorite}
                />
              ))
            ) : (
              <div className="empty-state">
                <strong>No tienes favoritos</strong>
                <p>Explora las recetas y marca tus favoritas para verlas aqui.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
