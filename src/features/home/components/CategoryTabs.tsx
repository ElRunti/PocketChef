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
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              className={[
                "min-h-11 w-full rounded-lg border px-3 py-2 text-sm font-bold transition",
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
