import { Refrigerator, Search, Utensils } from "lucide-react";

export function PantrySummary({
  selectedCount,
  pantryProgress,
  selectedIngredientLabels,
  onClearIngredients,
  onSearchRecipes,
}) {
  const labelText =
    selectedIngredientLabels.length > 0
      ? selectedIngredientLabels.join(", ")
      : "Selecciona lo que tienes en casa";

  return (
    <section className="pantry-hero">
      <img
        alt="Mesa de cocina con ingredientes frescos"
        src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1100&q=80"
      />
      <div className="pantry-hero-overlay" />
      <div className="pantry-hero-content">
        <div className="pantry-kicker">
          <Refrigerator aria-hidden="true" size={18} />
          Tu despensa
        </div>
        <h2>Ingredientes listos para cocinar</h2>
        <p>{labelText}</p>

        <div className="pantry-progress">
          <span>{selectedCount} seleccionados</span>
          <div
            aria-label="Progreso de ingredientes seleccionados"
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow={pantryProgress}
            className="progress-track"
            role="progressbar"
          >
            <div
              className="progress-value"
              style={{ "--progress": pantryProgress / 100 }}
            />
          </div>
        </div>

        <div className="pantry-actions">
          <button onClick={onSearchRecipes} type="button">
            <Search aria-hidden="true" size={18} />
            Buscar recetas
          </button>
          <button onClick={onClearIngredients} type="button">
            <Utensils aria-hidden="true" size={18} />
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}
