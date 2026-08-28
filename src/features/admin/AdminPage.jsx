import { useState } from "react";
import CommunityRecipes from "./CommunityRecipes.jsx";
import OfficialRecipes from "./OfficialRecipies.jsx";

function AdminPage() {
    const [section, setSection] = useState("community");

    return (
        <main className="admin-page">

            <header className="admin-header">
                <div>
                    <span className="admin-eyebrow">
                        POCKET CHEF
                    </span>

                    <h1>Panel de administrador</h1>

                    <p>
                        Gestiona y revisa las recetas de la comunidad.
                    </p>
                </div>
            </header>

            <nav className="admin-tabs">

                <button
                    type="button"
                    className={
                        section === "community"
                            ? "admin-tab active"
                            : "admin-tab"
                    }
                    onClick={() => setSection("community")}
                >
                    Recetas de la comunidad
                </button>

                <button
                    type="button"
                    className={
                        section === "official"
                            ? "admin-tab active"
                            : "admin-tab"
                    }
                    onClick={() => setSection("official")}
                >
                    Recetas oficiales
                </button>

            </nav>

            <section className="admin-content">

                {section === "community" && (
                    <CommunityRecipes />
                )}

                {section === "official" && (
                    <OfficialRecipes />
                )}

            </section>

        </main>
    );
}

export default AdminPage;