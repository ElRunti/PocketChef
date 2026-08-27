import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { ModerationRecipeCard } from "./components/ModerationRecipeCard.jsx";

const filters = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobadas" },
  { id: "rejected", label: "Rechazadas" },
  { id: "all", label: "Todas" },
];

export function AdminPage({
  recipeCatalog,
  onBack,
  onEditRecipe,
  onModerateRecipe,
  activeView,
  navItems,
  onNavigate,
}) {
  const [activeFilter, setActiveFilter] = useState("pending");

  const filteredRecipes = useMemo(
    () =>
      activeFilter === "all"
        ? recipeCatalog
        : recipeCatalog.filter((recipe) => recipe.status === activeFilter),
    [activeFilter, recipeCatalog],
  );

  const counts = useMemo(
    () => ({
      pending: recipeCatalog.filter((recipe) => recipe.status === "pending").length,
      approved: recipeCatalog.filter((recipe) => recipe.status === "approved").length,
      rejected: recipeCatalog.filter((recipe) => recipe.status === "rejected").length,
    }),
    [recipeCatalog],
  );

  return (
    <main className="app-shell screen-page">
      <div className="page-container admin-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Inicio
        </button>

        <div className="section-heading page-title-row">
          <div>
            <p>Administracion</p>
            <h1>Revision de recetas</h1>
          </div>
          <span>{counts.pending} pendientes</span>
        </div>

        <section className="admin-summary" aria-label="Resumen de moderacion">
          <div>
            <Clock3 aria-hidden="true" size={20} />
            <strong>{counts.pending}</strong>
            <span>Pendientes</span>
          </div>
          <div>
            <CheckCircle2 aria-hidden="true" size={20} />
            <strong>{counts.approved}</strong>
            <span>Aprobadas</span>
          </div>
          <div>
            <XCircle aria-hidden="true" size={20} />
            <strong>{counts.rejected}</strong>
            <span>Rechazadas</span>
          </div>
        </section>

        <div className="segmented-control moderation-filters" role="tablist">
          {filters.map((filter) => (
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

        <section className="moderation-list">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <ModerationRecipeCard
                key={recipe.id}
                onEdit={onEditRecipe}
                onModerate={onModerateRecipe}
                recipe={recipe}
              />
            ))
          ) : (
            <div className="empty-state">
              <strong>No hay recetas en este estado</strong>
              <p>Las nuevas solicitudes apareceran aqui.</p>
            </div>
          )}
        </section>
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
