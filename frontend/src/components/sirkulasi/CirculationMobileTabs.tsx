import type { StatusColumnConfig, ActiveCircStatus } from "@/hooks/usePetugasCirculation";

interface CirculationMobileTabsProps {
  columns: StatusColumnConfig[];
  activeTab: ActiveCircStatus;
  onSelectTab: (id: ActiveCircStatus) => void;
}

export function CirculationMobileTabs({
  columns,
  activeTab,
  onSelectTab,
}: CirculationMobileTabsProps) {
  return (
    <div className="md:hidden flex overflow-x-auto gap-2 pb-2 no-scrollbar">
      {columns.map((col) => {
        const isActive = activeTab === col.id;
        const Icon = col.icon;

        return (
          <button
            key={col.id}
            type="button"
            onClick={() => onSelectTab(col.id)}
            className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-blue-950 text-white border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
                : "bg-white text-slate-700 border-2 border-blue-900/30 hover:border-blue-900 hover:bg-slate-50"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-orange-400" : "text-slate-500"}`} />
            <span>{col.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {col.items.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
