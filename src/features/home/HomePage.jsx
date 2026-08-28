import { useMemo, useState } from "react";
import {
  Refrigerator,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  Utensils,
} from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import {
  countMissingIngredients,
  filterRecipes,
} from "../recipes/model/recipeModel.js";
import { AppHeader } from "./components/AppHeader.jsx";
import { CategoryTabs } from "./components/CategoryTabs.jsx";
import { FeaturedRecipe } from "./components/FeaturedRecipe.jsx";
import { IngredientSelector } from "./components/IngredientSelector.jsx";
import { RecipeCard } from "./components/RecipeCard.jsx";
import { SearchPanel } from "./components/SearchPanel.jsx";

export function HomePage({
  approvedRecipes,
  categories,
  currentProfile,
  isAdmin,
  isAuthenticated,
  pendingRecipes,
  pantryIngredients,
  syncState,
  selectedIngredientIds,
  isFavorite,
  onToggleFavorite,
  onToggleIngredient,
  onOpenIngredients,
  onOpenAccount,
  onOpenAdmin,
  onOpenDiscover,
  onOpenRecipes,
  onOpenRecipeDetail,
  onOpenUserDashboard,
  onStartInteractive,
  activeView,
  navItems,
  onNavigate,
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const featuredRecipe = approvedRecipes[0];

  const filteredRecipes = useMemo(() => {
    return filterRecipes({
      recipeList: approvedRecipes,
      query,
      categoryId: activeCategory,
      selectedIngredientIds,
      onlyAvailable: true,
    });
  }, [activeCategory, approvedRecipes, query, selectedIngredientIds]);

  return (
    <main className="app-shell screen-page">
      <div className="page-container">
        <AppHeader
          currentProfile={currentProfile}
          isAdmin={isAdmin}
          isAuthenticated={isAuthenticated}
          onOpenAccount={onOpenAccount}
          onOpenAdmin={onOpenAdmin}
          onOpenDiscover={onOpenDiscover}
          onOpenUserDashboard={onOpenUserDashboard}
          pendingCount={pendingRecipes.length}
        />

        <div className="home-layout">
          <div className="home-primary">
            <SearchPanel
              query={query}
              onOpenFilters={() => onOpenRecipes()}
              onQueryChange={setQuery}
            />
            <div className="section-heading featured-heading">
              <div>
                <p>Destacada</p>
                <h2>Elegida para ti</h2>
              </div>
              <button onClick={onOpenDiscover} type="button">
                Ver todas
              </button>
            </div>
            {featuredRecipe ? (
              <FeaturedRecipe
                recipe={featuredRecipe}
                matchLabel={`${selectedIngredientIds.length} ingredientes`}
                onStartCooking={() => onStartInteractive(featuredRecipe.id)}
              />
            ) : (
              <div className={`data-source-state ${syncState.status}`}>
                <strong>
                  {syncState.status === "loading"
                    ? "Cargando recetas"
                    : syncState.status === "error"
                      ? "No se pudo cargar la informacion"
                      : "Aun no hay recetas publicadas"}
                </strong>
                <p>{syncState.message}</p>
              </div>
            )}
            <section className="home-categories">
              <div className="section-heading">
                <div>
                  <p>Categorias</p>
                  <h2>¿Que quieres cocinar?</h2>
                </div>
              </div>
              <CategoryTabs
                activeCategory={activeCategory}
                categories={categories}
                onCategoryChange={setActiveCategory}
              />
            </section>

            <section className="recipe-results">
              <div className="section-heading">
                <div>
                  <p>Populares</p>
                  <h2>Recetas para hoy</h2>
                </div>
                <button onClick={() => onOpenRecipes()} type="button">
                  Ver todas
                </button>
              </div>

              <div className="recipe-list">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe) => (
                    <RecipeCard
                      isFavorite={isFavorite(recipe.id)}
                      key={recipe.id}
                      missingIngredients={countMissingIngredients(
                        recipe,
                        selectedIngredientIds,
                      )}
                      onSelectRecipe={() => onOpenRecipeDetail(recipe.id)}
                      onToggleFavorite={onToggleFavorite}
                      recipe={recipe}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <strong>No hay recetas exactas</strong>
                    <p>
                      Quita un ingrediente o cambia la categoria para probar
                      otra combinacion.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="home-utility">
            <section className="home-action-section">
              <div className="section-heading">
                <div>
                  <p>Accesos</p>
                  <h2>Tu cocina</h2>
                </div>
              </div>
              <div className="home-action-grid">
                <button onClick={onOpenIngredients} type="button">
                  <Refrigerator aria-hidden="true" size={22} />
                  <strong>Ingredientes</strong>
                  <span>Arma tu despensa</span>
                </button>
                <button onClick={() => onOpenRecipes()} type="button">
                  <Search aria-hidden="true" size={22} />
                  <strong>Recetas</strong>
                  <span>Busca y filtra</span>
                </button>
                <button
                  disabled={!featuredRecipe}
                  onClick={() => onStartInteractive(featuredRecipe.id)}
                  type="button"
                >
                  <Timer aria-hidden="true" size={22} />
                  <strong>Modo guiado</strong>
                  <span>Cocina paso a paso</span>
                </button>
                <button onClick={onOpenDiscover} type="button">
                  <Sparkles aria-hidden="true" size={22} />
                  <strong>Descubre</strong>
                  <span>Para ti y populares</span>
                </button>
              </div>
            </section>

            <IngredientSelector
              ingredients={pantryIngredients}
              selectedIngredientIds={selectedIngredientIds}
              onSearchByIngredients={onOpenIngredients}
              onToggleIngredient={onToggleIngredient}
            />

            <section className="summary-grid">
              <div className="summary-card">
                <Utensils aria-hidden="true" size={20} />
                <strong>{filteredRecipes.length}</strong>
                <span>compatibles</span>
              </div>
              <div className="summary-card">
                <Refrigerator aria-hidden="true" size={20} />
                <strong>{selectedIngredientIds.length}</strong>
                <span>ingredientes</span>
              </div>
              <div className="summary-card">
                <ShieldCheck aria-hidden="true" size={20} />
                <strong>{pendingRecipes.length}</strong>
                <span>revision</span>
              </div>
            </section>
          </aside>
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
