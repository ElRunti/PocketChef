import { Bell, ChefHat } from "lucide-react";

type AppHeaderProps = {
  pendingCount: number;
};

export function AppHeader({ pendingCount }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg bg-[#f15f3b] text-white shadow-sm">
          <ChefHat aria-hidden="true" size={24} strokeWidth={2.4} />
        </div>
        <div>
          <p className="text-sm font-medium text-[#5c6b61]">Hola, equipo</p>
          <h1 className="text-2xl font-black text-[#17201a]">Pocket Chef</h1>
        </div>
      </div>
      <button
        className="relative grid size-11 place-items-center rounded-lg border border-[#dce8d5] bg-white text-[#243528] shadow-sm"
        aria-label="Ver recetas pendientes"
        type="button"
      >
        <Bell aria-hidden="true" size={21} />
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-lg bg-[#1f7a5c] px-1 text-xs font-bold text-white">
          {pendingCount}
        </span>
      </button>
    </header>
  );
}
