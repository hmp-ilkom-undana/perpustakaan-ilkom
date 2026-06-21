import { CheckCircle2, Clock3 } from "lucide-react";
import { formatStatusLabel, normalizeBookStatus } from "../utils/catalogFormatters.js";

export default function StatusBadge({ status }) {
  const normalized = normalizeBookStatus(status);
  const isAvailable = normalized === "tersedia";
  const Icon = isAvailable ? CheckCircle2 : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
        isAvailable
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {formatStatusLabel(normalized)}
    </span>
  );
}
