import { ArrowRight, Clock, Heart, Star } from "lucide-react";

export function FavoriteRecipeCard({ recipe, onOpenRecipe, onRemove }) {
  return (
    <article className="recipe-card">
      <img alt={recipe.title} src={recipe.image} />
      <div className="recipe-card-content">
        <div className="recipe-card-header">
          <div>
            <p>Favorito</p>
            <h3>{recipe.title}</h3>
          </div>
          <button
            aria-label={`Eliminar ${recipe.title} de favoritos`}
            className="favorite-remove-button"
            onClick={() => onRemove(recipe.id)}
            type="button"
          >
            <Heart aria-hidden="true" fill="currentColor" size={18} />
          </button>
        </div>

        <span className="recipe-description">{recipe.description}</span>

        <div className="recipe-card-footer">
          <div className="recipe-meta">
            <span>
              <Clock aria-hidden="true" size={14} />
              {recipe.time}
            </span>
            <span>{recipe.difficulty}</span>
            <span>
              <Star aria-hidden="true" size={14} />
              {recipe.rating}
            </span>
          </div>
          <button
            className="recipe-card-open"
            onClick={() => onOpenRecipe(recipe.id)}
            type="button"
          >
            Ver
            <ArrowRight aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
