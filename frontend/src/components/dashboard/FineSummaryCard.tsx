import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardFines, DashboardFineItem } from "@/hooks/useStudentDashboard";

interface FineSummaryCardProps {
  denda: DashboardFines;
  className?: string;
}

export function FineSummaryCard({ denda, className }: FineSummaryCardProps) {
  const {
    totalDenda,
    hasFine,
    fineBorrowings,
    lateBorrowings,
    damageLossBorrowings,
    totalLateFine,
    totalDamageLossFine,
    countLate,
    countDamaged,
    countLost,
  } = denda;

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
      {/* 1. Header Card Utama */}
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
              {hasFine
                ? `${fineBorrowings.length} Arsip Memiliki Tagihan`
                : "Status Bersih & Bebas Denda"}
            </span>
          </div>
        </div>

        <Badge
          variant={hasFine ? "rose" : "emerald"}
          className="shrink-0 text-[10px] sm:text-xs font-black font-mono h-6 sm:h-7 px-2.5 shadow-[1px_1px_0px_#1E3A8A]"
        >
          {hasFine
            ? `TOTAL: Rp ${totalDenda.toLocaleString("id-ID")}`
            : "BEBAS DENDA"}
        </Badge>
      </CardHeader>

      {/* 2. Konten Utama: 2 Kompartemen Mandiri */}
      <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between flex-grow space-y-4">
        {!hasFine ? (
          <div className="py-4 sm:py-7 px-3 flex flex-col items-center justify-center text-center my-auto">
            <div className="bg-emerald-50 border border-emerald-300 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2.5 text-emerald-600 shadow-[2px_2px_0px_#059669]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xs sm:text-sm text-blue-950">
              Tidak Ada Tunggakan Denda
            </h3>
            <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium mt-0.5 max-w-xs leading-relaxed">
              Akun Anda bersih dan tidak memiliki tanggungan denda keterlambatan atau ganti rugi arsip.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* KOMPARTEMEN 1: Tunggakan Keterlambatan */}
            <div className="p-3.5 bg-rose-50/70 border-2 border-rose-200 rounded-xl flex flex-col justify-between gap-2 shadow-[2px_2px_0px_#F43F5E]">
              <div className="space-y-2.5">
                {/* Header Kompartemen 1 */}
                <div className="flex items-center justify-between gap-2 border-b border-rose-200 pb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-xs font-black text-rose-950 uppercase tracking-wider truncate">
                      Keterlambatan ({countLate})
                    </span>
                  </div>
                  <span className="text-xs font-black font-mono text-rose-700 shrink-0">
                    Rp {totalLateFine.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* List Item Keterlambatan */}
                {lateBorrowings.length > 0 ? (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {lateBorrowings.map((item: DashboardFineItem) => (
                      <Link
                        key={item.id}
                        to="/mahasiswa/peminjaman"
                        search={{ selectedId: item.id, filter: "UNPAID_FINE" }}
                        className="p-2.5 bg-white border-2 border-rose-100 rounded-lg flex items-center justify-between gap-3 hover:border-rose-400 hover:shadow-[2px_2px_0px_#E11D48] transition-all group cursor-pointer"
                        title="Klik untuk membuka rincian transaksi"
                      >
                        <div className="min-w-0 flex-1 flex flex-col gap-1">
                          <h5 className="text-xs font-black text-blue-950 truncate group-hover:text-rose-600 transition-colors">
                            {item.archive?.title}
                          </h5>
                          <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded w-fit border border-slate-200">
                            {item.pickupCode || `PK-${item.id.substring(0, 4).toUpperCase()}`}
                          </span>
                        </div>
                        <span className="text-xs font-black font-mono text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded shadow-[1px_1px_0px_#E11D48] shrink-0">
                          Rp {(item.fineAmount || 0).toLocaleString("id-ID")}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic py-2 text-center">
                    Tidak ada tunggakan keterlambatan.
                  </p>
                )}
              </div>
            </div>

            {/* KOMPARTEMEN 2: Kerusakan atau Hilang */}
            <div className="p-3.5 bg-amber-50/70 border-2 border-amber-200 rounded-xl flex flex-col justify-between gap-2 shadow-[2px_2px_0px_#F59E0B]">
              <div className="space-y-2.5">
                {/* Header Kompartemen 2 */}
                <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-xs font-black text-amber-950 uppercase tracking-wider truncate">
                      Kerusakan atau Hilang ({countDamaged + countLost})
                    </span>
                  </div>
                  <span className="text-xs font-black font-mono text-amber-800 shrink-0">
                    Rp {totalDamageLossFine.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* List Item Kerusakan atau Hilang */}
                {damageLossBorrowings.length > 0 ? (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {damageLossBorrowings.map((item: DashboardFineItem) => (
                      <Link
                        key={item.id}
                        to="/mahasiswa/peminjaman"
                        search={{ selectedId: item.id, filter: "UNPAID_FINE" }}
                        className="p-2.5 bg-white border-2 border-amber-100 rounded-lg flex items-center justify-between gap-3 hover:border-amber-400 hover:shadow-[2px_2px_0px_#D97706] transition-all group cursor-pointer"
                        title="Klik untuk membuka rincian transaksi"
                      >
                        <div className="min-w-0 flex-1 flex flex-col gap-1">
                          <h5 className="text-xs font-black text-blue-950 truncate group-hover:text-amber-700 transition-colors">
                            {item.archive?.title}
                          </h5>
                          <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded w-fit border border-slate-200">
                            {item.pickupCode || `PK-${item.id.substring(0, 4).toUpperCase()}`}
                          </span>
                        </div>
                        <span className="text-xs font-black font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded shadow-[1px_1px_0px_#D97706] shrink-0">
                          Rp {(item.fineAmount || 0).toLocaleString("id-ID")}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic py-2 text-center">
                    Tidak ada denda kerusakan atau kehilangan.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
