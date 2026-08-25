import React from "react";
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  ShieldAlert,
  Radio,
  Tag,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface PemeliharaanTabProps {
  isMaintenanceActive: boolean;
  setIsMaintenanceActive: (val: boolean) => void;
  maintenanceMode: "MAINTENANCE" | "UPDATE";
  setMaintenanceMode: (mode: "MAINTENANCE" | "UPDATE") => void;
  maintenanceTitle: string;
  setMaintenanceTitle: (val: string) => void;
  maintenanceMessage: string;
  setMaintenanceMessage: (val: string) => void;
  maintenanceTargetEnd: string;
  setMaintenanceTargetEnd: (val: string) => void;
  maintenanceVersion: string;
  setMaintenanceVersion: (val: string) => void;
  maintenanceChangelog: string[];
  setMaintenanceChangelog: (val: string[]) => void;
  allowAdminBypass: boolean;
  setAllowAdminBypass: (val: boolean) => void;
}

export function PemeliharaanTab({
  isMaintenanceActive,
  setIsMaintenanceActive,
  maintenanceMode,
  setMaintenanceMode,
  maintenanceTitle,
  setMaintenanceTitle,
  maintenanceMessage,
  setMaintenanceMessage,
  maintenanceTargetEnd,
  setMaintenanceTargetEnd,
  maintenanceVersion,
  setMaintenanceVersion,
  maintenanceChangelog,
  setMaintenanceChangelog,
  allowAdminBypass,
  setAllowAdminBypass,
}: PemeliharaanTabProps) {
  const handleAddChangelog = () => {
    setMaintenanceChangelog([...maintenanceChangelog, ""]);
  };

  const handleUpdateChangelog = (index: number, value: string) => {
    const updated = [...maintenanceChangelog];
    updated[index] = value;
    setMaintenanceChangelog(updated);
  };

  const handleRemoveChangelog = (index: number) => {
    setMaintenanceChangelog(maintenanceChangelog.filter((_, i) => i !== index));
  };

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

      {/* 2. Pilihan Mode Pemeliharaan */}
      <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-500" />
              Tipe Mode Halaman Pemeliharaan
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Pilih tampilan dan nuansa informasi yang sesuai dengan jenis kegiatan teknis yang sedang dilakukan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Option A: MAINTENANCE */}
            <button
              type="button"
              onClick={() => setMaintenanceMode("MAINTENANCE")}
              className={`p-4 rounded-lg border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                maintenanceMode === "MAINTENANCE"
                  ? "border-blue-900 bg-amber-50 shadow-[4px_4px_0px_#1E3A8A]"
                  : "border-slate-300 bg-white hover:border-blue-900 hover:bg-slate-50 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="w-10 h-10 rounded bg-amber-400 border-2 border-blue-900 flex items-center justify-center text-blue-950 font-black shadow-[2px_2px_0px_#1E3A8A]">
                  <Wrench className="w-5 h-5" />
                </div>
                <Badge className="bg-amber-400 text-blue-950 border-2 border-blue-900 font-black text-[10px]">
                  Mode 1
                </Badge>
              </div>
              <h3 className="font-black text-blue-950 text-sm">
                Perawatan Sistem (System Maintenance)
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Fokus pada kestabilan, perbaikan bug, pemeliharaan server rutin, atau migrasi basis data.
              </p>
            </button>

            {/* Option B: UPDATE */}
            <button
              type="button"
              onClick={() => setMaintenanceMode("UPDATE")}
              className={`p-4 rounded-lg border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                maintenanceMode === "UPDATE"
                  ? "border-blue-900 bg-orange-50 shadow-[4px_4px_0px_#1E3A8A]"
                  : "border-slate-300 bg-white hover:border-blue-900 hover:bg-slate-50 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="w-10 h-10 rounded bg-orange-500 border-2 border-blue-900 flex items-center justify-center text-white font-black shadow-[2px_2px_0px_#1E3A8A]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <Badge className="bg-orange-500 text-white border-2 border-blue-900 font-black text-[10px]">
                  Mode 2
                </Badge>
              </div>
              <h3 className="font-black text-blue-950 text-sm">
                Pembaruan Fitur (System Update & Release)
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Menampilkan rilis versi baru, daftar changelog fitur, dan antusiasme pengembangan sistem.
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Detail Teks & Estimasi Waktu */}
      <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-black text-blue-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Konten Pengumuman & Estimasi Selesai (ETA)
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

            <div className="space-y-1.5">
              <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                Target Estimasi Selesai (Waktu Berakhir)
              </Label>
              <Input
                type="datetime-local"
                value={maintenanceTargetEnd}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMaintenanceTargetEnd(e.target.value)
                }
                className="border-2 border-blue-900 font-bold text-xs shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0"
              />
              <p className="text-[10px] text-slate-500 font-semibold">
                Waktu ini digunakan untuk memutar hitung mundur (*countdown timer*).
              </p>
            </div>

            {maintenanceMode === "UPDATE" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  Tag Versi Rilis
                </Label>
                <Input
                  value={maintenanceVersion}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMaintenanceVersion(e.target.value)
                  }
                  placeholder="Contoh: v1.2.0"
                  className="border-2 border-blue-900 font-bold text-xs shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0"
                />
              </div>
            )}
          </div>

          {/* Dynamic Changelog Items (Khusus Mode Update) */}
          {maintenanceMode === "UPDATE" && (
            <div className="pt-4 border-t-2 border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-black text-blue-950 uppercase tracking-wider">
                    Daftar Fitur Baru (Changelog Sneak Peek)
                  </Label>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Poin-poin pembaruan yang akan ditampilkan dalam kartu rilis.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddChangelog}
                  className="border-2 border-blue-900 font-bold text-xs h-8 hover:bg-orange-50 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Tambah Poin
                </Button>
              </div>

              <div className="space-y-2">
                {maintenanceChangelog.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-[11px] font-black text-slate-600 shrink-0">
                      {index + 1}
                    </span>
                    <Input
                      value={item}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleUpdateChangelog(index, e.target.value)
                      }
                      placeholder="Contoh: Peningkatan kecepatan pencarian katalog..."
                      className="border-2 border-blue-900 font-semibold text-xs shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveChangelog(index)}
                      className="border-2 border-red-500 text-red-600 hover:bg-red-50 h-9 w-9 p-0 shrink-0 shadow-[2px_2px_0px_#DC2626] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Hak Akses Bypass Administrator */}
      <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-blue-950 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-orange-500" />
                Akses Khusus Pengelola (Bypass Login)
              </h2>
              <p className="text-xs text-slate-600 font-semibold max-w-xl">
                Izinkan pengguna dengan peran **Admin** dan **Petugas** untuk tetap login dan mengakses dashboard pengelolaan selama pemeliharaan berlangsung.
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
