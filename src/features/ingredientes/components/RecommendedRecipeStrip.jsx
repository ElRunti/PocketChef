import { ArrowRight, Clock } from "lucide-react";

export function RecommendedRecipeStrip({ recipes, onSelectRecipe }) {
  return (
    <section className="recommendation-strip">
      <div className="section-heading">
        <div>
          <p>Recomendadas</p>
          <h2>Mejores coincidencias</h2>
        </div>
      </div>

      <div className="recommendation-list">
        {recipes.map((recipe) => (
          <button
            className="recommendation-card"
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe.id)}
            type="button"
          >
            <img alt={recipe.title} src={recipe.image} />
            <span>
              <strong>{recipe.title}</strong>
              <small>
                <Clock aria-hidden="true" size={14} />
                {recipe.time}
              </small>
            </span>
            <em>{recipe.matchPercent}%</em>
            <ArrowRight aria-hidden="true" size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}
