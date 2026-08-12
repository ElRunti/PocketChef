import { ArrowRight, Clock, Flame, Star } from "lucide-react";

export function FeaturedRecipe({ recipe, matchLabel }) {
  return (
    <section className="featured-recipe">
      <img alt={recipe.title} src={recipe.image} />
      <div className="featured-overlay" />
      <div className="featured-content">
        <div className="featured-badges">
          <span>
            <Flame aria-hidden="true" size={14} />
            {matchLabel}
          </span>
          <span>
            <Star aria-hidden="true" size={14} />
            {recipe.rating}
          </span>
        </div>

        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>

        <div className="featured-actions">
          <span>
            <Clock aria-hidden="true" size={17} />
            {recipe.time}
          </span>
          <button type="button">
            Cocinar
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
