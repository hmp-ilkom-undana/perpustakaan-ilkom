import { LucideIcon, User } from "lucide-react";
import type { CirculationItem } from "@/services/borrowing.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CirculationCardProps {
  item: CirculationItem;
  badgeVariant: "sky" | "orange" | "emerald" | "rose";
  icon: LucideIcon;
  onSelect: (id: string) => void;
}

export function CirculationCard({
  item,
  badgeVariant,
  icon: Icon,
  onSelect,
}: CirculationCardProps) {
  const shortCode = item.pickupCode || `PK-${item.id.substring(0, 6).toUpperCase()}`;

  return (
    <Card
      variant="interactive"
      onClick={() => onSelect(item.id)}
      className="p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* Header Row: Code & Status Icon */}
      <div className="flex items-center justify-between gap-2">
        <Badge variant={badgeVariant} className="font-mono font-black text-[11px] tracking-wider">
          {shortCode}
        </Badge>
        <div className="w-7 h-7 rounded-md border border-blue-900/20 bg-slate-50 flex items-center justify-center text-blue-900 group-hover/card:bg-orange-500 group-hover/card:text-white group-hover/card:border-orange-600 transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Archive Info */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-heading font-black text-sm text-blue-950 line-clamp-2 leading-snug group-hover/card:text-orange-600 transition-colors">
          {item.archiveTitle}
        </h3>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {item.archiveType}
        </span>
      </div>

      {/* Student / Borrower Info Footer */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 truncate">
            {item.studentName}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-blue-950 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
          {item.studentId}
        </span>
      </div>
    </Card>
  );
}
