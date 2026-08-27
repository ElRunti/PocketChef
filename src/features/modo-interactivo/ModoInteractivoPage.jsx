import { Check, Clock, Utensils } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import {
  getApprovedRecipes,
  getIngredientLabel,
} from "../recipes/model/recipeModel.js";
import { StepNavigator } from "./components/StepNavigator.jsx";
import { StepTimer } from "./components/StepTimer.jsx";
import { useInteractiveRecipe } from "./controllers/useInteractiveRecipe.js";

export function ModoInteractivoPage({
  selectedRecipe,
  selectedIngredientIds,
  onSelectRecipe,
  activeView,
  navItems,
  onNavigate,
}) {
  const approvedRecipes = getApprovedRecipes();
  const {
    activeStep,
    currentStep,
    isFirstStep,
    isLastStep,
    isTimerRunning,
    progress,
    remainingSeconds,
    timerLabel,
    totalSteps,
    actions,
  } = useInteractiveRecipe(selectedRecipe);

  return (
    <main className="app-shell">
      <div className="page-container interactive-page">
        <div className="section-heading page-title-row">
          <div>
            <p>Modo interactivo</p>
            <h1>Cocina paso a paso</h1>
          </div>
          <span>
            Paso {activeStep + 1} de {totalSteps}
          </span>
        </div>

        <div className="interactive-layout">
          <aside className="interactive-recipe-picker">
            <div className="section-heading">
              <div>
                <p>Receta activa</p>
                <h2>Elige que cocinar</h2>
              </div>
            </div>

            <div className="interactive-recipe-list">
              {approvedRecipes.map((recipe) => (
                <button
                  className={
                    recipe.id === selectedRecipe.id
                      ? "interactive-recipe-option active"
                      : "interactive-recipe-option"
                  }
                  key={recipe.id}
                  onClick={() => onSelectRecipe(recipe.id)}
                  type="button"
                >
                  <img alt={recipe.title} src={recipe.image} />
                  <span>
                    <strong>{recipe.title}</strong>
                    <small>
                      <Clock aria-hidden="true" size={14} />
                      {recipe.time}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <section className="interactive-stage">
            <div className="interactive-image">
              <img alt={selectedRecipe.title} src={selectedRecipe.image} />
              <div>
                <span>{selectedRecipe.difficulty}</span>
                <strong>{selectedRecipe.title}</strong>
              </div>
            </div>

            <div className="interactive-progress">
              <span>{progress}% listo</span>
              <div className="progress-track">
                <div className="progress-value" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <article className="interactive-step-card">
              <span>Paso {activeStep + 1}</span>
              <p>{currentStep}</p>
            </article>

            <StepNavigator
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              onNext={actions.goToNextStep}
              onPrevious={actions.goToPreviousStep}
            />
          </section>

          <aside className="interactive-side-panel">
            <StepTimer
              isRunning={isTimerRunning}
              remainingSeconds={remainingSeconds}
              timerLabel={timerLabel}
              onReset={actions.resetTimer}
              onToggle={actions.toggleTimer}
            />

            <section className="cooking-checklist">
              <div>
                <Utensils aria-hidden="true" size={20} />
                <span>Ingredientes</span>
              </div>
              <ul>
                {selectedRecipe.ingredientIds.map((ingredientId) => {
                  const isAvailable = selectedIngredientIds.includes(ingredientId);

                  return (
                    <li className={isAvailable ? "ready" : ""} key={ingredientId}>
                      <Check aria-hidden="true" size={15} />
                      {getIngredientLabel(ingredientId)}
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
