function StepEditor({ steps, setSteps }) {
  const handleStepChange = (index, value) => {
    setSteps((currentSteps) =>
      currentSteps.map((step, stepIndex) =>
        stepIndex === index ? value : step
      )
    );
  };

  const addStep = () => {
    setSteps((currentSteps) => [...currentSteps, ""]);
  };

  const removeStep = (index) => {
    setSteps((currentSteps) =>
      currentSteps.filter((_, stepIndex) => stepIndex !== index)
    );
  };

  return (
    <div>
      <h3>Pasos de preparación</h3>

      {steps.map((step, index) => (
        <div key={index}>
          <label htmlFor={`step-${index}`}>
            Paso {index + 1}
          </label>

          <textarea
            id={`step-${index}`}
            value={step}
            onChange={(event) =>
              handleStepChange(index, event.target.value)
            }
            placeholder={`Describe el paso ${index + 1}`}
          />

          {steps.length > 1 && (
            <button type="button" onClick={() => removeStep(index)}>
              Eliminar
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addStep}>
        + Agregar paso
      </button>
    </div>
  );
}

export default StepEditor;