import { Heart, Home, PlusCircle, Search, ShieldCheck, UserRound } from "lucide-react";

const navItems = [
  { label: "Inicio", icon: Home, page: "home" },
  { label: "Buscar", icon: Search, page: "search" },
  { label: "Subir", icon: PlusCircle, page: "upload" },
  { label: "Admin", icon: ShieldCheck, page: "admin" },
  { label: "Favoritos", icon: Heart, page: "favoritos" },
  { label: "Perfil", icon: UserRound, page: "profile" },
];

export function BottomNavigation({ activePage, onNavigate }) {
  return (
    <nav className="bottom-navigation" aria-label="Navegacion principal">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            className={item.page === activePage ? "active" : ""}
            key={item.page}
            type="button"
            onClick={() => onNavigate?.(item.page)}
          >
            <Icon aria-hidden="true" size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
