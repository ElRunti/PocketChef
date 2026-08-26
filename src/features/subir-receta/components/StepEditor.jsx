function StepEditor({ steps, setSteps }) {
    const handleStepChange = (index, value) => {
        setSteps((currentSteps) =>
            currentSteps.map((step, stepIndex) =>
                stepIndex === index
                    ? { ...step, text: value }
                    : step
            )
        );
    };

    const handleTimerChange = (index, checked) => {
        setSteps((currentSteps) =>
            currentSteps.map((step, stepIndex) =>
                stepIndex === index
                    ? {
                          ...step,
                          hasTimer: checked,
                          timerMinutes: checked
                              ? step.timerMinutes || 1
                              : null,
                      }
                    : step
            )
        );
    };

    const handleTimerMinutesChange = (index, value) => {
        setSteps((currentSteps) =>
            currentSteps.map((step, stepIndex) =>
                stepIndex === index
                    ? {
                          ...step,
                          timerMinutes: value,
                      }
                    : step
            )
        );
    };

    const addStep = () => {
        setSteps((currentSteps) => [
            ...currentSteps,
            {
                text: "",
                hasTimer: false,
                timerMinutes: null,
            },
        ]);
    };

    const removeStep = (index) => {
        setSteps((currentSteps) =>
            currentSteps.filter(
                (_, stepIndex) => stepIndex !== index
            )
        );
    };

    return (
        <section className="step-editor">
            <div className="section-heading">
                <div>
                    <p>Preparación</p>
                    <h2>Pasos de preparación</h2>
                </div>
            </div>

            <p>
                Describe cada paso y activa un temporizador cuando sea
                necesario esperar durante la preparación.
            </p>

            {steps.map((step, index) => (
                <div className="step-card" key={index}>
                    <label htmlFor={`step-${index}`}>
                        Paso {index + 1}
                    </label>

                    <textarea
                        id={`step-${index}`}
                        value={step.text}
                        onChange={(event) =>
                            handleStepChange(
                                index,
                                event.target.value
                            )
                        }
                        placeholder={`Describe el paso ${index + 1}`}
                    />

                    <label>
                        <input
                            type="checkbox"
                            checked={step.hasTimer}
                            onChange={(event) =>
                                handleTimerChange(
                                    index,
                                    event.target.checked
                                )
                            }
                        />

                        Activar temporizador
                    </label>

                    {step.hasTimer && (
                        <div>
                            <label
                                htmlFor={`timer-${index}`}
                            >
                                Duración en minutos
                            </label>

                            <input
                                id={`timer-${index}`}
                                type="number"
                                min="1"
                                value={step.timerMinutes}
                                onChange={(event) =>
                                    handleTimerMinutesChange(
                                        index,
                                        event.target.value
                                    )
                                }
                            />
                        </div>
                    )}

                    {steps.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeStep(index)}
                        >
                            Eliminar paso
                        </button>
                    )}
                </div>
            ))}

            <button type="button" onClick={addStep}>
                + Agregar paso
            </button>
        </section>
    );
}

export default StepEditor;