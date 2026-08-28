import { ChefHat, LayoutDashboard, Sparkles, UserRound } from "lucide-react";

export function AppHeader({
  currentProfile,
  isAdmin,
  pendingCount,
  onOpenAccount,
  onOpenAdmin,
  onOpenDiscover,
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <ChefHat aria-hidden="true" size={24} strokeWidth={2.4} />
        </div>
        <div>
          <p>Hola, {currentProfile?.name ?? "chef invitado"}</p>
          <h1>Pocket Chef</h1>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="icon-button"
          aria-label="Descubrir recetas para ti"
          onClick={onOpenDiscover}
          type="button"
        >
          <Sparkles aria-hidden="true" size={20} />
        </button>
        {isAdmin && (
          <button
            className="admin-dashboard-button notification-button"
            aria-label="Abrir panel de administracion"
            onClick={onOpenAdmin}
            type="button"
          >
            <LayoutDashboard aria-hidden="true" size={19} />
            <strong>Administrar</strong>
            {pendingCount > 0 && <span>{pendingCount}</span>}
          </button>
        )}
        <button
          className="icon-button"
          aria-label={currentProfile ? "Ver mi cuenta" : "Iniciar sesion"}
          onClick={onOpenAccount}
          type="button"
        >
          <UserRound aria-hidden="true" size={20} />
        </button>
      </div>
    </header>
  );
}
