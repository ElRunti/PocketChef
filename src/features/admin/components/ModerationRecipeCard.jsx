import { Check, Clock, Pencil, X } from "lucide-react";
import { getCategoryLabel } from "../../recipes/model/recipeModel.js";

const statusLabels = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

export function ModerationRecipeCard({ recipe, onEdit, onModerate }) {
  return (
    <article className="moderation-card">
      <img alt={recipe.title} src={recipe.image} />
      <div className="moderation-card-content">
        <header>
          <span className={`status-badge ${recipe.status}`}>
            {statusLabels[recipe.status]}
          </span>
          <small>{getCategoryLabel(recipe.categoryId)}</small>
        </header>
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        <div className="moderation-meta">
          <span>
            <Clock aria-hidden="true" size={14} />
            {recipe.time}
          </span>
          <span>{recipe.difficulty}</span>
          <span>Por {recipe.author ?? "Comunidad"}</span>
        </div>
        <div className="moderation-actions">
          <button className="secondary" onClick={() => onEdit(recipe.id)} type="button">
            <Pencil aria-hidden="true" size={16} />
            Editar
          </button>
          <button
            className="approve"
            onClick={() => onModerate(recipe.id, "approved")}
            type="button"
          >
            <Check aria-hidden="true" size={16} />
            Aprobar
          </button>
          <button
            className="reject"
            onClick={() => onModerate(recipe.id, "rejected")}
            type="button"
          >
            <X aria-hidden="true" size={16} />
            Rechazar
          </button>
        </div>
      </div>
    </article>
  );
}
