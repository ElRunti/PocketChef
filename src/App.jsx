import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Heart, Home, PlusCircle, Refrigerator, Search } from "lucide-react";
import { FavoritosPage } from "./features/favoritos/FavoritosPage.jsx";
import { useFavorites } from "./features/favoritos/hooks/useFavorites.js";
import { HomePage } from "./features/home/HomePage.jsx";
import { IngredientesPage } from "./features/ingredientes/IngredientesPage.jsx";
import { ModoInteractivoPage } from "./features/modo-interactivo/ModoInteractivoPage.jsx";
import { RecipeDetailPage } from "./features/recipes/RecipeDetailPage.jsx";
import { RecipesPage } from "./features/recipes/RecipesPage.jsx";
import { getApprovedRecipes } from "./features/recipes/model/recipeModel.js";
import SubirRecetaPage from "./features/subir-receta/SubirRecetaPage.jsx";

const initialIngredients = ["egg", "tomato", "cheese", "tortilla", "avocado"];

const navItems = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "ingredients", label: "Despensa", icon: Refrigerator },
  { id: "recipes", label: "Recetas", icon: Search },
  { id: "upload", label: "Subir", icon: PlusCircle },
  { id: "favorites", label: "Favoritos", icon: Heart },
];

export function App() {
  const approvedRecipes = useMemo(() => getApprovedRecipes(), []);
  const [activeView, setActiveView] = useState("home");
  const [selectedIngredientIds, setSelectedIngredientIds] =
    useState(initialIngredients);
  const [selectedRecipeId, setSelectedRecipeId] = useState(
    approvedRecipes[0]?.id ?? "",
  );
  const {
    favorites: favoriteRecipeIds,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const selectedRecipe =
    approvedRecipes.find((recipe) => recipe.id === selectedRecipeId) ??
    approvedRecipes[0];

  const activeNavItemId =
    activeView === "recipe-detail" || activeView === "interactive"
      ? "recipes"
      : activeView;

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
        isFavorite={isFavorite(selectedRecipe?.id)}
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

  if (activeView === "upload") {
    return <SubirRecetaPage {...sharedPageProps} />;
  }

  if (activeView === "favorites") {
    return (
      <FavoritosPage
        {...sharedPageProps}
        favoriteRecipeIds={favoriteRecipeIds}
        onOpenRecipeDetail={openRecipeDetail}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <HomePage
      {...sharedPageProps}
      isFavorite={isFavorite}
      selectedIngredientIds={selectedIngredientIds}
      onOpenIngredients={() => navigateTo("ingredients")}
      onOpenRecipes={openRecipes}
      onOpenRecipeDetail={openRecipeDetail}
      onStartInteractive={openInteractive}
      onToggleFavorite={toggleFavorite}
      onToggleIngredient={toggleIngredient}
    />
  );
}
