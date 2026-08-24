import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Check scroll position to dynamically show/hide directional indicators
  const checkScrollability = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  React.useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [columns]);

  const handleScrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="md:hidden relative w-full">
      {/* Scrollable Tabs Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        className="flex overflow-x-auto gap-2 pb-2.5 custom-scrollbar-x pt-0.5 px-0.5 scroll-smooth"
      >
        {columns.map((col) => {
          const isActive = activeTab === col.id;
          const Icon = col.icon;

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectTab(col.id)}
              className={`whitespace-nowrap shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-950 text-white border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
                  : "bg-white text-slate-700 border-2 border-blue-900/30 hover:border-blue-900 hover:bg-slate-50 shadow-[1px_1px_0px_#E2E8F0]"
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

      {/* Indikator Panah Kanan (Bisa diklik untuk auto-scroll atau sebagai visual cue) */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-2.5 flex items-center pointer-events-none pr-0.5">
          <div className="h-full w-8 bg-gradient-to-l from-white via-white/80 to-transparent flex items-center justify-end" />
          <button
            type="button"
            onClick={() => handleScrollBy(160)}
            aria-label="Scroll kanan"
            className="pointer-events-auto flex items-center justify-center w-6 h-6 rounded-full bg-blue-950 text-white border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] hover:bg-orange-500 transition-all cursor-pointer animate-pulse"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Indikator Panah Kiri (Muncul saat user sudah scroll ke kanan) */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-2.5 flex items-center pointer-events-none pl-0.5">
          <button
            type="button"
            onClick={() => handleScrollBy(-160)}
            aria-label="Scroll kiri"
            className="pointer-events-auto flex items-center justify-center w-6 h-6 rounded-full bg-blue-950 text-white border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] hover:bg-orange-500 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="h-full w-8 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
      )}
    </div>
  );
}
