import { useEffect, useMemo, useState } from "react";
import { getRecipeTimeMinutes } from "../../recipes/model/recipeModel.js";

function getStepSeconds(recipe, stepIndex) {
  if (!recipe) {
    return 60;
  }

  const configuredMinutes = recipe?.stepTimers?.[stepIndex];

  if (configuredMinutes) {
    return configuredMinutes * 60;
  }

  const stepCount = recipe?.steps.length ?? 1;
  const minutesByStep = Math.max(1, Math.ceil(getRecipeTimeMinutes(recipe) / stepCount));

  return minutesByStep * 60;
}

export function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function useInteractiveRecipe(recipe) {
  const [activeStep, setActiveStep] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getStepSeconds(recipe, 0),
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const totalSteps = recipe?.steps.length ?? 0;
  const currentStep = recipe?.steps[activeStep] ?? "";
  const progress = totalSteps > 0 ? Math.round(((activeStep + 1) / totalSteps) * 100) : 0;
  const timerLabel = useMemo(
    () => formatTimer(remainingSeconds),
    [remainingSeconds],
  );

  useEffect(() => {
    setActiveStep(0);
    setRemainingSeconds(getStepSeconds(recipe, 0));
    setIsTimerRunning(false);
  }, [recipe]);

  useEffect(() => {
    if (!isTimerRunning || remainingSeconds <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning, remainingSeconds]);

  function goToPreviousStep() {
    setActiveStep((currentStepIndex) => {
      const nextStepIndex = Math.max(currentStepIndex - 1, 0);
      setRemainingSeconds(getStepSeconds(recipe, nextStepIndex));
      setIsTimerRunning(false);
      return nextStepIndex;
    });
  }

  function goToNextStep() {
    setActiveStep((currentStepIndex) => {
      const nextStepIndex = Math.min(currentStepIndex + 1, totalSteps - 1);
      setRemainingSeconds(getStepSeconds(recipe, nextStepIndex));
      setIsTimerRunning(false);
      return nextStepIndex;
    });
  }

  function resetTimer() {
    setRemainingSeconds(getStepSeconds(recipe, activeStep));
    setIsTimerRunning(false);
  }

  function toggleTimer() {
    setIsTimerRunning((currentState) => !currentState);
  }

  return {
    activeStep,
    currentStep,
    isFirstStep: activeStep === 0,
    isLastStep: activeStep === totalSteps - 1,
    isTimerRunning,
    progress,
    remainingSeconds,
    timerLabel,
    totalSteps,
    actions: {
      goToNextStep,
      goToPreviousStep,
      resetTimer,
      toggleTimer,
    },
  };
}
