import { Search, SlidersHorizontal } from "lucide-react";

type SearchPanelProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function SearchPanel({ query, onQueryChange }: SearchPanelProps) {
  return (
    <section className="mt-6">
      <label
        className="flex min-h-14 items-center gap-3 rounded-lg border border-[#dfe7d9] bg-white px-4 shadow-sm"
        htmlFor="recipe-search"
      >
        <Search aria-hidden="true" className="shrink-0 text-[#587063]" size={21} />
        <input
          id="recipe-search"
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#17201a] outline-none placeholder:text-[#7a887d]"
          placeholder="Buscar recetas"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          type="search"
        />
        <button
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f2f6ee] text-[#243528]"
          type="button"
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal aria-hidden="true" size={19} />
        </button>
      </label>
    </section>
  );
}
