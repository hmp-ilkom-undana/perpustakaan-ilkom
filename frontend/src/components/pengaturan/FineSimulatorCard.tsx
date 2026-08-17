import { useState, useMemo } from "react";
import { Calculator, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface FineSimulatorCardProps {
  lateBaseFine: number;
  lateThresholdDays: number;
  lateDailyFine: number;
  damagedFine: number;
  lostFine: number;
}

export function FineSimulatorCard({
  lateBaseFine,
  lateThresholdDays,
  lateDailyFine,
  damagedFine,
  lostFine,
}: FineSimulatorCardProps) {
  const [simLateDays, setSimLateDays] = useState<number>(10);
  const [simKondisi, setSimKondisi] = useState<"BAIK" | "RUSAK" | "HILANG">("BAIK");

  const simulationResult = useMemo(() => {
    let lateFine = 0;
    if (simLateDays >= 1) {
      lateFine = lateBaseFine;
      if (simLateDays > lateThresholdDays) {
        lateFine += (simLateDays - lateThresholdDays) * lateDailyFine;
      }
    }

    let physicalFine = 0;
    if (simKondisi === "RUSAK") physicalFine = damagedFine;
    if (simKondisi === "HILANG") physicalFine = lostFine;

    return {
      lateFine,
      physicalFine,
      total: lateFine + physicalFine,
    };
  }, [
    simLateDays,
    simKondisi,
    lateBaseFine,
    lateThresholdDays,
    lateDailyFine,
    damagedFine,
    lostFine,
  ]);

  return (
    <Card className="border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] bg-gradient-to-b from-blue-900 to-slate-900 text-white sticky top-6">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-blue-800 pb-3">
          <Calculator className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="font-black text-sm text-white">Simulasi Denda</h3>
            <p className="text-[10px] text-blue-200">Uji langsung kalkulasi aturan di samping</p>
          </div>
        </div>

        {/* Input Simulasi Keterlambatan */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-blue-200">Keterlambatan Hari Kerja:</span>
            <span className="text-orange-400 font-black">{simLateDays} Hari</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={simLateDays}
            onChange={(e) => setSimLateDays(parseInt(e.target.value) || 0)}
            className="w-full accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-blue-300">
            <span>0 Hari</span>
            <span>15 Hari</span>
            <span>30 Hari</span>
          </div>
        </div>

        {/* Input Simulasi Kondisi Fisik */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-blue-200">Kondisi Pengembalian:</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["BAIK", "RUSAK", "HILANG"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSimKondisi(k)}
                className={`py-1.5 text-[10px] font-bold rounded border transition-all ${
                  simKondisi === k
                    ? "bg-orange-500 text-white border-2 border-blue-900 [box-shadow:2px_2px_0px_#1E3A8A]"
                    : "bg-blue-950/60 text-blue-200 border border-blue-800 hover:bg-blue-800"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Rincian Kalkulasi */}
        <div className="bg-blue-950/80 rounded-lg p-3.5 border border-blue-800 space-y-2 text-xs">
          <div className="flex justify-between text-blue-200">
            <span>Denda Keterlambatan:</span>
            <span className="font-bold text-white">
              Rp {simulationResult.lateFine.toLocaleString("id-ID")}
            </span>
          </div>
          {simKondisi !== "BAIK" && (
            <div className="flex justify-between text-blue-200">
              <span>Denda Fisik ({simKondisi}):</span>
              <span className="font-bold text-white">
                Rp {simulationResult.physicalFine.toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="border-t border-blue-800 pt-2 flex justify-between items-center font-black">
            <span className="text-orange-300">Total Denda:</span>
            <span className="text-base text-orange-400 font-black">
              Rp {simulationResult.total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-blue-300 leading-relaxed">
          <Info className="w-3.5 h-3.5 shrink-0 text-orange-400 mt-0.5" />
          <span>
            Formula: Hari 1-{lateThresholdDays} = Rp {lateBaseFine.toLocaleString("id-ID")}. Setelah lewat hari ke-{lateThresholdDays} ditambah Rp {lateDailyFine.toLocaleString("id-ID")}/hari kerja.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
