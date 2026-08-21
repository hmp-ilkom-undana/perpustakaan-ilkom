import type { StatusColumnConfig } from "@/hooks/usePetugasCirculation";
import { Badge } from "@/components/ui/badge";
import { CirculationCard } from "./CirculationCard";
import { CirculationEmptyState } from "./CirculationEmptyState";

interface CirculationStatusColumnProps {
  column: StatusColumnConfig;
  isActiveOnMobile: boolean;
  onSelectCard: (id: string) => void;
  isFiltered: boolean;
}

export function CirculationStatusColumn({
  column,
  isActiveOnMobile,
  onSelectCard,
  isFiltered,
}: CirculationStatusColumnProps) {
  const Icon = column.icon;

  return (
    <div
      className={`shrink-0 w-full md:w-80 flex flex-col h-full ${
        isActiveOnMobile ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white border-2 border-blue-900 flex items-center justify-center text-blue-950 shadow-[1px_1px_0px_#1E3A8A]">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-heading font-black text-xs md:text-sm text-blue-950 uppercase tracking-wider">
            {column.label}
          </h2>
        </div>

        <Badge variant={column.badgeVariant} className="font-mono text-[11px] px-2 py-0">
          {column.items.length}
        </Badge>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4 no-scrollbar">
        {column.items.length > 0 ? (
          column.items.map((item) => (
            <CirculationCard
              key={item.id}
              item={item}
              badgeVariant={column.badgeVariant}
              icon={column.icon}
              onSelect={onSelectCard}
            />
          ))
        ) : (
          <CirculationEmptyState
            isSearchEmpty={isFiltered}
            message={
              isFiltered
                ? `Tidak ada transaksi '${column.label}' yang cocok.`
                : `Tidak ada antrean ${column.label.toLowerCase()}.`
            }
          />
        )}
      </div>
    </div>
  );
}
