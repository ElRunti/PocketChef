import { useState } from "react";
import { HomePage } from "./features/home/HomePage.jsx";
import LoginPage from "./features/login/LoginPage.jsx";
import RegisterPage from "./features/login/RegisterPage.jsx";

export function App() {
  const [activePage, setActivePage] = useState("login");

  if (activePage === "login") {
    return <LoginPage onLogin={() => setActivePage("home")} onNavigate={setActivePage} />;
  }

  if (activePage === "register") {
    return <RegisterPage onNavigate={setActivePage} />;
  }

  return <HomePage onNavigate={setActivePage} />;
}
