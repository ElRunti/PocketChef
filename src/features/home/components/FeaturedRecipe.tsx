import { ArrowRight, Clock, Flame, Star } from "lucide-react";
import Image from "next/image";
import type { Recipe } from "../../recipes/types";

type FeaturedRecipeProps = {
  recipe: Recipe;
  matchLabel: string;
};

export function FeaturedRecipe({ recipe, matchLabel }: FeaturedRecipeProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-lg bg-[#17201a] text-white shadow-lg">
      <div className="relative min-h-[236px]">
        <Image
          alt={recipe.title}
          className="absolute inset-0 h-full w-full object-cover"
          fill
          sizes="(min-width: 1024px) 520px, 100vw"
          src={recipe.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17201a] via-[#17201a]/60 to-transparent" />
        <div className="relative flex min-h-[236px] flex-col justify-end p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-black text-[#17201a]">
              <Flame aria-hidden="true" size={14} />
              {matchLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-black text-[#17201a]">
              <Star aria-hidden="true" size={14} />
              {recipe.rating}
            </span>
          </div>
          <h2 className="max-w-[18rem] text-2xl font-black leading-tight">
            {recipe.title}
          </h2>
          <p className="mt-2 max-w-[20rem] text-sm font-medium text-white/90">
            {recipe.description}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-white/90">
              <Clock aria-hidden="true" size={17} />
              {recipe.time}
            </span>
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#f15f3b] px-4 text-sm font-black text-white shadow-sm"
              type="button"
            >
              Cocinar
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
