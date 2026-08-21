import { ShieldCheck, UserCheck, Handshake } from "lucide-react";

interface CirculationAuditSectionProps {
  approvedBy?: string;
  handoverBy?: string;
}

export function CirculationAuditSection({
  approvedBy,
  handoverBy,
}: CirculationAuditSectionProps) {
  if (!approvedBy && !handoverBy) return null;

  return (
    <section className="space-y-2.5">
      <div className="bg-white border-2 border-blue-900 rounded-xl p-5 shadow-[3px_3px_0px_#1E3A8A] space-y-3">
        {approvedBy && (
          <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
            <div className="w-6 h-6 rounded bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span>
              Disetujui / Di-ACC oleh:{" "}
              <strong className="text-blue-950 font-bold">{approvedBy}</strong>
            </span>
          </div>
        )}

        {handoverBy && (
          <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
            <div className="w-6 h-6 rounded bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 shrink-0">
              <Handshake className="w-3.5 h-3.5" />
            </div>
            <span>
              Diserahkan oleh:{" "}
              <strong className="text-blue-950 font-bold">{handoverBy}</strong>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
