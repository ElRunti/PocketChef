import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import RecipeForm from "./components/RecipeForm.jsx";

function SubirRecetaPage({ activeView, navItems, onNavigate, onSubmitRecipe }) {
  return (
    <main className="app-shell screen-page">
      <div className="page-container recipe-upload-page">
        <div className="section-heading recipe-upload-header page-title-row">
          <div>
            <p>Pocket Chef</p>
            <h1>Comparte tu receta</h1>
          </div>

          <span>Nueva receta</span>
        </div>

        <RecipeForm onSubmitRecipe={onSubmitRecipe} />
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}

export default SubirRecetaPage;
