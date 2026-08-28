import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Carrot,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ListChecks,
  Tags,
  XCircle,
} from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { AdminCatalogManager } from "./components/AdminCatalogManager.jsx";
import { ModerationRecipeCard } from "./components/ModerationRecipeCard.jsx";

const recipeFilters = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobadas" },
  { id: "rejected", label: "Rechazadas" },
  { id: "all", label: "Todas" },
];

const sections = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "recipes", label: "Recetas", icon: ListChecks },
  { id: "ingredients", label: "Ingredientes", icon: Carrot },
  { id: "categories", label: "Categorias", icon: Tags },
];

export function AdminPage({
  categories,
  ingredients,
  recipeCatalog,
  onAddCategory,
  onAddIngredient,
  onBack,
  onEditRecipe,
  onModerateRecipe,
  onRemoveCategory,
  onRemoveIngredient,
  onRenameCategory,
  onRenameIngredient,
  activeView,
  navItems,
  onNavigate,
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeFilter, setActiveFilter] = useState("pending");
  const [moderatingId, setModeratingId] = useState(null);
  const [moderationMessage, setModerationMessage] = useState("");
  const editableCategories = categories.filter(
    (category) => category.id !== "all",
  );

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

  async function moderateRecipe(recipeId, status) {
    setModeratingId(recipeId);
    setModerationMessage("");

    try {
      await onModerateRecipe(recipeId, status);
      setModerationMessage(
        status === "approved"
          ? "Receta aprobada y publicada."
          : "Receta rechazada correctamente.",
      );
    } catch (error) {
      setModerationMessage(error.message || "No se pudo moderar la receta.");
    } finally {
      setModeratingId(null);
    }
  }

  function renderRecipeList(recipes) {
    return recipes.length > 0 ? (
      recipes.map((recipe) => (
        <ModerationRecipeCard
          categories={categories}
          disabled={moderatingId === recipe.id}
          key={recipe.id}
          onEdit={onEditRecipe}
          onModerate={moderateRecipe}
          recipe={recipe}
        />
      ))
    ) : (
      <div className="empty-state">
        <strong>No hay recetas en este estado</strong>
        <p>Las nuevas solicitudes apareceran aqui.</p>
      </div>
    );
  }

  return (
    <main className="app-shell screen-page">
      <div className="page-container admin-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Inicio
        </button>

        <div className="section-heading page-title-row admin-title-row">
          <div>
            <p>Administracion</p>
            <h1>Panel de Pocket Chef</h1>
          </div>
          <span>Administrador</span>
        </div>

        <nav aria-label="Secciones administrativas" className="admin-sections">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                aria-current={activeSection === section.id ? "page" : undefined}
                className={activeSection === section.id ? "active" : ""}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                type="button"
              >
                <Icon aria-hidden="true" size={17} />
                {section.label}
                {section.id === "recipes" && counts.pending > 0 && (
                  <span>{counts.pending}</span>
                )}
              </button>
            );
          })}
        </nav>

        {activeSection === "overview" && (
          <>
            <section className="admin-summary" aria-label="Resumen administrativo">
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
                <Carrot aria-hidden="true" size={20} />
                <strong>{ingredients.length}</strong>
                <span>Ingredientes</span>
              </div>
              <div>
                <Tags aria-hidden="true" size={20} />
                <strong>{editableCategories.length}</strong>
                <span>Categorias</span>
              </div>
            </section>

            <section className="admin-quick-actions">
              <div className="section-heading">
                <div>
                  <p>Acciones</p>
                  <h2>Gestion rapida</h2>
                </div>
              </div>
              <div>
                <button onClick={() => setActiveSection("recipes")} type="button">
                  <ListChecks aria-hidden="true" size={20} />
                  <span>
                    <strong>Revisar recetas</strong>
                    <small>{counts.pending} pendientes</small>
                  </span>
                </button>
                <button
                  onClick={() => setActiveSection("ingredients")}
                  type="button"
                >
                  <Carrot aria-hidden="true" size={20} />
                  <span>
                    <strong>Agregar ingrediente</strong>
                    <small>{ingredients.length} disponibles</small>
                  </span>
                </button>
                <button
                  onClick={() => setActiveSection("categories")}
                  type="button"
                >
                  <Tags aria-hidden="true" size={20} />
                  <span>
                    <strong>Organizar categorias</strong>
                    <small>{editableCategories.length} activas</small>
                  </span>
                </button>
              </div>
            </section>

            <section className="admin-pending-preview">
              <div className="section-heading">
                <div>
                  <p>Moderacion</p>
                  <h2>Recetas pendientes</h2>
                </div>
                {counts.pending > 3 && (
                  <button onClick={() => setActiveSection("recipes")} type="button">
                    Ver todas
                  </button>
                )}
              </div>
              <div className="moderation-list">
                {renderRecipeList(
                  recipeCatalog
                    .filter((recipe) => recipe.status === "pending")
                    .slice(0, 3),
                )}
              </div>
            </section>
          </>
        )}

        {activeSection === "recipes" && (
          <section className="admin-workspace">
            <div className="section-heading">
              <div>
                <p>Moderacion</p>
                <h2>Revision de recetas</h2>
              </div>
              <span>{counts.pending} pendientes</span>
            </div>

            <div className="admin-recipe-summary" aria-label="Estados de recetas">
              <span>
                <Clock3 aria-hidden="true" size={16} /> {counts.pending}
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" size={16} /> {counts.approved}
              </span>
              <span>
                <XCircle aria-hidden="true" size={16} /> {counts.rejected}
              </span>
            </div>

            <div className="segmented-control moderation-filters" role="tablist">
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

            {moderationMessage && (
              <p aria-live="polite" className="admin-action-message">
                {moderationMessage}
              </p>
            )}

            <div className="moderation-list">
              {renderRecipeList(filteredRecipes)}
            </div>
          </section>
        )}

        {activeSection === "ingredients" && (
          <AdminCatalogManager
            items={ingredients}
            onAdd={onAddIngredient}
            onRemove={onRemoveIngredient}
            onRename={onRenameIngredient}
            type="ingredient"
          />
        )}

        {activeSection === "categories" && (
          <AdminCatalogManager
            items={editableCategories}
            onAdd={onAddCategory}
            onRemove={onRemoveCategory}
            onRename={onRenameCategory}
            type="category"
          />
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
