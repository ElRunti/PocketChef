import { ArrowRight, Clock, Heart, Star } from "lucide-react";

export function RecipeCard({ recipe, missingIngredients, onSelectRecipe }) {
  const matchText =
    missingIngredients === 0 ? "Lista para cocinar" : `Faltan ${missingIngredients}`;

  return (
    <article className="recipe-card">
      <img alt={recipe.title} src={recipe.image} />
      <div className="recipe-card-content">
        <div className="recipe-card-header">
          <div>
            <p>{matchText}</p>
            <h3>{recipe.title}</h3>
          </div>
          <button type="button" aria-label={`Guardar ${recipe.title}`}>
            <Heart aria-hidden="true" size={18} />
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
          <button className="recipe-card-open" onClick={onSelectRecipe} type="button">
            Ver
            <ArrowRight aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
