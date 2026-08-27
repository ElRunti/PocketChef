import { ArrowLeft } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { RecipeDetail } from "./components/RecipeDetail.jsx";

export function RecipeDetailPage({
  selectedRecipe,
  selectedIngredientIds,
  isFavorite,
  communityRating,
  onBack,
  onOpenCommunity,
  onShareRecipe,
  onStartInteractive,
  onToggleFavorite,
  shareStatus,
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
          communityRating={communityRating}
          isFavorite={isFavorite}
          onStartInteractive={onStartInteractive}
          onOpenCommunity={onOpenCommunity}
          onShareRecipe={onShareRecipe}
          onToggleFavorite={onToggleFavorite}
          recipe={selectedRecipe}
          selectedIngredientIds={selectedIngredientIds}
          shareStatus={shareStatus}
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
