import { useState } from "react";
import StepEditor from "./StepEditor";
import ImageUpload from "./ImageUpload.jsx";
import RecipeIngredientSelector from "./RecipeIngredientSelector.jsx";

const initialSteps = [
    {
        text: "",
        hasTimer: false,
        timerMinutes: null,
    },
];

function RecipeForm({ categories, onSubmitRecipe, pantryIngredients }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [time, setTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [steps, setSteps] = useState(initialSteps);
    const [ingredientIds, setIngredientIds] = useState([]);
    const [image, setImage] = useState("");
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!title.trim()) {
            setMessage("Ingresa un título para la receta.");
            return;
        }

        if (!description.trim()) {
            setMessage("Ingresa una descripción para la receta.");
            return;
        }

        if (!categoryId) {
            setMessage("Selecciona una categoría.");
            return;
        }

        if (!time || Number(time) <= 0) {
            setMessage("Ingresa un tiempo de preparación válido.");
            return;
        }

        if (!difficulty) {
            setMessage("Selecciona una dificultad.");
            return;
        }

        if (ingredientIds.length === 0) {
            setMessage("Selecciona al menos un ingrediente.");
            return;
        }

        const hasEmptyStep = steps.some(
            (step) => !step.text.trim()
        );

        if (hasEmptyStep) {
            setMessage("Completa todos los pasos de preparación.");
            return;
        }

        if (!image) {
            setMessage("Selecciona una imagen para la receta.");
            return;
        }

        setSaving(true);

        try {
            await onSubmitRecipe({
                title: title.trim(),
                description: description.trim(),
                categoryId,
                time: `${Number(time)} min`,
                difficulty,
                image,
                ingredientIds,
                steps: steps.map((step) => step.text.trim()),
                stepTimers: steps.map((step) =>
                    step.hasTimer ? Number(step.timerMinutes) : null
                ),
            });

            setMessage("Receta enviada a Supabase para revision.");
            setTitle("");
            setDescription("");
            setCategoryId("");
            setTime("");
            setDifficulty("");
            setIngredientIds([]);
            setSteps(initialSteps);
            setImage("");
        } catch (error) {
            setMessage(error.message || "No se pudo enviar la receta.");
        } finally {
            setSaving(false);
        }
    };

    const handleIngredientChange = (ingredientId) => {
        setIngredientIds((currentIngredients) => {
            if (currentIngredients.includes(ingredientId)) {
                return currentIngredients.filter(
                    (id) => id !== ingredientId
                );
            }

            return [...currentIngredients, ingredientId];
        });
    };

    return (
        <form
            className="recipe-form"
            onSubmit={handleSubmit}
        >

            <div className="recipe-form-intro">
                <p>CREA ALGO DELICIOSO</p>

                <h2>
                    Cuéntanos sobre tu receta
                </h2>

                <span>
                    Comparte tus ingredientes y pasos para que otros puedan
                    preparar tu receta.
                </span>
            </div>

            {/* INFORMACIÓN */}
            <section className="recipe-form-section">

                <div className="form-section-title">
                    <div>
                        <p>1</p>
                        <h3>
                            Información de la receta
                        </h3>
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="title">
                        Nombre de la receta
                    </label>

                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Ej. Huevos con arroz"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="description">
                        Descripción
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe brevemente tu receta..."
                        rows={4}
                    />
                </div>

                <div className="form-row">

                    <div className="form-field">
                        <label htmlFor="category">
                            Categoría
                        </label>

                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(e.target.value)
                            }
                        >
                            <option value="">
                                Selecciona una categoría
                            </option>

                            {categories
                                .filter((category) => category.id !== "all")
                                .map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.label}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="difficulty">
                            Dificultad
                        </label>

                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(e.target.value)
                            }
                        >
                            <option value="">
                                Selecciona la dificultad
                            </option>

                            <option value="Facil">
                                Fácil
                            </option>

                            <option value="Media">
                                Media
                            </option>

                            <option value="Dificil">
                                Difícil
                            </option>
                        </select>
                    </div>

                </div>

                <div className="form-field">
                    <label htmlFor="time">
                        Tiempo total de preparación
                    </label>

                    <div className="input-with-suffix">
                        <input
                            type="number"
                            id="time"
                            min="1"
                            value={time}
                            onChange={(e) =>
                                setTime(e.target.value)
                            }
                            placeholder="30"
                        />

                        <span>
                            minutos
                        </span>
                    </div>
                </div>

            </section>

            {/* IMAGEN */}
            <section className="recipe-form-section">

                <div className="form-section-title">
                    <div>
                        <p>2</p>
                        <h3>
                            Imagen de la receta
                        </h3>
                    </div>
                </div>

                <p className="form-section-description">
                    Agrega una fotografía que represente tu platillo.
                </p>

                <ImageUpload
                    image={image}
                    setImage={setImage}
                />

            </section>

            {/* INGREDIENTES */}
            <section className="recipe-form-section">

                <div className="form-section-title">
                    <div>
                        <p>3</p>
                        <h3>
                            Ingredientes
                        </h3>
                    </div>
                </div>

                <p className="form-section-description">
                    Selecciona todos los ingredientes que necesitas para preparar
                    tu receta.
                </p>

                <RecipeIngredientSelector
                    ingredients={pantryIngredients}
                    selectedIngredientIds={ingredientIds}
                    onToggleIngredient={handleIngredientChange}
                />

            </section>

            {/* PASOS */}
            <section className="recipe-form-section">

                <div className="form-section-title">
                    <div>
                        <p>4</p>
                        <h3>
                            Preparación
                        </h3>
                    </div>
                </div>

                <p className="form-section-description">
                    Describe paso a paso cómo preparar tu receta. Puedes agregar
                    temporizadores cuando algún proceso necesite cocción o reposo.
                </p>

                <StepEditor
                    steps={steps}
                    setSteps={setSteps}
                />

            </section>

            {/* MENSAJE */}
            {message && (
                <div className="recipe-form-message">
                    {message}
                </div>
            )}

            <button
                className="submit-recipe-button"
                type="submit"
                disabled={saving}
            >
                {saving
                    ? "Guardando receta..."
                    : "Enviar receta a revisión"}
            </button>

        </form>
    );
}

export default RecipeForm;
