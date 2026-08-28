import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Heart,
  Plus,
  XCircle,
} from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { FavoriteRecipeCard } from "../favoritos/components/FavoriteRecipeCard.jsx";
import { UserRecipeCard } from "./components/UserRecipeCard.jsx";

const recipeFilters = [
  { id: "all", label: "Todas" },
  { id: "pending", label: "En revision" },
  { id: "approved", label: "Publicadas" },
  { id: "rejected", label: "Rechazadas" },
];

export function UserDashboardPage({
  activeView,
  approvedRecipes,
  categories,
  currentProfile,
  favoriteRecipeIds,
  navItems,
  onBack,
  onNavigate,
  onOpenRecipe,
  onOpenRecipes,
  onOpenUpload,
  onToggleFavorite,
  userRecipes,
}) {
  const [activeSection, setActiveSection] = useState("recipes");
  const [activeFilter, setActiveFilter] = useState("all");

  const favoriteRecipes = useMemo(
    () =>
      approvedRecipes.filter((recipe) =>
        favoriteRecipeIds.includes(recipe.id),
      ),
    [approvedRecipes, favoriteRecipeIds],
  );

  const counts = useMemo(
    () => ({
      approved: userRecipes.filter((recipe) => recipe.status === "approved")
        .length,
      pending: userRecipes.filter((recipe) => recipe.status === "pending")
        .length,
      rejected: userRecipes.filter((recipe) => recipe.status === "rejected")
        .length,
    }),
    [userRecipes],
  );

  const filteredRecipes = useMemo(
    () =>
      activeFilter === "all"
        ? userRecipes
        : userRecipes.filter((recipe) => recipe.status === activeFilter),
    [activeFilter, userRecipes],
  );

  function getCategoryLabel(categoryId) {
    return (
      categories.find((category) => category.id === categoryId)?.label ??
      "Sin categoria"
    );
  }

  return (
    <main className="app-shell screen-page">
      <div className="page-container user-dashboard-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Inicio
        </button>

        <div className="section-heading page-title-row user-dashboard-title">
          <div>
            <p>Mi espacio</p>
            <h1>Mi cocina</h1>
          </div>
          <span aria-label="Usuario registrado">
            {(currentProfile?.name ?? "C").charAt(0).toUpperCase()}
          </span>
        </div>

        <p className="user-dashboard-welcome">
          Recetas de {currentProfile?.name ?? "Chef"}
        </p>

        <section aria-label="Resumen de mi cocina" className="user-summary">
          <div>
            <BookOpenCheck aria-hidden="true" size={20} />
            <strong>{userRecipes.length}</strong>
            <span>Mis recetas</span>
          </div>
          <div>
            <Clock3 aria-hidden="true" size={20} />
            <strong>{counts.pending}</strong>
            <span>En revision</span>
          </div>
          <div>
            <CheckCircle2 aria-hidden="true" size={20} />
            <strong>{counts.approved}</strong>
            <span>Publicadas</span>
          </div>
          <div>
            <Heart aria-hidden="true" size={20} />
            <strong>{favoriteRecipes.length}</strong>
            <span>Favoritos</span>
          </div>
        </section>

        <div className="user-dashboard-actions">
          <button onClick={onOpenUpload} type="button">
            <Plus aria-hidden="true" size={18} />
            Publicar receta
          </button>
          <button className="secondary" onClick={onOpenRecipes} type="button">
            <BookOpenCheck aria-hidden="true" size={18} />
            Explorar recetas
          </button>
        </div>

        <div
          aria-label="Contenido de Mi cocina"
          className="user-dashboard-tabs"
          role="tablist"
        >
          <button
            aria-selected={activeSection === "recipes"}
            className={activeSection === "recipes" ? "active" : ""}
            onClick={() => setActiveSection("recipes")}
            role="tab"
            type="button"
          >
            <BookOpenCheck aria-hidden="true" size={17} />
            Mis recetas
            <span>{userRecipes.length}</span>
          </button>
          <button
            aria-selected={activeSection === "favorites"}
            className={activeSection === "favorites" ? "active" : ""}
            onClick={() => setActiveSection("favorites")}
            role="tab"
            type="button"
          >
            <Heart aria-hidden="true" size={17} />
            Favoritos
            <span>{favoriteRecipes.length}</span>
          </button>
        </div>

        {activeSection === "recipes" && (
          <section className="user-dashboard-content">
            <div className="section-heading">
              <div>
                <p>Publicaciones</p>
                <h2>Recetas que compartiste</h2>
              </div>
              <span>{filteredRecipes.length}</span>
            </div>

            <div className="segmented-control user-recipe-filters" role="tablist">
              {recipeFilters.map((filter) => (
                <button
                  aria-selected={activeFilter === filter.id}
                  className={activeFilter === filter.id ? "active" : ""}
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  role="tab"
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="user-recipe-list">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <UserRecipeCard
                    category={getCategoryLabel(recipe.categoryId)}
                    key={recipe.id}
                    onOpen={onOpenRecipe}
                    recipe={recipe}
                  />
                ))
              ) : (
                <div className="empty-state user-dashboard-empty">
                  <XCircle aria-hidden="true" size={24} />
                  <strong>No hay recetas en este estado</strong>
                  <p>Cuando compartas una receta podras seguir su revision aqui.</p>
                  <button onClick={onOpenUpload} type="button">
                    <Plus aria-hidden="true" size={17} />
                    Publicar receta
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === "favorites" && (
          <section className="user-dashboard-content">
            <div className="section-heading">
              <div>
                <p>Guardadas</p>
                <h2>Mis recetas favoritas</h2>
              </div>
              <span>{favoriteRecipes.length}</span>
            </div>

            <div className="recipe-list user-favorite-list">
              {favoriteRecipes.length > 0 ? (
                favoriteRecipes.map((recipe) => (
                  <FavoriteRecipeCard
                    key={recipe.id}
                    onOpenRecipe={onOpenRecipe}
                    onRemove={onToggleFavorite}
                    recipe={recipe}
                  />
                ))
              ) : (
                <div className="empty-state user-dashboard-empty">
                  <Heart aria-hidden="true" size={24} />
                  <strong>Aun no guardaste favoritos</strong>
                  <p>Marca con el corazon las recetas que quieras encontrar rapido.</p>
                  <button onClick={onOpenRecipes} type="button">
                    <BookOpenCheck aria-hidden="true" size={17} />
                    Explorar recetas
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
