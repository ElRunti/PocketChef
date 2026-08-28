import { useState } from "react";
import { supabase } from "../lib/supabase.js";

function CommunityRecipeCard({ recipe, onUpdated }) {
    const [showDetails, setShowDetails] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const categoryNames = {
        breakfast: "Desayunos",
        lunch: "Almuerzos",
        dinner: "Cenas",
        dessert: "Postres",
        drinks: "Bebidas",
        quick: "Rápidas",
    };

    const difficultyNames = {
        easy: "Fácil",
        medium: "Media",
        hard: "Difícil",
    };

    const handleApprove = async () => {
        setLoading(true);
        setMessage("");

        const { error } = await supabase
            .from("recipes")
            .update({
                status: "approved",
                rejection_reason: null,
            })
            .eq("id", recipe.id);

        if (error) {
            console.error("Error al aprobar:", error);
            setMessage("No se pudo aprobar la receta.");
            setLoading(false);
            return;
        }

        setMessage("Receta aprobada.");

        setTimeout(() => {
            onUpdated();
        }, 500);
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            setMessage("Escribe el motivo del rechazo.");
            return;
        }

        setLoading(true);
        setMessage("");

        const { error } = await supabase
            .from("recipes")
            .update({
                status: "rejected",
                rejection_reason: rejectionReason.trim(),
            })
            .eq("id", recipe.id);

        if (error) {
            console.error("Error al rechazar:", error);
            setMessage("No se pudo rechazar la receta.");
            setLoading(false);
            return;
        }

        setMessage("Receta rechazada.");

        setTimeout(() => {
            onUpdated();
        }, 500);
    };

    return (
        <article className="community-recipe-card">

            <img
                src={recipe.image_url}
                alt={recipe.title}
                className="community-recipe-card-image"
            />

            <div className="community-recipe-card-content">

                <span className="recipe-status">
                    Pendiente de revisión
                </span>

                <h3>{recipe.title}</h3>

                <p className="recipe-description">
                    {recipe.description}
                </p>

                <div className="recipe-meta">
                    <span>
                        {categoryNames[recipe.category_id]}
                    </span>

                    <span>
                        {recipe.time_minutes} min
                    </span>

                    <span>
                        {difficultyNames[recipe.difficulty]}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails
                        ? "Ocultar detalles"
                        : "Ver receta"}
                </button>

                {showDetails && (
                    <div className="recipe-details">

                        <h4>Ingredientes</h4>

                        {recipe.recipe_ingredients?.length > 0 ? (
                            <ul>
                                {recipe.recipe_ingredients.map(
                                    (ingredient) => (
                                        <li key={ingredient.ingredient_id}>
                                            {ingredient.ingredient_id}
                                        </li>
                                    )
                                )}
                            </ul>
                        ) : (
                            <p>No hay ingredientes.</p>
                        )}

                        <h4>Preparación</h4>

                        {recipe.recipe_steps
                            ?.sort(
                                (a, b) =>
                                    a.step_number - b.step_number
                            )
                            .map((step) => (
                                <div
                                    key={step.id}
                                    className="recipe-step"
                                >
                                    <strong>
                                        Paso {step.step_number}
                                    </strong>

                                    <p>{step.text}</p>

                                    {step.has_timer && (
                                        <small>
                                            Temporizador:{" "}
                                            {step.timer_minutes} minutos
                                        </small>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {message && (
                    <p className="recipe-action-message">
                        {message}
                    </p>
                )}

                {!showReject && (
                    <div className="recipe-actions">

                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={loading}
                            className="approve-button"
                        >
                            {loading
                                ? "Procesando..."
                                : "Aceptar receta"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowReject(true)}
                            disabled={loading}
                            className="reject-button"
                        >
                            Rechazar receta
                        </button>

                    </div>
                )}

                {showReject && (
                    <div className="reject-form">

                        <label htmlFor={`reason-${recipe.id}`}>
                            Motivo del rechazo
                        </label>

                        <textarea
                            id={`reason-${recipe.id}`}
                            value={rejectionReason}
                            onChange={(e) =>
                                setRejectionReason(e.target.value)
                            }
                            placeholder="Indica qué debe corregir el usuario..."
                            rows={4}
                        />

                        <div className="reject-form-actions">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowReject(false);
                                    setRejectionReason("");
                                    setMessage("");
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={loading}
                                className="reject-button"
                            >
                                {loading
                                    ? "Rechazando..."
                                    : "Confirmar rechazo"}
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}

export default CommunityRecipeCard;