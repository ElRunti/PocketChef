import { useState } from "react";
import { ArrowLeft, MessageCircle, Star } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";

export function RecipeCommunityPage({
  recipe,
  rating,
  comments,
  onAddComment,
  onBack,
  onRateRecipe,
  activeView,
  navItems,
  onNavigate,
}) {
  const [commentText, setCommentText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    onAddComment(recipe.id, commentText);
    setCommentText("");
  }

  if (!recipe) {
    return null;
  }

  return (
    <main className="app-shell screen-page">
      <div className="page-container community-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Detalle
        </button>

        <header className="community-recipe-header">
          <img alt={recipe.title} src={recipe.image} />
          <div>
            <p>Comunidad Pocket Chef</p>
            <h1>{recipe.title}</h1>
            <span>{rating.count} calificaciones</span>
          </div>
        </header>

        <section className="rating-panel">
          <div>
            <strong>{rating.average}</strong>
            <span>
              <Star aria-hidden="true" fill="currentColor" size={18} />
              Promedio de la comunidad
            </span>
          </div>
          <div>
            <p>Tu calificacion</p>
            <div className="star-rating" role="group" aria-label="Calificar receta">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  aria-label={`${value} estrellas`}
                  aria-pressed={rating.userRating === value}
                  className={value <= rating.userRating ? "active" : ""}
                  key={value}
                  onClick={() => onRateRecipe(recipe.id, value)}
                  type="button"
                >
                  <Star aria-hidden="true" fill="currentColor" size={25} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="comments-panel">
          <div className="section-heading">
            <div>
              <p>Consejos y opiniones</p>
              <h2>Comentarios</h2>
            </div>
            <span>{comments.length}</span>
          </div>

          <form className="comment-form" onSubmit={handleSubmit}>
            <MessageCircle aria-hidden="true" size={20} />
            <textarea
              aria-label="Escribe un comentario"
              maxLength={280}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Comparte un consejo o cambio que hiciste..."
              value={commentText}
            />
            <button disabled={!commentText.trim()} type="submit">
              Publicar
            </button>
          </form>

          <div className="comment-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <article className="comment-item" key={comment.id}>
                  <span aria-hidden="true">{comment.author.charAt(0)}</span>
                  <div>
                    <header>
                      <strong>{comment.author}</strong>
                      <small>{comment.createdAt}</small>
                    </header>
                    <p>{comment.text}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <strong>Se el primero en comentar</strong>
                <p>Comparte como te quedo esta receta.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
