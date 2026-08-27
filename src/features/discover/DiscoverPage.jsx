import { useMemo, useState } from "react";
import { ArrowLeft, Flame, Sparkles } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import {
  getPopularRecipes,
  getRecipesByInterests,
} from "../recipes/model/recipeModel.js";
import { DiscoveryRecipeCard } from "./components/DiscoveryRecipeCard.jsx";
import { useFoodInterests } from "./hooks/useFoodInterests.js";

export function DiscoverPage({
  approvedRecipes,
  categories,
  selectedIngredientIds,
  user,
  getRecipeRating,
  onBack,
  onOpenRecipe,
  activeView,
  navItems,
  onNavigate,
}) {
  const [activeMode, setActiveMode] = useState("for-you");
  const [interestMessage, setInterestMessage] = useState("");
  const { interestCategoryIds, toggleInterest } = useFoodInterests(user);

  async function handleToggleInterest(categoryId) {
    setInterestMessage("");

    try {
      await toggleInterest(categoryId);
    } catch (error) {
      setInterestMessage(error.message || "No se pudo guardar el interes.");
    }
  }

  const recommendations = useMemo(
    () =>
      getRecipesByInterests(
        interestCategoryIds,
        selectedIngredientIds,
        approvedRecipes,
      ),
    [approvedRecipes, interestCategoryIds, selectedIngredientIds],
  );

  const popularRecipes = useMemo(
    () =>
      getPopularRecipes(approvedRecipes).sort((firstRecipe, secondRecipe) => {
        const firstRating = getRecipeRating(firstRecipe);
        const secondRating = getRecipeRating(secondRecipe);
        return (
          secondRating.average * secondRating.count -
          firstRating.average * firstRating.count
        );
      }),
    [approvedRecipes, getRecipeRating],
  );

  const visibleRecipes =
    activeMode === "for-you" ? recommendations : popularRecipes;

  return (
    <main className="app-shell screen-page">
      <div className="page-container discover-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Inicio
        </button>

        <div className="section-heading page-title-row">
          <div>
            <p>Descubre</p>
            <h1>Recetas pensadas para ti</h1>
          </div>
          <Sparkles aria-hidden="true" size={24} />
        </div>

        <section className="interest-picker">
          <div className="section-heading">
            <div>
              <p>Tus intereses</p>
              <h2>Que te gusta cocinar</h2>
            </div>
            <span>{interestCategoryIds.length} elegidos</span>
          </div>
          <div className="interest-chip-list">
            {categories
              .filter((category) => category.id !== "all")
              .map((category) => {
                const selected = interestCategoryIds.includes(category.id);
                return (
                  <button
                    aria-pressed={selected}
                    className={selected ? "selected" : ""}
                    disabled={!user}
                    key={category.id}
                    onClick={() => handleToggleInterest(category.id)}
                    type="button"
                  >
                    {category.label}
                  </button>
                );
              })}
          </div>
          {!user && (
            <p className="auth-access-message">
              Inicia sesion para guardar tus intereses.
            </p>
          )}
          {interestMessage && (
            <p className="auth-message">{interestMessage}</p>
          )}
        </section>

        <div className="segmented-control discovery-modes" role="tablist">
          <button
            aria-selected={activeMode === "for-you"}
            className={activeMode === "for-you" ? "active" : ""}
            onClick={() => setActiveMode("for-you")}
            role="tab"
            type="button"
          >
            <Sparkles aria-hidden="true" size={17} />
            Para ti
          </button>
          <button
            aria-selected={activeMode === "popular"}
            className={activeMode === "popular" ? "active" : ""}
            onClick={() => setActiveMode("popular")}
            role="tab"
            type="button"
          >
            <Flame aria-hidden="true" size={17} />
            Populares
          </button>
        </div>

        <section className="discovery-list">
          {visibleRecipes.length > 0 ? (
            visibleRecipes.map((recipe, index) => (
              <DiscoveryRecipeCard
                categories={categories}
                key={recipe.id}
                onOpenRecipe={onOpenRecipe}
                rating={getRecipeRating(recipe)}
                reason={
                  activeMode === "popular"
                    ? `#${index + 1} entre la comunidad`
                    : recipe.interestMatch
                      ? `${recipe.matchPercent}% compatible contigo`
                      : "Nueva opcion para descubrir"
                }
                recipe={recipe}
              />
            ))
          ) : (
            <div className="empty-state">
              <strong>No hay recetas para mostrar</strong>
              <p>Las recetas aprobadas en Supabase apareceran aqui.</p>
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
