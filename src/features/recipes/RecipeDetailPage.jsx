import { ArrowLeft } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { RecipeDetail } from "./components/RecipeDetail.jsx";

export function RecipeDetailPage({
  selectedRecipe,
  selectedIngredientIds,
  isFavorite,
  onBack,
  onStartInteractive,
  onToggleFavorite,
  activeView,
  navItems,
  onNavigate,
}) {
  return (
    <main className="app-shell screen-page">
      <div className="page-container recipe-detail-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Recetas
        </button>

        <RecipeDetail
          isFavorite={isFavorite}
          onStartInteractive={onStartInteractive}
          onToggleFavorite={onToggleFavorite}
          recipe={selectedRecipe}
          selectedIngredientIds={selectedIngredientIds}
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
