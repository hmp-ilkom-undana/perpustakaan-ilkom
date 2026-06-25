import { CheckCircle2, Clock3 } from "lucide-react";
import { formatStatusLabel, normalizeBookStatus } from "../utils/catalogFormatters.js";
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
  const normalized = normalizeBookStatus(status);
  const isAvailable = normalized === "tersedia";
  const Icon = isAvailable ? CheckCircle2 : Clock3;

  return (
    <Badge
      variant={isAvailable ? "default" : "secondary"}
      className={`gap-1.5 px-2.5 py-1 text-xs font-bold ${
        isAvailable
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {formatStatusLabel(normalized)}
    </Badge>
  );
}
