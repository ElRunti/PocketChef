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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dce8d5] bg-white/94 px-3 py-2 shadow-[0_-10px_30px_rgba(23,32,26,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className={[
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-black transition",
                item.active
                  ? "bg-[#e7f4ee] text-[#1f7a5c]"
                  : "text-[#6b7a70] hover:bg-[#f2f6ee]",
              ].join(" ")}
              key={item.label}
              type="button"
            >
              <Icon aria-hidden="true" size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
