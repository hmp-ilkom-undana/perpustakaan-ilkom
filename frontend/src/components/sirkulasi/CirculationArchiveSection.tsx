import { BookOpen, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CirculationArchiveSectionProps {
  archiveTitle: string;
  archiveType: string;
  requestDate: string;
}

export function CirculationArchiveSection({
  archiveTitle,
  archiveType,
  requestDate,
}: CirculationArchiveSectionProps) {
  const formattedDate = (() => {
    try {
      const d = new Date(requestDate);
      if (isNaN(d.getTime())) return requestDate;
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return requestDate;
    }
  })();

  return (
    <section className="space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-950">
        <BookOpen className="w-4 h-4 text-orange-500" />
        <span>Arsip Fisik</span>
      </div>

      <div className="bg-white border-2 border-blue-900 rounded-xl p-5 shadow-[3px_3px_0px_#1E3A8A] space-y-3">
        <div>
          <p className="font-heading font-black text-base md:text-lg text-blue-950 leading-snug">
            {archiveTitle}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Jenis:</span>
            <Badge variant="amber" className="text-[11px] font-black">
              {archiveType}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Diajukan: {formattedDate}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
