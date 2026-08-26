import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import RecipeForm from "./components/RecipeForm.jsx";

function SubirRecetaPage() {
    return (
        <main className="app-shell">
            <div className="page-container recipe-upload-page">

                <div className="section-heading recipe-upload-header">
                    <div>
                        <p>Pocket Chef</p>
                        <h1>Comparte tu receta</h1>
                    </div>

                    <span>Nueva receta</span>
                </div>

                <RecipeForm />

            </div>

            <BottomNavigation />
        </main>
    );
}

export default SubirRecetaPage;