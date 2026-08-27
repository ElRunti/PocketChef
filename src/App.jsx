import { useMemo, useState } from "react";
import { Home, Refrigerator, Search, Timer } from "lucide-react";
import { HomePage } from "./features/home/HomePage.jsx";
import { IngredientesPage } from "./features/ingredientes/IngredientesPage.jsx";
import { ModoInteractivoPage } from "./features/modo-interactivo/ModoInteractivoPage.jsx";
import { RecipesPage } from "./features/recipes/RecipesPage.jsx";
import { getApprovedRecipes } from "./features/recipes/model/recipeModel.js";

const initialIngredients = ["egg", "tomato", "cheese", "tortilla", "avocado"];

const navItems = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "ingredients", label: "Ingredientes", icon: Refrigerator },
  { id: "recipes", label: "Recetas", icon: Search },
  { id: "interactive", label: "Modo", icon: Timer },
];

export function App() {
  const approvedRecipes = useMemo(() => getApprovedRecipes(), []);
  const [activeView, setActiveView] = useState("home");
  const [selectedIngredientIds, setSelectedIngredientIds] =
    useState(initialIngredients);
  const [selectedRecipeId, setSelectedRecipeId] = useState(
    approvedRecipes[0]?.id ?? "",
  );

  const selectedRecipe =
    approvedRecipes.find((recipe) => recipe.id === selectedRecipeId) ??
    approvedRecipes[0];

  function toggleIngredient(ingredientId) {
    setSelectedIngredientIds((currentIngredients) =>
      currentIngredients.includes(ingredientId)
        ? currentIngredients.filter((id) => id !== ingredientId)
        : [...currentIngredients, ingredientId],
    );
  }

  function clearIngredients() {
    setSelectedIngredientIds([]);
  }

  function openRecipes(recipeId) {
    if (recipeId) {
      setSelectedRecipeId(recipeId);
    }

    setActiveView("recipes");
  }

  function openInteractive(recipeId) {
    if (recipeId) {
      setSelectedRecipeId(recipeId);
    }

    setActiveView("interactive");
  }

  const sharedPageProps = {
    activeView,
    navItems,
    onNavigate: setActiveView,
  };

  if (activeView === "ingredients") {
    return (
      <IngredientesPage
        {...sharedPageProps}
        selectedIngredientIds={selectedIngredientIds}
        onClearIngredients={clearIngredients}
        onOpenRecipes={() => openRecipes()}
        onSelectRecipe={openRecipes}
        onToggleIngredient={toggleIngredient}
      />
    );
  }

  if (activeView === "recipes") {
    return (
      <RecipesPage
        {...sharedPageProps}
        selectedIngredientIds={selectedIngredientIds}
        selectedRecipeId={selectedRecipeId}
        onSelectRecipe={setSelectedRecipeId}
        onStartInteractive={openInteractive}
      />
    );
  }

  if (activeView === "interactive") {
    return (
      <ModoInteractivoPage
        {...sharedPageProps}
        selectedIngredientIds={selectedIngredientIds}
        selectedRecipe={selectedRecipe}
        onSelectRecipe={setSelectedRecipeId}
      />
    );
  }

  return (
    <HomePage
      {...sharedPageProps}
      selectedIngredientIds={selectedIngredientIds}
      onOpenIngredients={() => setActiveView("ingredients")}
      onOpenRecipes={openRecipes}
      onSelectRecipe={setSelectedRecipeId}
      onStartInteractive={openInteractive}
      onToggleIngredient={toggleIngredient}
    />
  );
}
