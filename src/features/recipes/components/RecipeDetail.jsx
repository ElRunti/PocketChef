import {
  ArrowRight,
  Check,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Utensils,
} from "lucide-react";
import {
  getCategoryLabel,
  getIngredientLabel,
} from "../model/recipeModel.js";

export function RecipeDetail({
  categories,
  recipe,
  selectedIngredientIds,
  isFavorite,
  communityRating,
  shareStatus,
  onToggleFavorite,
  onOpenCommunity,
  onShareRecipe,
  onStartInteractive,
  pantryIngredients,
}) {
  if (!recipe) {
    return null;
  }

  return (
    <section className="recipe-detail-panel">
      <div className="recipe-detail-hero">
        <img alt={recipe.title} src={recipe.image} />
        <div className="recipe-detail-overlay" />
        <div>
          <p>{getCategoryLabel(recipe.categoryId, categories)}</p>
          <h2>{recipe.title}</h2>
          <span>{recipe.description}</span>
        </div>
      </div>

      <div className="recipe-detail-actions">
        <button onClick={() => onStartInteractive(recipe.id)} type="button">
          <ArrowRight aria-hidden="true" size={18} />
          Modo interactivo
        </button>
        <button
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(recipe.id)}
          type="button"
        >
          <Heart
            aria-hidden="true"
            fill={isFavorite ? "currentColor" : "none"}
            size={18}
          />
          {isFavorite ? "Guardada" : "Favorito"}
        </button>
        <button onClick={() => onOpenCommunity(recipe.id)} type="button">
          <MessageCircle aria-hidden="true" size={18} />
          Opiniones
        </button>
        <button onClick={() => onShareRecipe(recipe)} type="button">
          <Share2 aria-hidden="true" size={18} />
          Compartir
        </button>
      </div>

      {shareStatus && <p className="share-status">{shareStatus}</p>}

      <div className="recipe-detail-stats">
        <span>
          <Clock aria-hidden="true" size={17} />
          {recipe.time}
        </span>
        <span>
          <Utensils aria-hidden="true" size={17} />
          {recipe.difficulty}
        </span>
        <span>
          <Star aria-hidden="true" size={17} />
          {communityRating.average} ({communityRating.count})
        </span>
      </div>

      <div className="recipe-detail-grid">
        <section>
          <div className="section-heading">
            <div>
              <p>Ingredientes</p>
              <h3>Necesarios</h3>
            </div>
          </div>
          <ul className="recipe-ingredient-list">
            {recipe.ingredientIds.map((ingredientId) => {
              const hasIngredient = selectedIngredientIds.includes(ingredientId);

              return (
                <li
                  className={hasIngredient ? "available" : ""}
                  key={ingredientId}
                >
                  <Check aria-hidden="true" size={16} />
                  <span>
                    {getIngredientLabel(ingredientId, pantryIngredients)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <div className="section-heading">
            <div>
              <p>Preparacion</p>
              <h3>Pasos</h3>
            </div>
          </div>
          <ol className="recipe-step-list">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
