import { Search, SlidersHorizontal } from "lucide-react";
import {
  categories,
  getIngredientLabel,
} from "../model/recipeModel.js";
import { difficultyOptions, timeOptions } from "../controllers/useRecipeFilters.js";

export function RecipeFilters({
  filters,
  actions,
  selectedIngredientIds,
  onToggleIngredientMode,
}) {
  return (
    <section className="recipe-filter-panel">
      <div className="section-heading">
        <div>
          <p>Filtros</p>
          <h2>Encuentra tu receta</h2>
        </div>
        <SlidersHorizontal aria-hidden="true" size={22} />
      </div>

      <label className="recipe-search-field" htmlFor="recipe-results-search">
        <Search aria-hidden="true" size={19} />
        <input
          id="recipe-results-search"
          onChange={(event) => actions.setQuery(event.target.value)}
          placeholder="Buscar por nombre"
          type="search"
          value={filters.query}
        />
      </label>

      <div className="filter-block">
        <span>Categoria</span>
        <div className="filter-chip-row">
          {categories.map((category) => (
            <button
              className={filters.categoryId === category.id ? "active" : ""}
              key={category.id}
              onClick={() => actions.setCategoryId(category.id)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-grid">
        <label>
          <span>Tiempo</span>
          <select
            onChange={(event) => actions.setMaxTime(event.target.value)}
            value={filters.maxTime}
          >
            {timeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Dificultad</span>
          <select
            onChange={(event) => actions.setDifficulty(event.target.value)}
            value={filters.difficulty}
          >
            {difficultyOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="ingredient-mode-toggle">
        <input
          checked={filters.onlyAvailable}
          onChange={(event) => {
            actions.setOnlyAvailable(event.target.checked);
            onToggleIngredientMode?.(event.target.checked);
          }}
          type="checkbox"
        />
        <span>Solo recetas con mis ingredientes</span>
      </label>

      <div className="selected-ingredient-row">
        {selectedIngredientIds.length > 0 ? (
          selectedIngredientIds.map((ingredientId) => (
            <span key={ingredientId}>{getIngredientLabel(ingredientId)}</span>
          ))
        ) : (
          <span>Sin ingredientes seleccionados</span>
        )}
      </div>
    </section>
  );
}
