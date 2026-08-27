import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Home, Refrigerator, Search, Timer } from "lucide-react";
import { HomePage } from "./features/home/HomePage.jsx";
import { IngredientesPage } from "./features/ingredientes/IngredientesPage.jsx";
import { ModoInteractivoPage } from "./features/modo-interactivo/ModoInteractivoPage.jsx";
import { RecipeDetailPage } from "./features/recipes/RecipeDetailPage.jsx";
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
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState([]);

  const selectedRecipe =
    approvedRecipes.find((recipe) => recipe.id === selectedRecipeId) ??
    approvedRecipes[0];

  const activeNavItemId = activeView === "recipe-detail" ? "recipes" : activeView;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeView]);

  function updateScreen(updateState) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(updateState);
      });
      return;
    }

    updateState();
  }

  function navigateTo(viewId) {
    updateScreen(() => setActiveView(viewId));
  }

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
    updateScreen(() => {
      if (recipeId) {
        setSelectedRecipeId(recipeId);
      }

      setActiveView("recipes");
    });
  }

  function openRecipeDetail(recipeId) {
    updateScreen(() => {
      if (recipeId) {
        setSelectedRecipeId(recipeId);
      }

      setActiveView("recipe-detail");
    });
  }

  function openInteractive(recipeId) {
    updateScreen(() => {
      if (recipeId) {
        setSelectedRecipeId(recipeId);
      }

      setActiveView("interactive");
    });
  }

  function toggleFavorite(recipeId) {
    setFavoriteRecipeIds((currentRecipeIds) =>
      currentRecipeIds.includes(recipeId)
        ? currentRecipeIds.filter((id) => id !== recipeId)
        : [...currentRecipeIds, recipeId],
    );
  }

  const sharedPageProps = {
    activeView: activeNavItemId,
    navItems,
    onNavigate: navigateTo,
  };

  if (activeView === "ingredients") {
    return (
      <IngredientesPage
        {...sharedPageProps}
        selectedIngredientIds={selectedIngredientIds}
        onClearIngredients={clearIngredients}
        onOpenRecipes={() => openRecipes()}
        onSelectRecipe={openRecipeDetail}
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
        onOpenRecipeDetail={openRecipeDetail}
      />
    );
  }

  if (activeView === "recipe-detail") {
    return (
      <RecipeDetailPage
        {...sharedPageProps}
        isFavorite={favoriteRecipeIds.includes(selectedRecipe?.id)}
        selectedIngredientIds={selectedIngredientIds}
        selectedRecipe={selectedRecipe}
        onBack={() => openRecipes(selectedRecipe?.id)}
        onStartInteractive={openInteractive}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  if (activeView === "interactive") {
    return (
      <ModoInteractivoPage
        {...sharedPageProps}
        selectedIngredientIds={selectedIngredientIds}
        selectedRecipe={selectedRecipe}
        onBackToRecipe={() => openRecipeDetail(selectedRecipe?.id)}
      />
    );
  }

  return (
    <HomePage
      {...sharedPageProps}
      selectedIngredientIds={selectedIngredientIds}
      onOpenIngredients={() => navigateTo("ingredients")}
      onOpenRecipes={openRecipes}
      onOpenRecipeDetail={openRecipeDetail}
      onStartInteractive={openInteractive}
      onToggleIngredient={toggleIngredient}
    />
  );
}
