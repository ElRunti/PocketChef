import { ChevronLeft, ChevronRight, Timer } from "lucide-react";

export function GuidedModePreview({ steps, activeStep, onPrevious, onNext }) {
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <section className="guided-mode">
      <div className="guided-header">
        <div>
          <p>Modo guiado</p>
          <h2>
            Paso {activeStep + 1} de {steps.length}
          </h2>
        </div>
        <div className="guided-icon">
          <Timer aria-hidden="true" size={21} />
        </div>
      </div>

      <div className="progress-track">
        <div className="progress-value" style={{ width: `${progress}%` }} />
      </div>

      <p className="guided-step">{steps[activeStep]}</p>

      <div className="guided-actions">
        <button disabled={activeStep === 0} onClick={onPrevious} type="button">
          <ChevronLeft aria-hidden="true" size={18} />
          Anterior
        </button>
        <button disabled={activeStep === steps.length - 1} onClick={onNext} type="button">
          Siguiente
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}
