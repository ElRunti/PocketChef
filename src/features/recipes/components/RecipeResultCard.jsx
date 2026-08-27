import { Clock, Star } from "lucide-react";
import {
  countMissingIngredients,
  getCategoryLabel,
  getRecipeMatchPercent,
} from "../model/recipeModel.js";

export function RecipeResultCard({
  categories,
  recipe,
  selectedIngredientIds,
  isActive,
  onSelectRecipe,
}) {
  const missingCount = countMissingIngredients(recipe, selectedIngredientIds);
  const matchPercent = getRecipeMatchPercent(recipe, selectedIngredientIds);
  const matchLabel =
    missingCount === 0 ? "Lista para cocinar" : `Faltan ${missingCount}`;

  return (
    <button
      className={isActive ? "recipe-result-card active" : "recipe-result-card"}
      onClick={() => onSelectRecipe(recipe.id)}
      type="button"
    >
      <img alt={recipe.title} src={recipe.image} />
      <span className="recipe-result-copy">
        <small>{getCategoryLabel(recipe.categoryId, categories)}</small>
        <strong>{recipe.title}</strong>
        <em>{matchLabel}</em>
      </span>
      <span className="recipe-result-meta">
        <span>
          <Clock aria-hidden="true" size={14} />
          {recipe.time}
        </span>
        <span>
          <Star aria-hidden="true" size={14} />
          {recipe.rating}
        </span>
        <b>{matchPercent}%</b>
      </span>
    </button>
  );
}
