import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Heart, Home, PlusCircle, Refrigerator, Search } from "lucide-react";
import { AdminPage } from "./features/admin/AdminPage.jsx";
import { AdminRecipeEditorPage } from "./features/admin/AdminRecipeEditorPage.jsx";
import { AuthPage } from "./features/auth/AuthPage.jsx";
import { useAuth } from "./features/auth/hooks/useAuth.js";
import { RecipeCommunityPage } from "./features/community/RecipeCommunityPage.jsx";
import { useRecipeCommunity } from "./features/community/hooks/useRecipeCommunity.js";
import { DiscoverPage } from "./features/discover/DiscoverPage.jsx";
import { FavoritosPage } from "./features/favoritos/FavoritosPage.jsx";
import { useFavorites } from "./features/favoritos/hooks/useFavorites.js";
import { HomePage } from "./features/home/HomePage.jsx";
import { IngredientesPage } from "./features/ingredientes/IngredientesPage.jsx";
import { ModoInteractivoPage } from "./features/modo-interactivo/ModoInteractivoPage.jsx";
import { RecipeDetailPage } from "./features/recipes/RecipeDetailPage.jsx";
import { RecipesPage } from "./features/recipes/RecipesPage.jsx";
import { useRecipeCatalog } from "./features/recipes/hooks/useRecipeCatalog.js";
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
  const auth = useAuth();
  const {
    recipeCatalog,
    approvedRecipes,
    pendingRecipes,
    submitRecipe,
    updateRecipe,
    moderateRecipe,
  } = useRecipeCatalog(auth.user, auth.profile);
  const {
    addComment,
    getRecipeComments,
    getRecipeRating,
    rateRecipe,
  } = useRecipeCommunity(auth.user, auth.profile);
  const sharedRecipeId = window.location.hash.replace(/^#/, "");
  const hasSharedRecipe = approvedRecipes.some(
    (recipe) => recipe.id === sharedRecipeId,
  );
  const [activeView, setActiveView] = useState(
    hasSharedRecipe ? "recipe-detail" : "home",
  );
  const [selectedIngredientIds, setSelectedIngredientIds] =
    useState(initialIngredients);
  const [selectedRecipeId, setSelectedRecipeId] = useState(
    hasSharedRecipe ? sharedRecipeId : approvedRecipes[0]?.id ?? "",
  );
  const [selectedModerationRecipeId, setSelectedModerationRecipeId] = useState(
    pendingRecipes[0]?.id ?? recipeCatalog[0]?.id ?? "",
  );
  const [shareStatus, setShareStatus] = useState("");
  const [postAuthView, setPostAuthView] = useState(null);
  const [accessMessage, setAccessMessage] = useState("");
  const {
    favorites: favoriteRecipeIds,
    isFavorite,
    toggleFavorite,
  } = useFavorites(auth.user);

  const selectedRecipe =
    approvedRecipes.find((recipe) => recipe.id === selectedRecipeId) ??
    approvedRecipes[0];
  const selectedModerationRecipe =
    recipeCatalog.find((recipe) => recipe.id === selectedModerationRecipeId) ??
    pendingRecipes[0] ??
    recipeCatalog[0];

  const activeNavItemId =
    ["recipe-detail", "recipe-community", "interactive"].includes(activeView)
      ? "recipes"
      : ["admin", "admin-edit", "discover"].includes(activeView)
        ? "home"
        : activeView;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "auth" || !postAuthView || !auth.user || auth.loading) {
      return;
    }

    if (postAuthView === "admin" && !auth.isAdmin) {
      setAccessMessage("Tu cuenta no tiene permisos de administrador.");
      setPostAuthView(null);
      return;
    }

    setActiveView(postAuthView);
    setPostAuthView(null);
    setAccessMessage("");
  }, [activeView, auth.isAdmin, auth.loading, auth.user, postAuthView]);

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
    if (viewId === "upload" && auth.isConfigured && !auth.user) {
      setPostAuthView("upload");
      setAccessMessage("Inicia sesion para publicar una receta.");
      updateScreen(() => setActiveView("auth"));
      return;
    }

    if (["admin", "admin-edit"].includes(viewId) && !auth.isAdmin) {
      setPostAuthView(auth.user ? null : "admin");
      setAccessMessage(
        auth.user
          ? "Tu cuenta no tiene permisos de administrador."
          : "Inicia sesion con una cuenta administradora.",
      );
      updateScreen(() => setActiveView("auth"));
      return;
    }

    if (viewId === "auth") {
      setPostAuthView(null);
      setAccessMessage("");
    }

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
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
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
    updateScreen(() => {
      setShareStatus("");
      if (recipeId) {
        setSelectedRecipeId(recipeId);
      }

      setActiveView("recipes");
    });
  }

  function openRecipeDetail(recipeId) {
    if (recipeId) {
      window.history.replaceState(null, "", `#${recipeId}`);
    }
    updateScreen(() => {
      setShareStatus("");
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

  function openRecipeCommunity(recipeId) {
    updateScreen(() => {
      setSelectedRecipeId(recipeId);
      setActiveView("recipe-community");
    });
  }

  function openAdminEditor(recipeId) {
    updateScreen(() => {
      setSelectedModerationRecipeId(recipeId);
      setActiveView("admin-edit");
    });
  }

  function handleEditorModeration(recipeId, status) {
    moderateRecipe(recipeId, status);
    navigateTo("admin");
  }

  async function shareRecipe(recipe) {
    if (!recipe) {
      return;
    }

    const shareData = {
      title: recipe.title,
      text: `Mira esta receta de Pocket Chef: ${recipe.title}`,
      url: `${window.location.origin}${window.location.pathname}#${recipe.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Receta compartida.");
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`,
        );
        setShareStatus("Enlace copiado.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareStatus("No se pudo compartir en este navegador.");
      }
    }
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
        approvedRecipes={approvedRecipes}
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
        approvedRecipes={approvedRecipes}
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
        communityRating={getRecipeRating(selectedRecipe)}
        selectedIngredientIds={selectedIngredientIds}
        selectedRecipe={selectedRecipe}
        onBack={() => openRecipes(selectedRecipe?.id)}
        onOpenCommunity={openRecipeCommunity}
        onShareRecipe={shareRecipe}
        onStartInteractive={openInteractive}
        onToggleFavorite={toggleFavorite}
        shareStatus={shareStatus}
      />
    );
  }

  if (activeView === "recipe-community") {
    return (
      <RecipeCommunityPage
        {...sharedPageProps}
        comments={getRecipeComments(selectedRecipe?.id)}
        onAddComment={addComment}
        onBack={() => openRecipeDetail(selectedRecipe?.id)}
        onRateRecipe={rateRecipe}
        rating={getRecipeRating(selectedRecipe)}
        recipe={selectedRecipe}
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
    if (auth.isConfigured && !auth.user) {
      return (
        <AuthPage
          {...sharedPageProps}
          accessMessage="Inicia sesion para publicar una receta."
          auth={auth}
          onBack={() => navigateTo("home")}
        />
      );
    }

    return (
      <SubirRecetaPage
        {...sharedPageProps}
        onSubmitRecipe={submitRecipe}
      />
    );
  }

  if (activeView === "favorites") {
    return (
      <FavoritosPage
        {...sharedPageProps}
        approvedRecipes={approvedRecipes}
        favoriteRecipeIds={favoriteRecipeIds}
        onOpenRecipeDetail={openRecipeDetail}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  if (activeView === "admin") {
    if (!auth.isAdmin) {
      return (
        <AuthPage
          {...sharedPageProps}
          accessMessage="Necesitas el rol administrador para entrar aqui."
          auth={auth}
          onBack={() => navigateTo("home")}
        />
      );
    }

    return (
      <AdminPage
        {...sharedPageProps}
        onBack={() => navigateTo("home")}
        onEditRecipe={openAdminEditor}
        onModerateRecipe={moderateRecipe}
        recipeCatalog={recipeCatalog}
      />
    );
  }

  if (activeView === "admin-edit") {
    if (!auth.isAdmin) {
      return (
        <AuthPage
          {...sharedPageProps}
          accessMessage="Necesitas el rol administrador para editar recetas."
          auth={auth}
          onBack={() => navigateTo("home")}
        />
      );
    }

    return (
      <AdminRecipeEditorPage
        {...sharedPageProps}
        onBack={() => navigateTo("admin")}
        onModerateRecipe={handleEditorModeration}
        onSaveRecipe={updateRecipe}
        recipe={selectedModerationRecipe}
      />
    );
  }

  if (activeView === "discover") {
    return (
      <DiscoverPage
        {...sharedPageProps}
        approvedRecipes={approvedRecipes}
        getRecipeRating={getRecipeRating}
        onBack={() => navigateTo("home")}
        onOpenRecipe={openRecipeDetail}
        selectedIngredientIds={selectedIngredientIds}
      />
    );
  }

  if (activeView === "auth") {
    return (
      <AuthPage
        {...sharedPageProps}
        accessMessage={accessMessage}
        auth={auth}
        onBack={() => navigateTo("home")}
      />
    );
  }

  return (
    <HomePage
      {...sharedPageProps}
      approvedRecipes={approvedRecipes}
      currentProfile={auth.profile}
      isAdmin={auth.isAdmin}
      isFavorite={isFavorite}
      selectedIngredientIds={selectedIngredientIds}
      onOpenIngredients={() => navigateTo("ingredients")}
      onOpenAccount={() => navigateTo("auth")}
      onOpenAdmin={() => navigateTo("admin")}
      onOpenDiscover={() => navigateTo("discover")}
      onOpenRecipes={openRecipes}
      onOpenRecipeDetail={openRecipeDetail}
      onStartInteractive={openInteractive}
      onToggleFavorite={toggleFavorite}
      onToggleIngredient={toggleIngredient}
      pendingRecipes={pendingRecipes}
    />
  );
}
