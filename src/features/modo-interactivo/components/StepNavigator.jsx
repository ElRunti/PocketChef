import { Check, ChevronLeft, ChevronRight } from "lucide-react";

export function StepNavigator({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
}) {
  return (
    <div className="interactive-actions">
      <button disabled={isFirstStep} onClick={onPrevious} type="button">
        <ChevronLeft aria-hidden="true" size={19} />
        Anterior
      </button>
      <button disabled={isLastStep} onClick={onNext} type="button">
        {isLastStep ? "Listo" : "Siguiente"}
        {isLastStep ? (
          <Check aria-hidden="true" size={19} />
        ) : (
          <ChevronRight aria-hidden="true" size={19} />
        )}
      </button>
    </div>
  );
}
