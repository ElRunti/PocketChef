import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { IngredientChip } from "./components/IngredientChip.jsx";
import { PantrySummary } from "./components/PantrySummary.jsx";
import { RecommendedRecipeStrip } from "./components/RecommendedRecipeStrip.jsx";
import { useIngredientSelection } from "./controllers/useIngredientSelection.js";

export function IngredientesPage({
  selectedIngredientIds,
  onToggleIngredient,
  onClearIngredients,
  onOpenRecipes,
  onSelectRecipe,
  activeView,
  navItems,
  onNavigate,
}) {
  const {
    ingredients,
    selectedCount,
    selectedIngredientLabels,
    recommendedRecipes,
    pantryProgress,
  } = useIngredientSelection(selectedIngredientIds);

  return (
    <main className="app-shell screen-page">
      <div className="page-container pantry-page">
        <div className="section-heading page-title-row">
          <div>
            <p>Ingredientes</p>
            <h1>Selecciona lo que tienes</h1>
          </div>
          <span>{selectedCount} activos</span>
        </div>

        <PantrySummary
          selectedCount={selectedCount}
          pantryProgress={pantryProgress}
          selectedIngredientLabels={selectedIngredientLabels}
          onClearIngredients={onClearIngredients}
          onSearchRecipes={onOpenRecipes}
        />

        <section className="pantry-picker">
          <div className="section-heading">
            <div>
              <p>Despensa</p>
              <h2>Ingredientes disponibles</h2>
            </div>
          </div>

          <div className="pantry-chip-grid">
            {ingredients.map((ingredient) => (
              <IngredientChip
                ingredient={ingredient}
                isSelected={selectedIngredientIds.includes(ingredient.id)}
                key={ingredient.id}
                onToggle={onToggleIngredient}
              />
            ))}
          </div>
        </section>

        <RecommendedRecipeStrip
          recipes={recommendedRecipes}
          onSelectRecipe={onSelectRecipe}
        />
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
