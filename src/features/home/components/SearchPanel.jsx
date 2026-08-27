import { Search, SlidersHorizontal } from "lucide-react";

export function SearchPanel({ query, onQueryChange, onOpenFilters }) {
  return (
    <section className="search-panel">
      <label htmlFor="recipe-search">
        <Search aria-hidden="true" size={21} />
        <input
          id="recipe-search"
          type="search"
          placeholder="Buscar recetas"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <button type="button" aria-label="Abrir filtros" onClick={onOpenFilters}>
          <SlidersHorizontal aria-hidden="true" size={19} />
        </button>
      </label>
    </section>
  );
}
