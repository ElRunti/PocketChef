import { ArrowRight, Clock, Star } from "lucide-react";
import { getCategoryLabel } from "../../recipes/model/recipeModel.js";

export function DiscoveryRecipeCard({
  categories,
  recipe,
  rating,
  reason,
  onOpenRecipe,
}) {
  return (
    <article className="discovery-recipe-card">
      <img alt={recipe.title} src={recipe.image} />
      <div>
        <span className="discovery-reason">{reason}</span>
        <small>{getCategoryLabel(recipe.categoryId, categories)}</small>
        <h3>{recipe.title}</h3>
        <div className="discovery-meta">
          <span>
            <Clock aria-hidden="true" size={14} />
            {recipe.time}
          </span>
          <span>
            <Star aria-hidden="true" fill="currentColor" size={14} />
            {rating.average} ({rating.count})
          </span>
        </div>
        <button onClick={() => onOpenRecipe(recipe.id)} type="button">
          Ver receta
          <ArrowRight aria-hidden="true" size={16} />
        </button>
      </div>
    </article>
  );
}
