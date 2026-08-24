import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
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
          "p-4 sm:p-5 pb-3 border-b-2 flex flex-row items-center justify-between gap-2 shrink-0 transition-colors",
          hasFine
            ? "border-red-600 bg-red-50/80"
            : "border-blue-900 bg-slate-50",
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
              hasFine
                ? "bg-red-100 border-red-600 text-red-600 shadow-[1px_1px_0px_#DC2626]"
                : "bg-emerald-100 border-blue-900 text-emerald-700 shadow-[1px_1px_0px_#1E3A8A]",
            )}
          >
            {hasFine ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
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
                "text-[11px] font-bold mt-0.5 truncate",
                hasFine ? "text-red-700" : "text-emerald-700",
              )}
            >
              {hasFine ? `${fineBorrowings.length} Arsip Menunggak` : "Status Bersih & Bebas Denda"}
            </span>
          </div>
        </div>

        <Badge variant={hasFine ? "rose" : "emerald"} className="shrink-0 text-[10px] font-black">
          {hasFine ? `Total: Rp ${totalDenda.toLocaleString("id-ID")}` : "Bebas Denda"}
        </Badge>
      </CardHeader>

      {/* 2. Konten Utama */}
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
        {!hasFine ? (
          <div className="py-6 px-4 flex flex-col items-center justify-center text-center my-auto">
            <div className="bg-emerald-50 border border-emerald-300 w-11 h-11 rounded-full flex items-center justify-center mb-2.5 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xs sm:text-sm text-blue-950">
              Tidak Ada Tunggakan Denda
            </h3>
            <p className="text-slate-500 text-[11px] font-medium mt-1 max-w-xs leading-relaxed">
              Akun Anda bersih dan tidak memiliki tanggungan denda keterlambatan atau kerusakan arsip perpustakaan.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 my-auto">
            {/* Kategori Denda Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {countLate > 0 && (
                <Badge variant="rose" className="text-[9px] px-2 py-0.5">
                  {countLate} Keterlambatan
                </Badge>
              )}
              {countDamaged > 0 && (
                <Badge variant="amber" className="text-[9px] px-2 py-0.5">
                  {countDamaged} Kerusakan Fisik
                </Badge>
              )}
              {countLost > 0 && (
                <Badge variant="rose" className="text-[9px] px-2 py-0.5">
                  {countLost} Arsip Hilang
                </Badge>
              )}
            </div>

            {/* List Denda Scrollable */}
            <div className="space-y-2 max-h-[135px] overflow-y-auto pr-1">
              {fineBorrowings.map((fb: any) => {
                const isOverdue = fb.status === "OVERDUE";
                const isDamaged = fb.status === "DAMAGED";
                const isLost = fb.status === "LOST";

                return (
                  <div
                    key={fb.id}
                    className="flex items-center justify-between p-2.5 bg-red-50/60 border border-red-200 rounded-lg gap-3 hover:bg-red-50 transition-colors"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={isOverdue || isLost ? "rose" : "amber"}
                          className="text-[9px] px-1.5 py-0 font-bold"
                        >
                          {isOverdue
                            ? "TERLAMBAT"
                            : isDamaged
                            ? "RUSAK"
                            : isLost
                            ? "HILANG"
                            : "DENDA"}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-black text-blue-950 truncate">
                        {fb.archive?.title}
                      </h4>
                    </div>

                    <span className="text-xs font-black text-red-600 shrink-0 font-mono">
                      Rp {(fb.fineAmount || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Footer Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-400">
            {hasFine ? "Pelunasan via meja sirkulasi / transfer" : "Riwayat sirkulasi aktif"}
          </span>
          <Link to="/mahasiswa/peminjaman">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              Buka Detail Peminjaman
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
