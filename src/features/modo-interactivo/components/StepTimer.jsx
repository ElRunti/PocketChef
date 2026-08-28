import { Pause, Play, RotateCcw, Timer } from "lucide-react";

export function StepTimer({
  isRunning,
  remainingSeconds,
  timerLabel,
  onReset,
  onToggle,
}) {
  const isFinished = remainingSeconds === 0;

  return (
    <section
      className={`step-timer${
        isFinished ? " finished" : isRunning ? " running" : ""
      }`}
    >
      <div>
        <Timer aria-hidden="true" size={22} />
        <span>Temporizador</span>
      </div>
      <strong>{timerLabel}</strong>
      <div className="timer-actions">
        <button disabled={isFinished} onClick={onToggle} type="button">
          {isRunning ? (
            <Pause aria-hidden="true" size={17} />
          ) : (
            <Play aria-hidden="true" size={17} />
          )}
          {isRunning ? "Pausar" : "Iniciar"}
        </button>
        <button onClick={onReset} type="button">
          <RotateCcw aria-hidden="true" size={17} />
          Reiniciar
        </button>
      </div>
    </section>
  );
}
