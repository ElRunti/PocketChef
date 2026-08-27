import { useMemo, useState } from "react";
import { PlusCircle, ShieldCheck, Utensils } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import {
  categories,
  countMissingIngredients,
  filterRecipes,
  getApprovedRecipes,
  getPendingRecipes,
  pantryIngredients,
} from "../recipes/model/recipeModel.js";
import { AppHeader } from "./components/AppHeader.jsx";
import { CategoryTabs } from "./components/CategoryTabs.jsx";
import { FeaturedRecipe } from "./components/FeaturedRecipe.jsx";
import { GuidedModePreview } from "./components/GuidedModePreview.jsx";
import { IngredientSelector } from "./components/IngredientSelector.jsx";
import { RecipeCard } from "./components/RecipeCard.jsx";
import { SearchPanel } from "./components/SearchPanel.jsx";

export function HomePage({
  selectedIngredientIds,
  onToggleIngredient,
  onOpenIngredients,
  onOpenRecipes,
  onSelectRecipe,
  onStartInteractive,
  activeView,
  navItems,
  onNavigate,
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStep, setActiveStep] = useState(0);

  const approvedRecipes = useMemo(() => getApprovedRecipes(), []);
  const pendingRecipes = useMemo(() => getPendingRecipes(), []);
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

  function handlePreviousStep() {
    setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
  }

  function handleNextStep() {
    setActiveStep((currentStep) =>
      Math.min(currentStep + 1, featuredRecipe.steps.length - 1),
    );
  }

  return (
    <main className="app-shell">
      <div className="page-container">
        <AppHeader pendingCount={pendingRecipes.length} />

        <div className="home-layout">
          <div>
            <SearchPanel
              query={query}
              onOpenFilters={() => onOpenRecipes()}
              onQueryChange={setQuery}
            />
            <FeaturedRecipe
              recipe={featuredRecipe}
              matchLabel={`${selectedIngredientIds.length} ingredientes`}
              onStartCooking={() => onStartInteractive(featuredRecipe.id)}
            />
            <CategoryTabs
              activeCategory={activeCategory}
              categories={categories}
              onCategoryChange={setActiveCategory}
            />
            <IngredientSelector
              ingredients={pantryIngredients}
              selectedIngredientIds={selectedIngredientIds}
              onSearchByIngredients={onOpenIngredients}
              onToggleIngredient={onToggleIngredient}
            />
          </div>

          <div>
            <section className="summary-grid">
              <div className="summary-card">
                <Utensils aria-hidden="true" size={20} />
                <strong>{filteredRecipes.length}</strong>
                <span>compatibles</span>
              </div>
              <div className="summary-card">
                <PlusCircle aria-hidden="true" size={20} />
                <strong>Nueva</strong>
                <span>receta</span>
              </div>
              <div className="summary-card">
                <ShieldCheck aria-hidden="true" size={20} />
                <strong>{pendingRecipes.length}</strong>
                <span>revision</span>
              </div>
            </section>

            <section className="recipe-results">
              <div className="section-heading">
                <div>
                  <p>Resultados</p>
                  <h2>Recetas para hoy</h2>
                </div>
                <span>{filteredRecipes.length} listas</span>
              </div>

              <div className="recipe-list">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onSelectRecipe={() => {
                        onSelectRecipe(recipe.id);
                        onOpenRecipes(recipe.id);
                      }}
                      missingIngredients={countMissingIngredients(
                        recipe,
                        selectedIngredientIds,
                      )}
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

            <GuidedModePreview
              activeStep={activeStep}
              steps={featuredRecipe.steps}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
            />
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
