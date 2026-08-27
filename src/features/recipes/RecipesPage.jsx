import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { RecipeFilters } from "./components/RecipeFilters.jsx";
import { RecipeResultCard } from "./components/RecipeResultCard.jsx";
import { useRecipeFilters } from "./controllers/useRecipeFilters.js";

export function RecipesPage({
  approvedRecipes,
  categories,
  pantryIngredients,
  selectedIngredientIds,
  selectedRecipeId,
  onOpenRecipeDetail,
  activeView,
  navItems,
  onNavigate,
}) {
  const { filteredRecipes, selectedRecipe, filters, actions } =
    useRecipeFilters(
      selectedIngredientIds,
      selectedRecipeId,
      approvedRecipes,
    );

  return (
    <main className="app-shell screen-page">
      <div className="page-container recipes-page">
        <div className="section-heading page-title-row">
          <div>
            <p>Recetas</p>
            <h1>Explora que puedes cocinar</h1>
          </div>
          <span>{filteredRecipes.length} resultados</span>
        </div>

        <div className="recipes-layout">
          <div className="recipes-sidebar">
            <RecipeFilters
              categories={categories}
              filters={filters}
              actions={actions}
              pantryIngredients={pantryIngredients}
              selectedIngredientIds={selectedIngredientIds}
            />

            <section className="recipe-result-list">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <RecipeResultCard
                    categories={categories}
                    isActive={recipe.id === selectedRecipe?.id}
                    key={recipe.id}
                    onSelectRecipe={onOpenRecipeDetail}
                    recipe={recipe}
                    selectedIngredientIds={selectedIngredientIds}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <strong>No encontramos recetas</strong>
                  <p>Ajusta los filtros o agrega mas ingredientes a tu despensa.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
