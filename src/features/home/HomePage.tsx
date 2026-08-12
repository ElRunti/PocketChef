"use client";

import { PlusCircle, ShieldCheck, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { BottomNavigation } from "@/src/shared/components/BottomNavigation";
import {
  categories,
  pantryIngredients,
  recipes,
} from "../recipes/data/recipes";
import type { Recipe } from "../recipes/types";
import { AppHeader } from "./components/AppHeader";
import { CategoryTabs } from "./components/CategoryTabs";
import { FeaturedRecipe } from "./components/FeaturedRecipe";
import { GuidedModePreview } from "./components/GuidedModePreview";
import { IngredientSelector } from "./components/IngredientSelector";
import { RecipeCard } from "./components/RecipeCard";
import { SearchPanel } from "./components/SearchPanel";

const initialIngredients = ["egg", "tomato", "cheese", "tortilla", "avocado"];

function countMissingIngredients(recipe: Recipe, selectedIngredientIds: string[]) {
  if (selectedIngredientIds.length === 0) {
    return 0;
  }

  return recipe.ingredientIds.filter(
    (ingredientId) => !selectedIngredientIds.includes(ingredientId),
  ).length;
}

export function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedIngredientIds, setSelectedIngredientIds] =
    useState(initialIngredients);
  const [activeStep, setActiveStep] = useState(0);

  const approvedRecipes = recipes.filter((recipe) => recipe.status === "approved");
  const pendingRecipes = recipes.filter((recipe) => recipe.status === "pending");
  const featuredRecipe = approvedRecipes[0];

  const filteredRecipes = useMemo(() => {
    return approvedRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesCategory =
        activeCategory === "all" || recipe.categoryId === activeCategory;
      const matchesIngredients =
        selectedIngredientIds.length === 0 ||
        recipe.ingredientIds.every((ingredientId) =>
          selectedIngredientIds.includes(ingredientId),
        );

      return matchesSearch && matchesCategory && matchesIngredients;
    });
  }, [activeCategory, approvedRecipes, query, selectedIngredientIds]);

  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredientIds((currentIngredients) =>
      currentIngredients.includes(ingredientId)
        ? currentIngredients.filter((id) => id !== ingredientId)
        : [...currentIngredients, ingredientId],
    );
  };

  const handlePreviousStep = () => {
    setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const handleNextStep = () => {
    setActiveStep((currentStep) =>
      Math.min(currentStep + 1, featuredRecipe.steps.length - 1),
    );
  };

  return (
    <main className="pocket-chef-shell pb-24">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <AppHeader pendingCount={pendingRecipes.length} />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <SearchPanel query={query} onQueryChange={setQuery} />
            <FeaturedRecipe
              recipe={featuredRecipe}
              matchLabel={`${selectedIngredientIds.length} ingredientes`}
            />
            <CategoryTabs
              activeCategory={activeCategory}
              categories={categories}
              onCategoryChange={setActiveCategory}
            />
            <IngredientSelector
              ingredients={pantryIngredients}
              onToggleIngredient={toggleIngredient}
              selectedIngredientIds={selectedIngredientIds}
            />
          </div>

          <div className="lg:pt-6">
            <section className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-[#dce8d5] bg-white p-3 shadow-sm">
                <Utensils aria-hidden="true" className="text-[#f15f3b]" size={20} />
                <p className="mt-2 text-2xl font-black text-[#17201a]">
                  {filteredRecipes.length}
                </p>
                <p className="text-xs font-bold text-[#607065]">compatibles</p>
              </div>
              <div className="rounded-lg border border-[#dce8d5] bg-white p-3 shadow-sm">
                <PlusCircle
                  aria-hidden="true"
                  className="text-[#1f7a5c]"
                  size={20}
                />
                <p className="mt-2 text-2xl font-black text-[#17201a]">Nueva</p>
                <p className="text-xs font-bold text-[#607065]">receta</p>
              </div>
              <div className="rounded-lg border border-[#dce8d5] bg-white p-3 shadow-sm">
                <ShieldCheck
                  aria-hidden="true"
                  className="text-[#3b63d9]"
                  size={20}
                />
                <p className="mt-2 text-2xl font-black text-[#17201a]">
                  {pendingRecipes.length}
                </p>
                <p className="text-xs font-bold text-[#607065]">revision</p>
              </div>
            </section>

            <section className="mt-7">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-[#f15f3b]">
                    Resultados
                  </p>
                  <h2 className="text-lg font-black text-[#17201a]">
                    Recetas para hoy
                  </h2>
                </div>
                <span className="text-sm font-bold text-[#607065]">
                  {filteredRecipes.length} listas
                </span>
              </div>

              <div className="grid gap-3">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      missingIngredients={countMissingIngredients(
                        recipe,
                        selectedIngredientIds,
                      )}
                      recipe={recipe}
                    />
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-[#cbd9c5] bg-white p-5 text-center">
                    <p className="text-base font-black text-[#17201a]">
                      No hay recetas exactas
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#68776d]">
                      Quita un ingrediente o cambia la categoria para probar otra
                      combinacion.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <GuidedModePreview
              activeStep={activeStep}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              steps={featuredRecipe.steps}
            />
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}
