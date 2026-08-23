import { Receipt, AlertTriangle, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FineSimulatorCard } from "./FineSimulatorCard";

interface DendaTabProps {
  lateBaseFine: number;
  setLateBaseFine: (val: number) => void;
  lateThresholdDays: number;
  setLateThresholdDays: (val: number) => void;
  lateDailyFine: number;
  setLateDailyFine: (val: number) => void;
  damagedFine: number;
  setDamagedFine: (val: number) => void;
  lostFine: number;
  setLostFine: (val: number) => void;
  adminWaNumber: string;
  setAdminWaNumber: (val: string) => void;
  adminContactName: string;
  setAdminContactName: (val: string) => void;
}

export function DendaTab({
  lateBaseFine,
  setLateBaseFine,
  lateThresholdDays,
  setLateThresholdDays,
  lateDailyFine,
  setLateDailyFine,
  damagedFine,
  setDamagedFine,
  lostFine,
  setLostFine,
  adminWaNumber,
  setAdminWaNumber,
  adminContactName,
  setAdminContactName,
}: DendaTabProps) {
  const handleTestWhatsApp = () => {
    const clean = adminWaNumber.replace(/\D/g, "");
    const formatted = clean.startsWith("0") ? "62" + clean.slice(1) : clean;
    window.open(`https://wa.me/${formatted}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Settings Denda (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Denda Keterlambatan */}
          <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-orange-500" />
                  Skema Denda Keterlambatan (Late Return Fines)
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Tarif denda berjenjang dihitung berdasarkan akumulasi hari kerja operasional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Denda Awal (Flat):</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">Rp</span>
                    <Input
                      type="number"
                      min={0}
                      step={5000}
                      value={lateBaseFine}
                      onChange={(e) =>
                        setLateBaseFine(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="pl-9 border-2 border-blue-900 font-black text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Masa hari 1 s/d threshold</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Batas Threshold (Hari):</Label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={lateThresholdDays}
                    onChange={(e) =>
                      setLateThresholdDays(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="border-2 border-blue-900 font-black text-sm"
                  />
                  <p className="text-[10px] text-slate-500">Hari kerja sebelum denda bertambah</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Denda Tambahan/Hari:</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">Rp</span>
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      value={lateDailyFine}
                      onChange={(e) =>
                        setLateDailyFine(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="pl-9 border-2 border-blue-900 font-black text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Setelah melewati threshold</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Denda Fisik */}
          <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Tarif Sanksi Kondisi Fisik Arsip
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Denda tambahan yang dikenakan jika arsip dikembalikan dalam keadaan cacat atau tidak kembali.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Denda Arsip Rusak:</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">Rp</span>
                    <Input
                      type="number"
                      min={0}
                      step={5000}
                      value={damagedFine}
                      onChange={(e) =>
                        setDamagedFine(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="pl-9 border-2 border-blue-900 font-black text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Denda Arsip Hilang:</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">Rp</span>
                    <Input
                      type="number"
                      min={0}
                      step={5000}
                      value={lostFine}
                      onChange={(e) =>
                        setLostFine(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="pl-9 border-2 border-blue-900 font-black text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontak Admin WhatsApp */}
          <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  Kontak WhatsApp Bantuan & Pembayaran Denda
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Nomor pengurus HMP yang ditampilkan pada akun mahasiswa saat konfirmasi pembayaran denda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Nama PIC / Admin:</Label>
                  <Input
                    type="text"
                    value={adminContactName}
                    onChange={(e) => setAdminContactName(e.target.value)}
                    placeholder="Contoh: Admin Perpustakaan ILKOM"
                    className="border-2 border-blue-900 font-semibold text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Nomor WhatsApp Admin:</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={adminWaNumber}
                      onChange={(e) => setAdminWaNumber(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="border-2 border-blue-900 font-bold text-sm"
                    />
                    {adminWaNumber && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-500 hover:text-white shadow-[2px_2px_0px_#059669] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 transition-all cursor-pointer"
                        title="Uji Hubungi WhatsApp"
                        onClick={handleTestWhatsApp}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LIVE SIMULATOR WIDGET (1 Kolom) */}
        <div>
          <FineSimulatorCard
            lateBaseFine={lateBaseFine}
            lateThresholdDays={lateThresholdDays}
            lateDailyFine={lateDailyFine}
            damagedFine={damagedFine}
            lostFine={lostFine}
          />
        </div>
      </div>
    </div>
  );
}
