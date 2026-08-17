import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const DAYS_OF_WEEK = [
  { id: 1, name: "Senin", short: "Sen" },
  { id: 2, name: "Selasa", short: "Sel" },
  { id: 3, name: "Rabu", short: "Rab" },
  { id: 4, name: "Kamis", short: "Kam" },
  { id: 5, name: "Jumat", short: "Jum" },
  { id: 6, name: "Sabtu", short: "Sab" },
  { id: 0, name: "Minggu", short: "Min" },
];

interface OperasionalTabProps {
  operatingDays: number[];
  setOperatingDays: (days: number[]) => void;
  pickupDurationDays: number;
  setPickupDurationDays: (days: number) => void;
  autoCancelUnpicked: boolean;
  setAutoCancelUnpicked: (enabled: boolean) => void;
}

export function OperasionalTab({
  operatingDays,
  setOperatingDays,
  pickupDurationDays,
  setPickupDurationDays,
  autoCancelUnpicked,
  setAutoCancelUnpicked,
}: OperasionalTabProps) {
  const toggleDay = (dayId: number) => {
    if (operatingDays.includes(dayId)) {
      if (operatingDays.length === 1) {
        toast.warning("Minimal harus ada satu hari operasional aktif.");
        return;
      }
      setOperatingDays(operatingDays.filter((d) => d !== dayId));
    } else {
      setOperatingDays([...operatingDays, dayId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hari Kerja Operasional */}
      <Card className="border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Hari Kerja Operasional Perpustakaan
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Hanya hari yang aktif yang akan dihitung sebagai masa tunggu penjemputan dan akumulasi denda keterlambatan.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] font-bold border-2 border-blue-900 h-7 hover:bg-orange-500 hover:text-white transition-colors"
                onClick={() => setOperatingDays([1, 2, 3, 4, 5])}
              >
                Sen - Jum
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] font-bold border-2 border-blue-900 h-7 hover:bg-orange-500 hover:text-white transition-colors"
                onClick={() => setOperatingDays([1, 2, 3, 4, 5, 6])}
              >
                Sen - Sab
              </Button>
            </div>
          </div>

          {/* Day Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = operatingDays.includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`p-3 rounded-lg border-2 font-bold text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-orange-500 text-white border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A]"
                      : "bg-slate-50 text-slate-500 border-slate-300 hover:border-blue-900"
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider">{day.short}</span>
                  <span className="text-[11px] font-semibold">{day.name}</span>
                  <span className="text-[10px] mt-1">
                    {isSelected ? "Aktif" : "Libur"}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Batas Waktu Pengambilan Arsip */}
      <Card className="border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Masa Tunggu Pengambilan Arsip (Grace Period)
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Tenggat waktu bagi mahasiswa untuk mengambil berkas fisik setelah disetujui (status WAITING_PICKUP).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                Batas Waktu Pengambilan (Hari Kerja):
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={pickupDurationDays}
                  onChange={(e) =>
                    setPickupDurationDays(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="border-2 border-blue-900 font-black text-sm [box-shadow:2px_2px_0px_#1E3A8A] max-w-[120px]"
                />
                <span className="text-xs font-bold text-slate-600">Hari Kerja Operasional</span>
              </div>
              <div className="flex gap-2 pt-1">
                {[2, 3, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPickupDurationDays(num)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded border-2 transition-all ${
                      pickupDurationDays === num
                        ? "bg-orange-500 text-white border-blue-900 [box-shadow:2px_2px_0px_#1E3A8A]"
                        : "bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100 hover:border-blue-900"
                    }`}
                  >
                    {num} Hari
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Cancel Switch Card */}
            <div className="border-2 border-blue-900/40 rounded-lg p-4 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-slate-800">
                  Pembatalan Otomatis (Auto-Cancel)
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Batalkan antrean otomatis dan kembalikan kuota arsip jika lewat batas hari kerja.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoCancelUnpicked(!autoCancelUnpicked)}
                className={`w-12 h-6 rounded-full transition-colors relative border-2 border-blue-950 ${
                  autoCancelUnpicked ? "bg-orange-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white block transition-transform shadow-sm ${
                    autoCancelUnpicked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
