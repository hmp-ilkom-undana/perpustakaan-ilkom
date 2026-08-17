import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
}

export function BorrowingQuotaCard({ quota }: BorrowingQuotaCardProps) {
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

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <p className="text-xs font-black text-blue-950 uppercase tracking-wider">
              Kuota Peminjaman Aktif
            </p>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-orange-500 leading-none mb-1">
            {terpakai}{" "}
            <span className="text-xl sm:text-2xl text-slate-400 font-bold">
              / {maksimal}
            </span>
          </div>
        </div>

        <div className="space-y-3">
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

          <div className="flex flex-row justify-between items-center text-[10px] lg:text-[11px] font-semibold w-full gap-1 pt-1">
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
