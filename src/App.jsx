import { useState } from "react";
import { HomePage } from "./features/home/HomePage.jsx";
import { FavoritosPage } from "./features/favoritos/FavoritosPage.jsx";

export function App() {
  const [activePage, setActivePage] = useState("home");

  if (activePage === "favoritos") {
    return <FavoritosPage onNavigate={setActivePage} />;
  }

  return <HomePage onNavigate={setActivePage} />;
}
