export function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <section className="category-tabs">
      {categories.map((category) => {
        const isActive = category.id === activeCategory;

        return (
          <button
            className={isActive ? "active" : ""}
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            type="button"
          >
            {category.label}
          </button>
        );
      })}
    </section>
  );
}
