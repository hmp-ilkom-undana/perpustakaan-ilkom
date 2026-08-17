import { Clock, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PeminjamanTabProps {
  loanDurationDays: number;
  setLoanDurationDays: (days: number) => void;
  maxActiveSkripsi: number;
  setMaxActiveSkripsi: (val: number) => void;
  maxActiveRingkasan: number;
  setMaxActiveRingkasan: (val: number) => void;
  maxActiveNaskah: number;
  setMaxActiveNaskah: (val: number) => void;
}

export function PeminjamanTab({
  loanDurationDays,
  setLoanDurationDays,
  maxActiveSkripsi,
  setMaxActiveSkripsi,
  maxActiveRingkasan,
  setMaxActiveRingkasan,
  maxActiveNaskah,
  setMaxActiveNaskah,
}: PeminjamanTabProps) {
  return (
    <div className="space-y-6">
      {/* Masa Berlaku Peminjaman */}
      <Card className="border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Durasi Masa Peminjaman Standar
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Lama waktu mahasiswa diperbolehkan meminjam arsip sebelum terkena status terlambat (OVERDUE).
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">
              Durasi Peminjaman (Hari Kalender):
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={180}
                value={loanDurationDays}
                onChange={(e) =>
                  setLoanDurationDays(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="border-2 border-blue-900 font-black text-sm [box-shadow:2px_2px_0px_#1E3A8A] max-w-[120px]"
              />
              <span className="text-xs font-bold text-slate-600">Hari Kalender</span>
            </div>
            <div className="flex gap-2 pt-1">
              {[14, 30, 45, 60].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setLoanDurationDays(days)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded border-2 transition-all ${
                    loanDurationDays === days
                      ? "bg-orange-500 text-white border-blue-900 [box-shadow:2px_2px_0px_#1E3A8A]"
                      : "bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100 hover:border-blue-900"
                  }`}
                >
                  {days} Hari
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batas Maksimal Kuota Peminjaman Aktif */}
      <Card className="border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-500" />
              Batas Maksimal Kuota Pinjam Aktif (Per Mahasiswa)
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Jumlah maksimal dokumen yang dapat dipinjam secara bersamaan untuk setiap kategori arsip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Skripsi */}
            <div className="p-4 border-2 border-blue-900 rounded-lg bg-orange-50/50 [box-shadow:3px_3px_0px_#1E3A8A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-950">Skripsi</span>
                <Badge className="bg-orange-500 text-white border-2 border-blue-900 font-black text-[10px]">
                  SKR
                </Badge>
              </div>
              <Input
                type="number"
                min={0}
                max={10}
                value={maxActiveSkripsi}
                onChange={(e) =>
                  setMaxActiveSkripsi(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="border-2 border-blue-900 font-black text-base bg-white"
              />
              <p className="text-[10px] text-slate-500 font-semibold">Maksimal per mahasiswa</p>
            </div>

            {/* Ringkasan Skripsi */}
            <div className="p-4 border-2 border-blue-900 rounded-lg bg-amber-50/50 [box-shadow:3px_3px_0px_#1E3A8A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-950">Ringkasan Skripsi</span>
                <Badge className="bg-amber-400 text-blue-950 border-2 border-blue-900 font-black text-[10px]">
                  RKS
                </Badge>
              </div>
              <Input
                type="number"
                min={0}
                max={10}
                value={maxActiveRingkasan}
                onChange={(e) =>
                  setMaxActiveRingkasan(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="border-2 border-blue-900 font-black text-base bg-white"
              />
              <p className="text-[10px] text-slate-500 font-semibold">Maksimal per mahasiswa</p>
            </div>

            {/* Naskah Publikasi */}
            <div className="p-4 border-2 border-blue-900 rounded-lg bg-blue-50/50 [box-shadow:3px_3px_0px_#1E3A8A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-950">Naskah Publikasi</span>
                <Badge className="bg-blue-900 text-white border-2 border-blue-900 font-black text-[10px]">
                  NPB
                </Badge>
              </div>
              <Input
                type="number"
                min={0}
                max={10}
                value={maxActiveNaskah}
                onChange={(e) =>
                  setMaxActiveNaskah(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="border-2 border-blue-900 font-black text-base bg-white"
              />
              <p className="text-[10px] text-slate-500 font-semibold">Maksimal per mahasiswa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
