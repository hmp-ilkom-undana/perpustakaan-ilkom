import React from "react";
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  Radio,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/datetime-picker";

interface PemeliharaanTabProps {
  isMaintenanceActive: boolean;
  setIsMaintenanceActive: (val: boolean) => void;
  maintenanceTitle: string;
  setMaintenanceTitle: (val: string) => void;
  maintenanceMessage: string;
  setMaintenanceMessage: (val: string) => void;
  maintenanceTargetEnd: string;
  setMaintenanceTargetEnd: (val: string) => void;
  allowAdminBypass: boolean;
  setAllowAdminBypass: (val: boolean) => void;
}

export function PemeliharaanTab({
  isMaintenanceActive,
  setIsMaintenanceActive,
  maintenanceTitle,
  setMaintenanceTitle,
  maintenanceMessage,
  setMaintenanceMessage,
  maintenanceTargetEnd,
  setMaintenanceTargetEnd,
  allowAdminBypass,
  setAllowAdminBypass,
}: PemeliharaanTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. Master Toggle Switch Card */}
      <Card
        className={`border-2 border-blue-900 transition-all ${
          isMaintenanceActive
            ? "bg-amber-50 shadow-[6px_6px_0px_#D97706]"
            : "bg-white shadow-[4px_4px_0px_#1E3A8A]"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
                  <Radio
                    className={`w-5 h-5 ${
                      isMaintenanceActive
                        ? "text-amber-600 animate-pulse"
                        : "text-slate-400"
                    }`}
                  />
                  Status Pemeliharaan Sistem (Maintenance Mode)
                </h2>
                <Badge
                  className={`border-2 border-blue-900 font-black text-[10px] uppercase shadow-[1px_1px_0px_#1E3A8A] ${
                    isMaintenanceActive
                      ? "bg-amber-400 text-blue-950"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {isMaintenanceActive ? "Aktif (Live)" : "Non-Aktif"}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 font-semibold max-w-2xl">
                Saat diaktifkan, seluruh mahasiswa dan publik akan dialihkan ke halaman pemeliharaan sistem.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Switch
                checked={isMaintenanceActive}
                onCheckedChange={setIsMaintenanceActive}
                className="data-[state=checked]:bg-orange-500 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open("/maintenance", "_blank")}
                className="border-2 border-blue-900 font-bold text-xs h-9 hover:bg-slate-100 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Pratinjau Halaman
              </Button>
            </div>
          </div>

          {isMaintenanceActive && (
            <div className="mt-4 p-3.5 bg-amber-100/80 border-2 border-amber-500 rounded-md flex items-center gap-3 text-amber-950 text-xs font-bold shadow-[2px_2px_0px_#D97706]">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <span>
                Peringatan: Mahasiswa saat ini tidak dapat mengakses layanan peminjaman atau katalog sampai mode ini dinonaktifkan.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Detail Teks & Estimasi Waktu */}
      <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Konten Pengumuman & Estimasi Selesai
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Atur pesan informatif yang akan dibaca oleh pengunjung halaman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider">
                Judul Utama Pengumuman
              </Label>
              <Input
                value={maintenanceTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMaintenanceTitle(e.target.value)
                }
                placeholder="Contoh: Sistem Sedang Dalam Pemeliharaan Rutin"
                className="border-2 border-blue-900 font-bold text-xs shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider">
                Pesan Deskripsi Lengkap
              </Label>
              <Textarea
                rows={3}
                value={maintenanceMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMaintenanceMessage(e.target.value)
                }
                placeholder="Tuliskan pesan transparan mengenai apa yang sedang dikerjakan..."
                className="border-2 border-blue-900 font-semibold text-xs shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                Target Estimasi Selesai (Waktu Berakhir)
              </Label>
              <DateTimePicker
                value={maintenanceTargetEnd}
                onChange={setMaintenanceTargetEnd}
                placeholder="Pilih tanggal dan jam perkiraan selesai pemeliharaan..."
              />
              <p className="text-[10px] text-slate-500 font-semibold">
                Waktu ini digunakan untuk memutar hitung mundur (*countdown timer*).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Hak Akses Bypass Petugas */}
      <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-blue-950 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-orange-500" />
                Akses Khusus Petugas (Bypass Login)
              </h2>
              <p className="text-xs text-slate-600 font-semibold max-w-xl">
                Izinkan pengguna dengan peran <strong>Petugas</strong> untuk tetap login dan mengakses dashboard pelayanan selama pemeliharaan berlangsung. (Admin memiliki akses penuh secara otomatis).
              </p>
            </div>
            <Switch
              checked={allowAdminBypass}
              onCheckedChange={setAllowAdminBypass}
              className="data-[state=checked]:bg-orange-500 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
