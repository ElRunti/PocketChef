import { useEffect, useState } from "react";
import { ArrowLeft, Check, Save, X } from "lucide-react";
import { BottomNavigation } from "../../shared/components/BottomNavigation.jsx";
import { categories, pantryIngredients } from "../recipes/model/recipeModel.js";

export function AdminRecipeEditorPage({
  recipe,
  onBack,
  onModerateRecipe,
  onSaveRecipe,
  activeView,
  navItems,
  onNavigate,
}) {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!recipe) {
      return;
    }

    setForm({
      title: recipe.title,
      description: recipe.description,
      categoryId: recipe.categoryId,
      time: Number.parseInt(recipe.time, 10) || 1,
      difficulty: recipe.difficulty,
      image: recipe.image,
      ingredientIds: recipe.ingredientIds,
      steps: recipe.steps.join("\n"),
    });
    setSaved(false);
  }, [recipe]);

  if (!recipe || !form) {
    return null;
  }

  function updateField(field, value) {
    setSaved(false);
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function toggleIngredient(ingredientId) {
    updateField(
      "ingredientIds",
      form.ingredientIds.includes(ingredientId)
        ? form.ingredientIds.filter((id) => id !== ingredientId)
        : [...form.ingredientIds, ingredientId],
    );
  }

  function saveChanges(event) {
    event.preventDefault();
    const steps = form.steps
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean);

    if (!form.title.trim() || !form.description.trim() || steps.length === 0) {
      return;
    }

    onSaveRecipe(recipe.id, {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      time: `${Number(form.time)} min`,
      steps,
    });
    setSaved(true);
  }

  return (
    <main className="app-shell screen-page">
      <div className="page-container admin-editor-page">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          Revisiones
        </button>

        <div className="section-heading page-title-row">
          <div>
            <p>Correccion editorial</p>
            <h1>Editar receta</h1>
          </div>
          <span className={`status-badge ${recipe.status}`}>{recipe.status}</span>
        </div>

        <form className="admin-editor-form" onSubmit={saveChanges}>
          <div className="form-field">
            <label htmlFor="admin-title">Titulo</label>
            <input
              id="admin-title"
              onChange={(event) => updateField("title", event.target.value)}
              required
              value={form.title}
            />
          </div>
          <div className="form-field">
            <label htmlFor="admin-description">Descripcion</label>
            <textarea
              id="admin-description"
              onChange={(event) => updateField("description", event.target.value)}
              required
              value={form.description}
            />
          </div>
          <div className="admin-editor-row">
            <div className="form-field">
              <label htmlFor="admin-category">Categoria</label>
              <select
                id="admin-category"
                onChange={(event) => updateField("categoryId", event.target.value)}
                value={form.categoryId}
              >
                {categories
                  .filter((category) => category.id !== "all")
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="admin-time">Minutos</label>
              <input
                id="admin-time"
                min="1"
                onChange={(event) => updateField("time", event.target.value)}
                type="number"
                value={form.time}
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-difficulty">Dificultad</label>
              <select
                id="admin-difficulty"
                onChange={(event) => updateField("difficulty", event.target.value)}
                value={form.difficulty}
              >
                <option value="Facil">Facil</option>
                <option value="Media">Media</option>
                <option value="Dificil">Dificil</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="admin-image">URL de imagen</label>
            <input
              id="admin-image"
              onChange={(event) => updateField("image", event.target.value)}
              value={form.image}
            />
          </div>

          <fieldset className="admin-ingredient-fieldset">
            <legend>Ingredientes</legend>
            <div className="admin-ingredient-grid">
              {pantryIngredients.map((ingredient) => (
                <label
                  className={form.ingredientIds.includes(ingredient.id) ? "selected" : ""}
                  key={ingredient.id}
                >
                  <input
                    checked={form.ingredientIds.includes(ingredient.id)}
                    onChange={() => toggleIngredient(ingredient.id)}
                    type="checkbox"
                  />
                  {ingredient.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-field">
            <label htmlFor="admin-steps">Pasos, uno por linea</label>
            <textarea
              id="admin-steps"
              onChange={(event) => updateField("steps", event.target.value)}
              required
              rows="7"
              value={form.steps}
            />
          </div>

          {saved && <p className="editor-success">Cambios guardados correctamente.</p>}

          <div className="admin-editor-actions">
            <button className="secondary" type="submit">
              <Save aria-hidden="true" size={17} />
              Guardar cambios
            </button>
            <button
              className="approve"
              onClick={() => onModerateRecipe(recipe.id, "approved")}
              type="button"
            >
              <Check aria-hidden="true" size={17} />
              Aprobar
            </button>
            <button
              className="reject"
              onClick={() => onModerateRecipe(recipe.id, "rejected")}
              type="button"
            >
              <X aria-hidden="true" size={17} />
              Rechazar
            </button>
          </div>
        </form>
      </div>

      <BottomNavigation
        activeItemId={activeView}
        items={navItems}
        onNavigate={onNavigate}
      />
    </main>
  );
}
