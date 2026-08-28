import { useState } from "react";
import { Check, Refrigerator, Search } from "lucide-react";

function RecipeIngredientSelector({
    ingredients,
    selectedIngredientIds,
    onToggleIngredient,
}) {
    const [search, setSearch] = useState("");

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="ingredient-section">
            <div className="section-heading">
                <div>
                    <p>Ingredientes</p>
                    <h2>Ingredientes de tu receta</h2>
                </div>

                <Refrigerator aria-hidden="true" size={24} />
            </div>

            <p>
                Selecciona todos los ingredientes que necesitas para preparar
                tu receta.
            </p>

            <div className="ingredient-search">
                <Search aria-hidden="true" size={18} />

                <input
                    type="search"
                    placeholder="Buscar ingrediente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="ingredient-grid">
                {filteredIngredients.length > 0 ? (
                    filteredIngredients.map((ingredient) => {
                        const isSelected = selectedIngredientIds.includes(
                            ingredient.id
                        );

                        return (
                            <button
                                className={isSelected ? "selected" : ""}
                                key={ingredient.id}
                                onClick={() =>
                                    onToggleIngredient(ingredient.id)
                                }
                                type="button"
                                aria-pressed={isSelected}
                            >
                                <span>{ingredient.label}</span>

                                <Check
                                    aria-hidden="true"
                                    className="selection-check"
                                    size={17}
                                />
                            </button>
                        );
                    })
                ) : (
                    <p>No encontramos ese ingrediente.</p>
                )}
            </div>
        </section>
    );
}

export default RecipeIngredientSelector;
