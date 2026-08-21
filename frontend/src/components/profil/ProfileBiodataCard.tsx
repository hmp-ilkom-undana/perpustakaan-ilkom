import { User, Phone, Lock, Save, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileBiodataCardProps {
  name: string;
  setName: (val: string) => void;
  waNumber: string;
  setWaNumber: (val: string) => void;
  nim?: string;
  email?: string;
  canSubmitProfile: boolean;
  isProfileDirty: boolean;
  isUpdatingProfile: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileBiodataCard({
  name,
  setName,
  waNumber,
  setWaNumber,
  nim,
  email,
  canSubmitProfile,
  isProfileDirty,
  isUpdatingProfile,
  onSubmit,
}: ProfileBiodataCardProps) {
  return (
    <Card className="border-2 border-blue-900 shadow-[5px_5px_0px_#1E3A8A] rounded-lg">
      <CardHeader className="border-b-2 border-blue-900 bg-blue-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-black text-blue-950">
          <User className="w-5 h-5 text-blue-900" />
          Informasi Biodata & Kontak
        </CardTitle>
        <CardDescription className="text-xs text-slate-600 font-medium">
          Perbarui nama lengkap dan nomor WhatsApp aktif Anda untuk koordinasi
          layanan perpustakaan.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 1. Nama Lengkap (Editable) */}
          <div className="space-y-2">
            <Label
              htmlFor="student-name"
              className="text-xs font-bold text-blue-950 uppercase tracking-wider"
            >
              Nama Lengkap Mahasiswa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
              className="border-2 border-blue-900 rounded-md font-semibold text-sm focus-visible:ring-blue-900"
            />
          </div>

          {/* 2. Nomor WhatsApp (Editable) */}
          <div className="space-y-2">
            <Label
              htmlFor="student-wa"
              className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Nomor WhatsApp Aktif
            </Label>
            <Input
              id="student-wa"
              type="tel"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="contoh: 082339113591"
              className="border-2 border-blue-900 rounded-md font-semibold text-sm focus-visible:ring-blue-900"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Nomor ini digunakan petugas perpustakaan untuk konfirmasi
              pengambilan arsip dan denda.
            </p>
          </div>

          {/* 3. NIM (Read-Only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="student-nim"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Nomor Induk Mahasiswa (NIM)
              </Label>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                Terkunci
              </span>
            </div>
            <Input
              id="student-nim"
              type="text"
              value={nim || "-"}
              disabled
              readOnly
              className="border-2 border-slate-300 bg-slate-100 text-slate-600 rounded-md font-mono font-bold text-sm cursor-not-allowed"
            />
          </div>

          {/* 4. Email Akun (Read-Only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="student-email"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Alamat Email Akun
              </Label>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                Terkunci
              </span>
            </div>
            <Input
              id="student-email"
              type="email"
              value={email || "-"}
              disabled
              readOnly
              className="border-2 border-slate-300 bg-slate-100 text-slate-600 rounded-md font-semibold text-sm cursor-not-allowed"
            />
          </div>

          {/* Catatan Status Perubahan */}
          {isProfileDirty ? (
            <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-md text-xs text-amber-900 font-medium flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Terdapat perubahan data yang belum disimpan. Klik tombol di bawah
                untuk menyimpan.
              </span>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-md text-xs text-slate-600 font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Data profil sesuai dengan rekaman akun saat ini.</span>
            </div>
          )}

          {/* Tombol Simpan Perubahan */}
          <Button
            type="submit"
            disabled={!canSubmitProfile}
            className={`w-full font-bold border-2 rounded-md transition-all mt-4 ${
              canSubmitProfile
                ? "bg-blue-900 hover:bg-blue-800 text-white border-blue-900 cursor-pointer shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdatingProfile
              ? "Menyimpan Perubahan..."
              : "Simpan Perubahan Biodata"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
