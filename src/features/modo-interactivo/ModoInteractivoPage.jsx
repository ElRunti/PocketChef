import { useState } from "react";
import { ArrowLeft, Check, CircleCheckBig, Utensils } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { getIngredientLabel } from "../recipes/model/recipeModel.js";
import { StepNavigator } from "./components/StepNavigator.jsx";
import { StepTimer } from "./components/StepTimer.jsx";
import { useInteractiveRecipe } from "./controllers/useInteractiveRecipe.js";

export function ModoInteractivoPage({
  pantryIngredients,
  selectedRecipe,
  selectedIngredientIds,
  onBackToRecipe,
  activeView,
  navItems,
  onNavigate,
}) {
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
  const [stepDirection, setStepDirection] = useState("forward");

  function goToNextStep() {
    setStepDirection("forward");
    actions.goToNextStep();
  }

  function goToPreviousStep() {
    setStepDirection("backward");
    actions.goToPreviousStep();
  }

  return (
    <main className="app-shell screen-page">
      <div className="page-container interactive-page">
        <button className="back-button" onClick={onBackToRecipe} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Receta
        </button>

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
              <div
                aria-label="Progreso de la receta"
                aria-valuemax="100"
                aria-valuemin="0"
                aria-valuenow={progress}
                className="progress-track"
                role="progressbar"
              >
                <div
                  className="progress-value"
                  style={{ "--progress": progress / 100 }}
                />
              </div>
            </div>

            <article
              className={`interactive-step-card ${stepDirection}${
                isLastStep ? " complete" : ""
              }`}
              key={activeStep}
            >
              <div className="interactive-step-heading">
                <span>Paso {activeStep + 1}</span>
                {isLastStep && (
                  <CircleCheckBig aria-hidden="true" size={24} strokeWidth={2.4} />
                )}
              </div>
              <p>{currentStep}</p>
            </article>

            <StepNavigator
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
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
                      {getIngredientLabel(ingredientId, pantryIngredients)}
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
