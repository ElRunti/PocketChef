import type { Category, Ingredient, Recipe } from "../types";

export const categories: Category[] = [
  { id: "all", label: "Todas" },
  { id: "breakfast", label: "Desayunos" },
  { id: "lunch", label: "Almuerzos" },
  { id: "dinner", label: "Cenas" },
  { id: "dessert", label: "Postres" },
  { id: "quick", label: "Rapidas" },
];

export const pantryIngredients: Ingredient[] = [
  { id: "egg", label: "Huevo" },
  { id: "tomato", label: "Tomate" },
  { id: "cheese", label: "Queso" },
  { id: "tortilla", label: "Tortilla" },
  { id: "avocado", label: "Aguacate" },
  { id: "rice", label: "Arroz" },
  { id: "chicken", label: "Pollo" },
  { id: "pasta", label: "Pasta" },
  { id: "banana", label: "Banano" },
  { id: "oats", label: "Avena" },
];

export const recipes: Recipe[] = [
  {
    id: "egg-taco",
    title: "Tacos de huevo con aguacate",
    description: "Una receta rapida para desayuno o cena ligera.",
    categoryId: "breakfast",
    time: "15 min",
    difficulty: "Facil",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    ingredientIds: ["egg", "tomato", "cheese", "tortilla", "avocado"],
    steps: [
      "Bate los huevos con una pizca de sal.",
      "Cocina el tomate y agrega el huevo.",
      "Calienta las tortillas y agrega queso.",
      "Sirve con aguacate encima.",
    ],
    rating: 4.8,
    status: "approved",
  },
  {
    id: "chicken-rice",
    title: "Bowl de pollo con arroz",
    description: "Plato completo para almuerzo con pocos ingredientes.",
    categoryId: "lunch",
    time: "25 min",
    difficulty: "Media",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    ingredientIds: ["chicken", "rice", "tomato", "avocado"],
    steps: [
      "Cocina el arroz hasta que quede suave.",
      "Dora el pollo en una sarten.",
      "Corta tomate y aguacate.",
      "Arma el bowl y sirve caliente.",
    ],
    rating: 4.7,
    status: "approved",
  },
  {
    id: "quick-pasta",
    title: "Pasta cremosa con queso",
    description: "Cena simple cuando necesitas algo rapido.",
    categoryId: "dinner",
    time: "20 min",
    difficulty: "Facil",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
    ingredientIds: ["pasta", "cheese", "tomato"],
    steps: [
      "Hierve la pasta segun el empaque.",
      "Prepara una salsa rapida con tomate.",
      "Agrega queso hasta que quede cremosa.",
      "Mezcla y sirve.",
    ],
    rating: 4.6,
    status: "approved",
  },
  {
    id: "banana-oats",
    title: "Avena con banano",
    description: "Desayuno dulce, economico y facil de preparar.",
    categoryId: "quick",
    time: "10 min",
    difficulty: "Facil",
    image:
      "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=80",
    ingredientIds: ["banana", "oats"],
    steps: [
      "Cocina la avena con agua o leche.",
      "Corta el banano en rodajas.",
      "Sirve la avena y agrega el banano.",
      "Agrega canela si tienes disponible.",
    ],
    rating: 4.5,
    status: "approved",
  },
  {
    id: "admin-pending-salad",
    title: "Ensalada fresca de la comunidad",
    description: "Receta enviada por un usuario y pendiente de revision.",
    categoryId: "lunch",
    time: "12 min",
    difficulty: "Facil",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    ingredientIds: ["tomato", "cheese", "avocado"],
    steps: [
      "Lava y corta los ingredientes.",
      "Mezcla todo en un bowl.",
      "Ajusta sal y sirve frio.",
    ],
    rating: 4.3,
    status: "pending",
  },
];
