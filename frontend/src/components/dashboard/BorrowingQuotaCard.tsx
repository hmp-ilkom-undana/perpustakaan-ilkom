import { BookOpen, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DashboardQuota } from "@/hooks/useStudentDashboard";

interface BorrowingQuotaCardProps {
  quota: DashboardQuota;
  className?: string;
}

export function BorrowingQuotaCard({ quota, className }: BorrowingQuotaCardProps) {
  const {
    terpakai,
    maksimal,
    sisa,
    isFull,
    countSkripsi,
    maxSkripsi,
    countRingkasan,
    maxRingkasan,
    countNaskah,
    maxNaskah,
  } = quota;

  return (
    <Card
      className={cn(
        "bg-white border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between overflow-hidden transition-all",
        className,
      )}
    >
      {/* 1. Header Card */}
      <CardHeader className="p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b-2 border-blue-900 bg-slate-50 flex flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border border-blue-900 bg-orange-100 text-orange-600 shadow-[1px_1px_0px_#1E3A8A]">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight text-blue-950 truncate">
              Kuota Peminjaman
            </CardTitle>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5 truncate">
              Slot Peminjaman Arsip
            </span>
          </div>
        </div>

        <Badge
          variant={isFull ? "rose" : sisa <= 1 ? "amber" : "emerald"}
          className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0"
        >
          {isFull ? "Kuota Penuh" : `${sisa} Slot Tersedia`}
        </Badge>
      </CardHeader>

      {/* 2. Konten Utama: Hero Stat di Tengah */}
      <CardContent className="p-3.5 sm:p-5 flex flex-col justify-between flex-grow space-y-3 sm:space-y-4">
        {/* Angka Hero Stat Center-Aligned */}
        <div className="flex flex-col items-center justify-center py-2 text-center my-auto">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-5xl sm:text-6xl font-black text-orange-500 tracking-tight leading-none">
              {terpakai}
            </span>
            <span className="text-2xl sm:text-3xl text-slate-300 font-bold leading-none select-none">
              /
            </span>
            <span className="text-3xl sm:text-4xl text-slate-400 font-extrabold leading-none">
              {maksimal}
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-wider">
            Arsip Sedang Dipinjam
          </p>
        </div>

        {/* Informasi Bantuan Status */}
        <div
          className={cn(
            "border rounded-lg p-2.5 flex items-center justify-center text-center text-xs transition-colors",
            isFull
              ? "bg-rose-50/70 border-rose-200 text-rose-800"
              : "bg-slate-50 border-blue-900/20 text-slate-600",
          )}
        >
          <div className="flex items-center gap-2 font-semibold text-left sm:text-center">
            {isFull ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="text-[11px] leading-tight">
              {isFull
                ? "Batas kuota tercapai. Kembalikan arsip untuk mengajukan yang baru."
                : `Anda masih dapat mengajukan ${sisa} arsip lagi.`}
            </span>
          </div>
        </div>

        {/* Segmented Progress Bar & Legend Rincian Dokumen */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex h-3 w-full gap-1 bg-slate-100 rounded-md p-0.5 border border-blue-900/30 overflow-hidden">
            {countSkripsi > 0 && (
              <div
                className="bg-orange-500 h-full rounded-xs transition-all duration-500"
                style={{ width: `${(countSkripsi / maksimal) * 100}%` }}
                title={`Skripsi: ${countSkripsi}/${maxSkripsi}`}
              />
            )}
            {countRingkasan > 0 && (
              <div
                className="bg-sky-400 h-full rounded-xs transition-all duration-500"
                style={{ width: `${(countRingkasan / maksimal) * 100}%` }}
                title={`Ringkasan: ${countRingkasan}/${maxRingkasan}`}
              />
            )}
            {countNaskah > 0 && (
              <div
                className="bg-blue-900 h-full rounded-xs transition-all duration-500"
                style={{ width: `${(countNaskah / maksimal) * 100}%` }}
                title={`Publikasi: ${countNaskah}/${maxNaskah}`}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 text-[10px] sm:text-[11px] font-semibold w-full text-center">
            <div className="flex items-center justify-center gap-1.5 p-1 rounded bg-slate-50 border border-slate-200">
              <div className="w-2.5 h-2.5 bg-orange-500 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700 truncate">
                Skripsi <b className="text-blue-950 font-black">{countSkripsi}/{maxSkripsi}</b>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-1 rounded bg-slate-50 border border-slate-200">
              <div className="w-2.5 h-2.5 bg-sky-400 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700 truncate">
                Ringkasan <b className="text-blue-950 font-black">{countRingkasan}/{maxRingkasan}</b>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-1 rounded bg-slate-50 border border-slate-200">
              <div className="w-2.5 h-2.5 bg-blue-900 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700 truncate">
                Publikasi <b className="text-blue-950 font-black">{countNaskah}/{maxNaskah}</b>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
