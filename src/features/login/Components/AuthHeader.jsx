import { ChefHat } from "lucide-react";

export function AuthHeader() {
  return (
    <header className="app-header auth-header">
      <div className="brand">
        <div className="brand-icon">
          <ChefHat aria-hidden="true" size={24} strokeWidth={2.4} />
        </div>
        <div>
          <p>Hola, equipo</p>
          <h1>Pocket Chef</h1>
        </div>
      </div>
    </header>
  );
}
