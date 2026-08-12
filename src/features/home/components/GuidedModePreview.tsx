import { ChevronLeft, ChevronRight, Timer } from "lucide-react";

type GuidedModePreviewProps = {
  steps: string[];
  activeStep: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function GuidedModePreview({
  steps,
  activeStep,
  onPrevious,
  onNext,
}: GuidedModePreviewProps) {
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <section className="mt-7 rounded-lg border border-[#dce8d5] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#f15f3b]">
            Modo guiado
          </p>
          <h2 className="text-lg font-black text-[#17201a]">
            Paso {activeStep + 1} de {steps.length}
          </h2>
        </div>
        <div className="grid size-10 place-items-center rounded-lg bg-[#e7f4ee] text-[#1f7a5c]">
          <Timer aria-hidden="true" size={21} />
        </div>
      </div>

      <div className="mt-4 h-2 rounded-lg bg-[#edf2e8]">
        <div
          className="h-2 rounded-lg bg-[#1f7a5c]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 min-h-14 text-base font-bold leading-relaxed text-[#243528]">
        {steps[activeStep]}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#dce8d5] bg-white text-sm font-black text-[#243528] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={activeStep === 0}
          onClick={onPrevious}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={18} />
          Anterior
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1f7a5c] text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-55"
          disabled={activeStep === steps.length - 1}
          onClick={onNext}
          type="button"
        >
          Siguiente
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}
