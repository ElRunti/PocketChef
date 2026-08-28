import { ArrowRight, ChefHat, Clock3 } from "lucide-react";

const statusContent = {
  approved: {
    label: "Publicada",
    message: "Visible para toda la comunidad",
  },
  pending: {
    label: "En revision",
    message: "Esperando validacion del administrador",
  },
  rejected: {
    label: "Rechazada",
    message: "No fue aprobada para publicacion",
  },
};

function formatUpdatedDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function UserRecipeCard({ category, onOpen, recipe }) {
  const status = statusContent[recipe.status] ?? statusContent.pending;

  return (
    <article className="user-recipe-card">
      <img alt={recipe.title} src={recipe.image} />
      <div className="user-recipe-card-content">
        <header>
          <span className={`status-badge ${recipe.status}`}>{status.label}</span>
          <small>{category}</small>
        </header>

        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>

        <div className="user-recipe-meta">
          <span>
            <Clock3 aria-hidden="true" size={14} />
            {recipe.time}
          </span>
          <span>
            <ChefHat aria-hidden="true" size={14} />
            {recipe.difficulty}
          </span>
        </div>

        <footer>
          <span>
            <strong>{status.message}</strong>
            <small>Actualizada {formatUpdatedDate(recipe.updatedAt)}</small>
          </span>
          {recipe.status === "approved" && (
            <button onClick={() => onOpen(recipe.id)} type="button">
              Ver receta
              <ArrowRight aria-hidden="true" size={15} />
            </button>
          )}
        </footer>
      </div>
    </article>
  );
}
