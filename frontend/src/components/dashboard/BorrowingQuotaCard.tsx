import { BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* 1. Header Kuota & Badge Status Sisa */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-orange-500" />
              <p className="text-xs font-black text-blue-950 uppercase tracking-wider">
                Kuota Peminjaman Aktif
              </p>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-orange-500 leading-none">
              {terpakai}{" "}
              <span className="text-xl sm:text-2xl text-slate-400 font-bold">
                / {maksimal}
              </span>
            </div>
          </div>

          <Badge
            variant={isFull ? "rose" : sisa <= 1 ? "amber" : "emerald"}
            className="text-[10px] font-black uppercase tracking-wider shrink-0"
          >
            {isFull ? "Kuota Penuh" : `${sisa} Slot Tersedia`}
          </Badge>
        </div>

        {/* 2. Informasi Bermanfaat Status Peminjaman */}
        <div className="bg-slate-50 border border-blue-900/20 rounded-md p-2.5 flex items-center justify-between text-xs">
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

        {/* 3. Progress Bar & Rincian per Jenis Dokumen */}
        <div className="space-y-2.5">
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
                Skripsi <b className="text-blue-950 font-black">{countSkripsi}/{maxSkripsi}</b>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-sky-400 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700">
                Ringkasan <b className="text-blue-950 font-black">{countRingkasan}/{maxRingkasan}</b>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-900 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs shrink-0" />
              <span className="text-slate-700">
                Publikasi <b className="text-blue-950 font-black">{countNaskah}/{maxNaskah}</b>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
