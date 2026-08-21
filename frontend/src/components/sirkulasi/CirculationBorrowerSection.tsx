import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CirculationBorrowerSectionProps {
  studentName: string;
  studentId: string;
}

export function CirculationBorrowerSection({
  studentName,
  studentId,
}: CirculationBorrowerSectionProps) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-950">
        <User className="w-4 h-4 text-orange-500" />
        <span>Informasi Peminjam</span>
      </div>

      <div className="bg-white border-2 border-blue-900 rounded-xl p-5 shadow-[3px_3px_0px_#1E3A8A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-heading font-black text-lg text-blue-950 leading-snug">
            {studentName}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Mahasiswa Ilmu Komputer
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">NIM:</span>
          <Badge variant="navy" className="font-mono text-xs px-2.5 py-0.5">
            {studentId}
          </Badge>
        </div>
      </div>
    </section>
  );
}
