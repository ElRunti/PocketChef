import { Clock, Heart, Star } from "lucide-react";

export function FavoriteRecipeCard({ recipe, onRemove }) {
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
            type="button"
            className="favorite-remove-button"
            aria-label={`Eliminar ${recipe.title} de favoritos`}
            onClick={() => onRemove(recipe.id)}
          >
            <Heart aria-hidden="true" fill="currentColor" size={18} />
          </button>
        </div>

        <span className="recipe-description">{recipe.description}</span>

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
      </div>
    </article>
  );
}
