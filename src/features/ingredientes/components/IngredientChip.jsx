import { Check } from "lucide-react";

export function IngredientChip({ ingredient, isSelected, onToggle }) {
  return (
    <button
      aria-pressed={isSelected}
      className={isSelected ? "pantry-chip selected" : "pantry-chip"}
      onClick={() => onToggle(ingredient.id)}
      type="button"
    >
      <span>{ingredient.label}</span>
      {isSelected && <Check aria-hidden="true" size={17} />}
    </button>
  );
}
