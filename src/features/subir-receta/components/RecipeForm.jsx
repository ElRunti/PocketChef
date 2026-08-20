import {useState} from "react";
import {pantryIngredients} from "../../recipes/data/recipes.js";
import StepEditor from "./StepEditor";
function RecipeForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [time, setTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [steps, setSteps] = useState([""]);
    const [ingredientIds, setIngredientIds] = useState([]);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({
            title,
            description,
            categoryId,
            time,
            difficulty,
            ingredientIds,
            steps
        });
    };

    const handleIngredientChange = (ingredientId) => {
        setIngredientIds((currentIngredients) => {
            if(currentIngredients.includes(ingredientId)) {
                return currentIngredients.filter((id) => id !== ingredientId);
            }
            return [...currentIngredients, ingredientId];
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Subir una nueva receta</h2>
            <div>
                <label htmlFor="title">Título:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ingrese el título de la receta"
                />
            </div>
            <div>
                <label htmlFor="description">Descripción:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ingrese la descripción de la receta"
                />
            </div>
            <div>
                <label htmlFor="category">Categoría:</label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Seleccione una categoría</option>
                    <option value="1">Desayuno</option>
                    <option value="2">Almuerzo</option>
                    <option value="3">Cena</option>
                </select>
            </div>
            <div>
                <label htmlFor="time">Tiempo de preparación (minutos):</label>
                <input
                    type="number"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Ingrese el tiempo de preparación"
                />
            </div>
            <div>
                <label htmlFor="difficulty">Dificultad:</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="">Seleccione la dificultad</option>
                    <option value="1">Fácil</option>
                    <option value="2">Media</option>
                    <option value="3">Difícil</option>
                </select>
            </div>
            <div>
                <label htmlFor="ingredients">Ingredientes:</label>
                <div>
                    {pantryIngredients.map((ingredient) => (
                        <div key={ingredient.id}>
                            <input
                                type="checkbox"
                                id={`ingredient-${ingredient.id}`}
                                checked={ingredientIds.includes(ingredient.id)}
                                onChange={() => handleIngredientChange(ingredient.id)}
                            />
                          {ingredient.label}
                        </div>
                    ))}
                </div>
            </div>
            <StepEditor
            steps={steps}
            setSteps={setSteps}/>
            <button type="submit">Subir receta</button>
        </form>
    );
}

export default RecipeForm;