# Pocket Chef

Pocket Chef is a mobile-first React app for a recipe project. The first version
includes a home screen with recipe search, category filters, ingredient
selection, compatible recipe results, a guided cooking preview, and admin
status indicators.

## Tech Stack

- React
- Vinext
- Tailwind CSS
- TypeScript
- Lucide React icons

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by the terminal. In this workspace it runs at:

```bash
http://localhost:3000/
```

## Main Commands

```bash
npm run dev
npm run build
npm test
npm run lint
```

## Folder Structure

```txt
app/
  globals.css            Global styles and theme variables
  layout.tsx             App metadata and root layout
  page.tsx               Home route

src/
  features/
    home/
      HomePage.tsx       Home screen state and layout
      components/        Home-only UI components
    recipes/
      data/recipes.ts    Temporary recipe, category, and ingredient data
      types.ts           Recipe, category, and ingredient types
  shared/
    components/          Reusable app components

tests/
  rendered-html.test.mjs Basic render and structure tests
```

## Suggested Next Modules

```txt
src/features/recipe-detail/
src/features/recipe-submit/
src/features/admin/
src/features/auth/
src/features/favorites/
```

## Team Workflow

Since all 3 juniors will work fullstack, split work by complete feature:

- Junior 1: recipe listing, search, and detail.
- Junior 2: ingredients, filters, and guided mode.
- Junior 3: recipe submission, admin review, and testing.

Each feature should include its screen, data/API logic, and basic tests.
