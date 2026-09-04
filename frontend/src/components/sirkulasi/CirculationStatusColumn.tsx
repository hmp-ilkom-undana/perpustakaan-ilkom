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
      className={`w-full md:flex-1 md:min-w-0 flex flex-col h-full ${
        isActiveOnMobile ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded bg-white border-2 border-blue-900 flex items-center justify-center text-blue-950 shadow-[1px_1px_0px_#1E3A8A] shrink-0">
            <Icon className="w-3 h-3" />
          </div>
          <h2 className="font-heading font-black text-xs lg:text-sm text-blue-950 uppercase tracking-wider truncate">
            {column.label}
          </h2>
        </div>

        <Badge variant={column.badgeVariant} className="font-mono text-[10px] px-1.5 py-0 shrink-0">
          {column.items.length}
        </Badge>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 px-0.5 pb-4 no-scrollbar">
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
