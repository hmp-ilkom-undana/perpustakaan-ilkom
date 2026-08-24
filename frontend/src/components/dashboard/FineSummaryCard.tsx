import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardFines } from "@/hooks/useStudentDashboard";

interface FineSummaryCardProps {
  denda: DashboardFines;
  className?: string;
}

export function FineSummaryCard({ denda, className }: FineSummaryCardProps) {
  const { totalDenda, hasFine, fineBorrowings, countLate, countDamaged, countLost } = denda;

  return (
    <Card
      className={cn(
        "bg-white flex flex-col justify-between overflow-hidden transition-all",
        hasFine
          ? "border-2 border-red-600 shadow-[4px_4px_0px_#DC2626]"
          : "border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A]",
        className,
      )}
    >
      {/* 1. Header Card */}
      <CardHeader
        className={cn(
          "p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b-2 flex flex-row items-center justify-between gap-2 shrink-0 transition-colors",
          hasFine
            ? "border-red-600 bg-red-50/80"
            : "border-blue-900 bg-slate-50",
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border",
              hasFine
                ? "bg-red-100 border-red-600 text-red-600 shadow-[1px_1px_0px_#DC2626]"
                : "bg-emerald-100 border-blue-900 text-emerald-700 shadow-[1px_1px_0px_#1E3A8A]",
            )}
          >
            {hasFine ? (
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <CardTitle
              className={cn(
                "text-xs sm:text-sm font-black uppercase tracking-wider leading-tight truncate",
                hasFine ? "text-red-950" : "text-blue-950",
              )}
            >
              Tunggakan Denda
            </CardTitle>
            <span
              className={cn(
                "text-[10px] sm:text-[11px] font-bold mt-0.5 truncate",
                hasFine ? "text-red-700" : "text-emerald-700",
              )}
            >
              {hasFine ? `${fineBorrowings.length} Arsip Menunggak` : "Status Bersih & Bebas Denda"}
            </span>
          </div>
        </div>

        <Badge
          variant={hasFine ? "rose" : "emerald"}
          className="shrink-0 text-[9px] sm:text-[10px] font-black h-6 px-2"
        >
          {hasFine ? `Total: Rp ${totalDenda.toLocaleString("id-ID")}` : "Bebas Denda"}
        </Badge>
      </CardHeader>

      {/* 2. Konten Utama */}
      <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
        {!hasFine ? (
          <div className="py-3 sm:py-6 px-3 flex flex-col items-center justify-center text-center my-auto">
            <div className="bg-emerald-50 border border-emerald-300 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-black text-xs sm:text-sm text-blue-950">
              Tidak Ada Tunggakan Denda
            </h3>
            <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium mt-0.5 max-w-xs leading-relaxed">
              Akun Anda bersih dan tidak memiliki tanggungan denda keterlambatan atau kerusakan arsip perpustakaan.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-2.5 flex-1">
            {/* Kategori Denda Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {countLate > 0 && (
                <span className="inline-flex items-center bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                  {countLate} Keterlambatan
                </span>
              )}
              {countDamaged > 0 && (
                <span className="inline-flex items-center bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                  {countDamaged} Kerusakan
                </span>
              )}
              {countLost > 0 && (
                <span className="inline-flex items-center bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                  {countLost} Hilang
                </span>
              )}
            </div>

            {/* List Denda Scrollable */}
            <div className="space-y-2 max-h-[145px] sm:max-h-[170px] overflow-y-auto pr-1">
              {fineBorrowings.map((fb: any) => {
                const isOverdue = fb.status === "OVERDUE";
                const isDamaged = fb.status === "DAMAGED";
                const isLost = fb.status === "LOST";

                return (
                  <div
                    key={fb.id}
                    className="p-2 sm:p-2.5 bg-red-50/60 border border-red-200 rounded-lg space-y-1 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border",
                          isOverdue
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : isDamaged
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : isLost
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-red-100 text-red-800 border-red-300",
                        )}
                      >
                        {isOverdue ? "Terlambat" : isDamaged ? "Rusak" : isLost ? "Hilang" : "Denda"}
                      </span>

                      <span className="text-[11px] sm:text-xs font-black text-red-600 font-mono">
                        Rp {(fb.fineAmount || 0).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <h4 className="text-[11px] sm:text-xs font-bold text-blue-950 truncate">
                      {fb.archive?.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Footer Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
            {hasFine ? "Pelunasan di ruang hmp" : "Riwayat sirkulasi aktif"}
          </span>
          <Link to="/mahasiswa/peminjaman" className="shrink-0">
            <Button variant="outline" size="sm" className="text-[10px] sm:text-xs font-bold h-7 sm:h-8 px-2.5 sm:px-3">
              Buka Detail Peminjaman
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
