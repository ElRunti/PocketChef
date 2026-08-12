import { Clock, Heart, Star } from "lucide-react";
import Image from "next/image";
import type { Recipe } from "../../recipes/types";

type RecipeCardProps = {
  recipe: Recipe;
  missingIngredients: number;
};

export function RecipeCard({ recipe, missingIngredients }: RecipeCardProps) {
  const matchText =
    missingIngredients === 0 ? "Lista para cocinar" : `Faltan ${missingIngredients}`;

  return (
    <article className="grid grid-cols-[7rem_1fr] gap-3 rounded-lg border border-[#dfe7d9] bg-white p-2 shadow-sm">
      <div className="relative h-32 w-full overflow-hidden rounded-lg">
        <Image
          alt={recipe.title}
          className="object-cover"
          fill
          sizes="7rem"
          src={recipe.image}
        />
      </div>
      <div className="min-w-0 py-1 pr-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase text-[#1f7a5c]">
              {matchText}
            </p>
            <h3 className="mt-1 line-clamp-2 text-base font-black leading-snug text-[#17201a]">
              {recipe.title}
            </h3>
          </div>
          <button
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#fff0e8] text-[#f15f3b]"
            type="button"
            aria-label={`Guardar ${recipe.title}`}
          >
            <Heart aria-hidden="true" size={18} />
          </button>
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-medium text-[#68776d]">
          {recipe.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#4d5f55]">
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#f2f6ee] px-2 py-1">
            <Clock aria-hidden="true" size={14} />
            {recipe.time}
          </span>
          <span className="rounded-lg bg-[#f2f6ee] px-2 py-1">
            {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#f2f6ee] px-2 py-1">
            <Star aria-hidden="true" size={14} />
            {recipe.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
