import { BookOpen, Search, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DashboardQuota } from "@/hooks/useStudentDashboard";

interface BorrowingQuotaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quota: DashboardQuota;
}

export function BorrowingQuotaDialog({
  isOpen,
  onClose,
  quota,
}: BorrowingQuotaDialogProps) {
  const {
    terpakai,
    maksimal,
    isFull,
    countSkripsi,
    maxSkripsi,
    countRingkasan,
    maxRingkasan,
    countNaskah,
    maxNaskah,
  } = quota;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[480px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left pr-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-100 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex items-center justify-center text-orange-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-black text-blue-950">
              Kuota Peminjaman
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Alokasi batas maksimal peminjaman aktif arsip perpustakaan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 flex flex-col gap-4">
          {/* 1. Hero Stat Center */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-blue-900 rounded-xl shadow-[3px_3px_0px_#1E3A8A]">
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
            <p className="text-[11px] font-black text-blue-950 mt-2 uppercase tracking-wider">
              Total Arsip Sedang Dipinjam
            </p>
          </div>

          {/* 2. Progress Bar & Rincian per Kategori */}
          <div className="space-y-3 p-3.5 bg-white border-2 border-blue-900 rounded-lg shadow-[2px_2px_0px_#1E3A8A]">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Rincian Berdasarkan Kategori:
            </span>

            {/* Segmented Progress Bar */}
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

            {/* Grid Detail 3 Kategori */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-slate-50 border border-slate-200">
                <div className="w-3 h-3 bg-orange-500 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs mb-1" />
                <span className="text-[10px] text-slate-500 font-bold">Skripsi</span>
                <span className="text-xs font-black text-blue-950 font-mono">
                  {countSkripsi} / {maxSkripsi}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-slate-50 border border-slate-200">
                <div className="w-3 h-3 bg-sky-400 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs mb-1" />
                <span className="text-[10px] text-slate-500 font-bold">Ringkasan</span>
                <span className="text-xs font-black text-blue-950 font-mono">
                  {countRingkasan} / {maxRingkasan}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-slate-50 border border-slate-200">
                <div className="w-3 h-3 bg-blue-900 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A] rounded-xs mb-1" />
                <span className="text-[10px] text-slate-500 font-bold">Publikasi</span>
                <span className="text-xs font-black text-blue-950 font-mono">
                  {countNaskah} / {maxNaskah}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto font-bold"
          >
            Tutup
          </Button>

          {!isFull && (
            <Link to="/mahasiswa/katalog" onClick={onClose} className="w-full sm:w-auto">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="w-full sm:w-auto font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600"
              >
                Buka Katalog
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
