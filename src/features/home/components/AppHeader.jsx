import { Bell, ChefHat } from "lucide-react";

export function AppHeader({ pendingCount }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <ChefHat aria-hidden="true" size={24} strokeWidth={2.4} />
        </div>
        <div>
          <p>Hola, equipo</p>
          <h1>Pocket Chef</h1>
        </div>
      </div>

      <button className="icon-button notification-button" aria-label="Ver recetas pendientes">
        <Bell aria-hidden="true" size={21} />
        <span>{pendingCount}</span>
      </button>
    </header>
  );
}
