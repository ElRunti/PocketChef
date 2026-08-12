import { Home, PlusCircle, Search, ShieldCheck, UserRound } from "lucide-react";

const navItems = [
  { label: "Inicio", icon: Home, active: true },
  { label: "Buscar", icon: Search, active: false },
  { label: "Subir", icon: PlusCircle, active: false },
  { label: "Admin", icon: ShieldCheck, active: false },
  { label: "Perfil", icon: UserRound, active: false },
];

export function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Navegacion principal">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <button className={item.active ? "active" : ""} key={item.label} type="button">
            <Icon aria-hidden="true" size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
