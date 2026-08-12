export type RecipeStatus = "approved" | "pending" | "rejected";

export type RecipeDifficulty = "Facil" | "Media" | "Avanzada";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  time: string;
  difficulty: RecipeDifficulty;
  image: string;
  ingredientIds: string[];
  steps: string[];
  rating: number;
  status: RecipeStatus;
};

export type Category = {
  id: string;
  label: string;
};

export type Ingredient = {
  id: string;
  label: string;
};
