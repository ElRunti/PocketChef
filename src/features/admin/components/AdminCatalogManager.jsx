import { useMemo, useState } from "react";
import {
  Carrot,
  Pencil,
  Plus,
  Save,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";

export function AdminCatalogManager({
  type,
  items,
  onAdd,
  onRemove,
  onRename,
}) {
  const isIngredient = type === "ingredient";
  const itemWithArticle = isIngredient ? "el ingrediente" : "la categoria";
  const newItemLabel = isIngredient ? "Nuevo ingrediente" : "Nueva categoria";
  const namePlaceholder = isIngredient
    ? "Nombre del ingrediente"
    : "Nombre de la categoria";
  const heading = isIngredient ? "Ingredientes" : "Categorias";
  const successMessages = isIngredient
    ? {
        added: "Ingrediente agregado correctamente.",
        updated: "Ingrediente actualizado correctamente.",
        removed: "Ingrediente eliminado correctamente.",
      }
    : {
        added: "Categoria agregada correctamente.",
        updated: "Categoria actualizada correctamente.",
        removed: "Categoria eliminada correctamente.",
      };
  const Icon = isIngredient ? Carrot : Tags;
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) =>
      item.label.toLowerCase().includes(normalizedQuery),
    );
  }, [items, query]);

  async function addItem(event) {
    event.preventDefault();

    if (!newName.trim()) {
      return;
    }

    setBusyId("new");
    setMessage("");

    try {
      await onAdd(newName);
      setNewName("");
      setMessage(successMessages.added);
    } catch (error) {
      setMessage(error.message || `No se pudo agregar ${itemWithArticle}.`);
    } finally {
      setBusyId(null);
    }
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditingName(item.label);
    setDeleteId(null);
    setMessage("");
  }

  async function saveItem(itemId) {
    if (!editingName.trim()) {
      return;
    }

    setBusyId(itemId);
    setMessage("");

    try {
      await onRename(itemId, editingName);
      setEditingId(null);
      setEditingName("");
      setMessage(successMessages.updated);
    } catch (error) {
      setMessage(error.message || `No se pudo editar ${itemWithArticle}.`);
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(itemId) {
    setBusyId(itemId);
    setMessage("");

    try {
      await onRemove(itemId);
      setDeleteId(null);
      setMessage(successMessages.removed);
    } catch (error) {
      setMessage(error.message || `No se pudo eliminar ${itemWithArticle}.`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="admin-catalog-manager">
      <div className="admin-catalog-heading">
        <div>
          <span className="admin-catalog-icon">
            <Icon aria-hidden="true" size={20} />
          </span>
          <div>
            <p>Catalogo</p>
            <h2>{heading}</h2>
          </div>
        </div>
        <strong>{items.length}</strong>
      </div>

      <form className="admin-catalog-add" onSubmit={addItem}>
        <label htmlFor={`new-${type}`}>{newItemLabel}</label>
        <div>
          <input
            id={`new-${type}`}
            maxLength={60}
            onChange={(event) => setNewName(event.target.value)}
            placeholder={namePlaceholder}
            value={newName}
          />
          <button disabled={busyId === "new" || !newName.trim()} type="submit">
            <Plus aria-hidden="true" size={18} />
            Agregar
          </button>
        </div>
      </form>

      <label className="admin-catalog-search" htmlFor={`search-${type}`}>
        <Search aria-hidden="true" size={18} />
        <input
          id={`search-${type}`}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Buscar ${heading.toLowerCase()}`}
          type="search"
          value={query}
        />
      </label>

      {message && (
        <p aria-live="polite" className="admin-action-message">
          {message}
        </p>
      )}

      <div className="admin-catalog-list">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => {
            const isEditing = editingId === item.id;
            const isDeleting = deleteId === item.id;
            const isBusy = busyId === item.id;

            return (
              <article className="admin-catalog-row" key={item.id}>
                <span className="admin-catalog-row-icon">
                  <Icon aria-hidden="true" size={17} />
                </span>

                {isEditing ? (
                  <input
                    aria-label={`Editar ${item.label}`}
                    autoFocus
                    maxLength={60}
                    onChange={(event) => setEditingName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        saveItem(item.id);
                      }
                    }}
                    value={editingName}
                  />
                ) : (
                  <div className="admin-catalog-copy">
                    <strong>{item.label}</strong>
                    <span>{item.id}</span>
                  </div>
                )}

                <div className="admin-catalog-actions">
                  {isEditing ? (
                    <>
                      <button
                        aria-label={`Guardar ${item.label}`}
                        className="save"
                        disabled={isBusy || !editingName.trim()}
                        onClick={() => saveItem(item.id)}
                        title="Guardar"
                        type="button"
                      >
                        <Save aria-hidden="true" size={17} />
                      </button>
                      <button
                        aria-label="Cancelar edicion"
                        onClick={() => setEditingId(null)}
                        title="Cancelar"
                        type="button"
                      >
                        <X aria-hidden="true" size={17} />
                      </button>
                    </>
                  ) : isDeleting ? (
                    <>
                      <button
                        className="delete-confirm"
                        disabled={isBusy}
                        onClick={() => removeItem(item.id)}
                        type="button"
                      >
                        Eliminar
                      </button>
                      <button
                        aria-label="Cancelar eliminacion"
                        onClick={() => setDeleteId(null)}
                        title="Cancelar"
                        type="button"
                      >
                        <X aria-hidden="true" size={17} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        aria-label={`Editar ${item.label}`}
                        onClick={() => startEditing(item)}
                        title="Editar"
                        type="button"
                      >
                        <Pencil aria-hidden="true" size={16} />
                      </button>
                      <button
                        aria-label={`Eliminar ${item.label}`}
                        className="danger"
                        onClick={() => {
                          setDeleteId(item.id);
                          setEditingId(null);
                        }}
                        title="Eliminar"
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={16} />
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state compact">
            <strong>Sin resultados</strong>
            <p>No hay elementos que coincidan con la busqueda.</p>
          </div>
        )}
      </div>
    </section>
  );
}
