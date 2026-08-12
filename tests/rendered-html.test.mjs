import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Pocket Chef home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es">/i);
  assert.match(html, /<title>Pocket Chef \| Inicio<\/title>/i);
  assert.match(html, /Pocket Chef/);
  assert.match(html, /Buscar recetas/);
  assert.match(html, /Ingredientes disponibles/);
  assert.match(html, /Recetas para hoy/);
  assert.match(html, /Modo guiado/);
  assert.match(html, /Tacos de huevo con aguacate/);
  assert.match(html, /images\.unsplash\.com/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps Pocket Chef organized by modules", async () => {
  const [page, layout, styles, packageJson, homePage, categoryTabs, recipeData, bottomNavigation] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(
        new URL("../src/features/home/HomePage.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL(
          "../src/features/home/components/CategoryTabs.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../src/features/recipes/data/recipes.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../src/shared/components/BottomNavigation.tsx", import.meta.url),
        "utf8",
      ),
    ]);

  assert.match(page, /@\/src\/features\/home\/HomePage/);
  assert.match(layout, /title:\s*"Pocket Chef"/);
  assert.match(styles, /overflow-x:\s*hidden/);
  assert.match(packageJson, /"name": "pocket-chef"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(homePage, /selectedIngredientIds/);
  assert.match(homePage, /GuidedModePreview/);
  assert.match(categoryTabs, /grid-cols-2/);
  assert.doesNotMatch(categoryTabs, /overflow-x-auto/);
  assert.match(recipeData, /status:\s*"pending"/);
  assert.match(recipeData, /ingredientIds/);
  assert.match(bottomNavigation, /ShieldCheck/);

  const remainingPreviewFiles = await readdir(previewRoot).catch(() => []);
  assert.deepEqual(remainingPreviewFiles, []);
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});
