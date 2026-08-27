import { Check, Refrigerator } from "lucide-react";

export function IngredientSelector({
  ingredients,
  selectedIngredientIds,
  onSearchByIngredients,
  onToggleIngredient,
}) {
  return (
    <section className="ingredient-section">
      <div className="section-heading">
        <div>
          <p>Tu despensa</p>
          <h2>Ingredientes disponibles</h2>
        </div>
        <Refrigerator aria-hidden="true" size={24} />
      </div>

      <div className="ingredient-grid">
        {ingredients.map((ingredient) => {
          const isSelected = selectedIngredientIds.includes(ingredient.id);

          return (
            <button
              className={isSelected ? "selected" : ""}
              key={ingredient.id}
              onClick={() => onToggleIngredient(ingredient.id)}
              type="button"
              aria-pressed={isSelected}
            >
              <span>{ingredient.label}</span>
              {isSelected && <Check aria-hidden="true" size={17} />}
            </button>
          );
        })}
      </div>

      <button
        className="ingredient-search-button"
        onClick={onSearchByIngredients}
        type="button"
      >
        Buscar por ingredientes disponibles
      </button>
    </section>
  );
}
