import { BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface QuotaData {
  terpakai: number;
  maksimal: number;
  countSkripsi: number;
  maxSkripsi: number;
  countRingkasan: number;
  maxRingkasan: number;
  countNaskah: number;
  maxNaskah: number;
}

interface BorrowingQuotaCardProps {
  quota: QuotaData;
  className?: string;
}

export function BorrowingQuotaCard({ quota, className }: BorrowingQuotaCardProps) {
  const {
    terpakai,
    maksimal,
    countSkripsi,
    maxSkripsi,
    countRingkasan,
    maxRingkasan,
    countNaskah,
    maxNaskah,
  } = quota;

  const sisa = Math.max(0, maksimal - terpakai);
  const isFull = terpakai >= maksimal;

  return (
    <Card
      className={cn(
        "bg-white border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between overflow-hidden",
        className
      )}
    >
      {/* 1. Header Card yang Selaras dengan Kartu Denda */}
      <CardHeader className="p-4 sm:p-5 pb-3 border-b-2 border-blue-900 bg-slate-50 flex flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-900 bg-orange-100 text-orange-600 shadow-[1px_1px_0px_#1E3A8A]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight text-blue-950">
              Kuota Peminjaman Aktif
            </CardTitle>
            <span className="text-[11px] font-bold text-slate-500 mt-0.5">
              Slot Peminjaman Arsip
            </span>
          </div>
        </div>

        <Badge
          variant={isFull ? "rose" : sisa <= 1 ? "amber" : "emerald"}
          className="text-[10px] font-black uppercase tracking-wider shrink-0"
        >
          {isFull ? "Kuota Penuh" : `${sisa} Slot Tersedia`}
        </Badge>
      </CardHeader>

      {/* 2. Konten Utama: Angka Kuota Besar di Tengah */}
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-4">
        {/* Angka Hero Stat Center-Aligned */}
        <div className="flex flex-col items-center justify-center py-2 text-center my-auto">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-5xl sm:text-6xl font-black text-orange-500 tracking-tight leading-none">
              {terpakai}
            </span>
            <span className="text-2xl sm:text-3xl text-slate-300 font-bold leading-none">
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

        {/* Informasi Status Peminjaman */}
        <div className="bg-slate-50 border border-blue-900/20 rounded-md p-2.5 flex items-center justify-center text-center text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            {isFull ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="text-[11px] leading-tight">
              {isFull
                ? "Kembalikan arsip untuk membuka kuota peminjaman baru."
                : `Anda masih dapat mengajukan ${sisa} arsip lagi.`}
            </span>
          </div>
        </div>

        {/* Progress Bar & Rincian per Jenis Dokumen */}
        <div className="space-y-2.5 pt-1 border-t border-slate-100">
          <div className="flex h-3 w-full gap-1 bg-slate-100 rounded-md p-0.5 border border-blue-900/30 overflow-hidden">
            {countSkripsi > 0 && (
              <div
                className="bg-orange-500 h-full rounded-sm transition-all duration-500"
                style={{ width: `${(countSkripsi / maksimal) * 100}%` }}
              />
            )}
            {countRingkasan > 0 && (
              <div
                className="bg-sky-400 h-full rounded-sm transition-all duration-500"
                style={{ width: `${(countRingkasan / maksimal) * 100}%` }}
              />
            )}
            {countNaskah > 0 && (
              <div
                className="bg-blue-900 h-full rounded-sm transition-all duration-500"
                style={{ width: `${(countNaskah / maksimal) * 100}%` }}
              />
            )}
          </div>

          <div className="flex flex-row justify-between items-center text-[10px] lg:text-[11px] font-semibold w-full gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-orange-500 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700">
                Skripsi{" "}
                <b className="text-blue-950 font-black">
                  {countSkripsi}/{maxSkripsi}
                </b>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-sky-400 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700">
                Ringkasan{" "}
                <b className="text-blue-950 font-black">
                  {countRingkasan}/{maxRingkasan}
                </b>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-900 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700">
                Publikasi{" "}
                <b className="text-blue-950 font-black">
                  {countNaskah}/{maxNaskah}
                </b>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
