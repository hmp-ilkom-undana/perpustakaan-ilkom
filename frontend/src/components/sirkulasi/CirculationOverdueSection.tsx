import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CirculationOverdueSectionProps {
  dueDate?: string;
  fine?: number;
}

export function CirculationOverdueSection({
  dueDate,
  fine = 0,
}: CirculationOverdueSectionProps) {
  const formattedDueDate = (() => {
    if (!dueDate || dueDate === "-") return "-";
    try {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) return dueDate;
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dueDate;
    }
  })();

  return (
    <section className="space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700">
        <AlertCircle className="w-4 h-4 text-rose-600" />
        <span>Keterlambatan Pengembalian</span>
      </div>

      <div className="bg-rose-50 border-2 border-rose-600 rounded-xl p-5 shadow-[3px_3px_0px_#E11D48] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="destructive" className="mb-2">
            Status Terlambat
          </Badge>
          <p className="text-xs font-semibold text-rose-800">
            Jatuh tempo pengembalian: <span className="font-black">{formattedDueDate}</span>
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">
            Total Denda
          </p>
          <p className="text-xl sm:text-2xl font-heading font-black text-rose-700">
            Rp {fine.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </section>
  );
}
