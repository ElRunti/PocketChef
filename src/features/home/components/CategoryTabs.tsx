import type { Category } from "../../recipes/types";

type CategoryTabsProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
};

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <section className="mt-6">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              className={[
                "shrink-0 rounded-lg border px-4 py-2 text-sm font-bold transition",
                isActive
                  ? "border-[#1f7a5c] bg-[#1f7a5c] text-white shadow-sm"
                  : "border-[#dbe6d5] bg-white text-[#4d5f55]",
              ].join(" ")}
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              type="button"
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
