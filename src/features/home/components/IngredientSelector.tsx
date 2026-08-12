import { Check, Refrigerator } from "lucide-react";
import type { Ingredient } from "../../recipes/types";

type IngredientSelectorProps = {
  ingredients: Ingredient[];
  selectedIngredientIds: string[];
  onToggleIngredient: (ingredientId: string) => void;
};

export function IngredientSelector({
  ingredients,
  selectedIngredientIds,
  onToggleIngredient,
}: IngredientSelectorProps) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#f15f3b]">
            Tu despensa
          </p>
          <h2 className="text-lg font-black text-[#17201a]">
            Ingredientes disponibles
          </h2>
        </div>
        <Refrigerator aria-hidden="true" className="text-[#1f7a5c]" size={24} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {ingredients.map((ingredient) => {
          const isSelected = selectedIngredientIds.includes(ingredient.id);

          return (
            <button
              className={[
                "flex min-h-11 items-center justify-between gap-2 rounded-lg border px-3 text-left text-sm font-bold transition",
                isSelected
                  ? "border-[#f15f3b] bg-[#fff0e8] text-[#8c2d18]"
                  : "border-[#dce8d5] bg-white text-[#4d5f55]",
              ].join(" ")}
              key={ingredient.id}
              onClick={() => onToggleIngredient(ingredient.id)}
              type="button"
              aria-pressed={isSelected}
            >
              <span className="truncate">{ingredient.label}</span>
              {isSelected ? (
                <Check aria-hidden="true" className="shrink-0" size={17} />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
