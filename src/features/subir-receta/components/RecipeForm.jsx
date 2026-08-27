import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase.js";
import { pantryIngredients } from "../../recipes/data/recipes.js";
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

function RecipeForm() {
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

        if (!isSupabaseConfigured || !supabase) {
            setMessage(
                "Configura Supabase en el archivo .env antes de enviar recetas."
            );
            return;
        }

        setSaving(true);

        try {
            // =====================================================
            // 1. Obtener usuario autenticado
            // =====================================================

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                setMessage(
                    "No hay un usuario autenticado."
                );
                return;
            }

            // =====================================================
            // 2. Crear receta
            // =====================================================

            const { data: recipe, error: recipeError } =
                await supabase
                    .from("recipes")
                    .insert({
                        user_id: user.id,
                        title: title.trim(),
                        description: description.trim(),
                        category_id: categoryId,
                        time_minutes: Number(time),
                        difficulty: difficulty,
                        image_url: image,
                        rating: 0,
                        status: "pending",
                    })
                    .select()
                    .single();

            if (recipeError) {
                throw recipeError;
            }

            // =====================================================
            // 3. Guardar ingredientes
            // =====================================================

            const recipeIngredients = ingredientIds.map(
                (ingredientId) => ({
                    recipe_id: recipe.id,
                    ingredient_id: ingredientId,
                })
            );

            const { error: ingredientsError } =
                await supabase
                    .from("recipe_ingredients")
                    .insert(recipeIngredients);

            if (ingredientsError) {
                throw ingredientsError;
            }

            // =====================================================
            // 4. Guardar pasos
            // =====================================================

            const recipeSteps = steps.map((step, index) => ({
                recipe_id: recipe.id,
                step_number: index + 1,
                text: step.text.trim(),
                has_timer: step.hasTimer,
                timer_minutes: step.hasTimer
                    ? Number(step.timerMinutes)
                    : null,
            }));

            const { error: stepsError } =
                await supabase
                    .from("recipe_steps")
                    .insert(recipeSteps);

            if (stepsError) {
                throw stepsError;
            }

            // =====================================================
            // 5. Éxito
            // =====================================================

            console.log("Receta guardada:", recipe);

            setMessage(
                "¡Receta enviada! Un administrador la revisará antes de publicarla."
            );

            // Limpiar formulario
            setTitle("");
            setDescription("");
            setCategoryId("");
            setTime("");
            setDifficulty("");
            setIngredientIds([]);
            setSteps([
                {
                    text: "",
                    hasTimer: false,
                    timerMinutes: null,
                },
            ]);
            setImage("");

        } catch (error) {
            console.error(
                "Error al guardar la receta:",
                error
            );

            setMessage(
                "Ocurrió un error al guardar la receta."
            );
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

                            <option value="breakfast">
                                Desayunos
                            </option>

                            <option value="lunch">
                                Almuerzos
                            </option>

                            <option value="dinner">
                                Cenas
                            </option>

                            <option value="dessert">
                                Postres
                            </option>

                            <option value="quick">
                                Rápidas
                            </option>
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

                            <option value="easy">
                                Fácil
                            </option>

                            <option value="medium">
                                Media
                            </option>

                            <option value="hard">
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
