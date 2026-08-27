import { Home, PlusCircle, Search, ShieldCheck, UserRound } from "lucide-react";

const defaultNavItems = [
  { id: "home", label: "Inicio", icon: Home, active: true },
  { id: "search", label: "Buscar", icon: Search, active: false },
  { id: "upload", label: "Subir", icon: PlusCircle, active: false },
  { id: "admin", label: "Admin", icon: ShieldCheck, active: false },
  { id: "profile", label: "Perfil", icon: UserRound, active: false },
];

export function BottomNavigation({
  activeItemId = "home",
  items = defaultNavItems,
  onNavigate,
}) {
  return (
    <nav
      aria-label="Navegacion principal"
      className="bottom-navigation"
      style={{ "--nav-count": items.length }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeItemId ? activeItemId === item.id : item.active;

        return (
          <button
            className={isActive ? "active" : ""}
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            type="button"
          >
            <Icon aria-hidden="true" size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
