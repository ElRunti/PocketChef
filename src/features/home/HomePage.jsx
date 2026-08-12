import { useMemo, useState } from "react";
import { PlusCircle, ShieldCheck, Utensils } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import {
  categories,
  pantryIngredients,
  recipes,
} from "../recipes/data/recipes.js";
import { AppHeader } from "./components/AppHeader.jsx";
import { CategoryTabs } from "./components/CategoryTabs.jsx";
import { FeaturedRecipe } from "./components/FeaturedRecipe.jsx";
import { GuidedModePreview } from "./components/GuidedModePreview.jsx";
import { IngredientSelector } from "./components/IngredientSelector.jsx";
import { RecipeCard } from "./components/RecipeCard.jsx";
import { SearchPanel } from "./components/SearchPanel.jsx";

const initialIngredients = ["egg", "tomato", "cheese", "tortilla", "avocado"];

function countMissingIngredients(recipe, selectedIngredientIds) {
  if (selectedIngredientIds.length === 0) {
    return 0;
  }

  return recipe.ingredientIds.filter(
    (ingredientId) => !selectedIngredientIds.includes(ingredientId),
  ).length;
}

export function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedIngredientIds, setSelectedIngredientIds] =
    useState(initialIngredients);
  const [activeStep, setActiveStep] = useState(0);

  const approvedRecipes = recipes.filter((recipe) => recipe.status === "approved");
  const pendingRecipes = recipes.filter((recipe) => recipe.status === "pending");
  const featuredRecipe = approvedRecipes[0];

  const filteredRecipes = useMemo(() => {
    return approvedRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesCategory =
        activeCategory === "all" || recipe.categoryId === activeCategory;
      const matchesIngredients =
        selectedIngredientIds.length === 0 ||
        recipe.ingredientIds.every((ingredientId) =>
          selectedIngredientIds.includes(ingredientId),
        );

      return matchesSearch && matchesCategory && matchesIngredients;
    });
  }, [activeCategory, approvedRecipes, query, selectedIngredientIds]);

  function toggleIngredient(ingredientId) {
    setSelectedIngredientIds((currentIngredients) =>
      currentIngredients.includes(ingredientId)
        ? currentIngredients.filter((id) => id !== ingredientId)
        : [...currentIngredients, ingredientId],
    );
  }

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
            <SearchPanel query={query} onQueryChange={setQuery} />
            <FeaturedRecipe
              recipe={featuredRecipe}
              matchLabel={`${selectedIngredientIds.length} ingredientes`}
            />
            <CategoryTabs
              activeCategory={activeCategory}
              categories={categories}
              onCategoryChange={setActiveCategory}
            />
            <IngredientSelector
              ingredients={pantryIngredients}
              selectedIngredientIds={selectedIngredientIds}
              onToggleIngredient={toggleIngredient}
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

      <BottomNavigation />
    </main>
  );
}
