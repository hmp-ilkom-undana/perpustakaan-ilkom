import { User, Lock, Save, Info, CheckCircle2, Shield } from "lucide-react";
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

interface PetugasBiodataCardProps {
  name: string;
  setName: (val: string) => void;
  email?: string;
  canSubmitProfile: boolean;
  isProfileDirty: boolean;
  isUpdatingProfile: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function PetugasBiodataCard({
  name,
  setName,
  email,
  canSubmitProfile,
  isProfileDirty,
  isUpdatingProfile,
  onSubmit,
}: PetugasBiodataCardProps) {
  return (
    <Card className="border-2 border-blue-900 shadow-[5px_5px_0px_#1E3A8A] rounded-lg">
      <CardHeader className="border-b-2 border-blue-900 bg-blue-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-black text-blue-950">
          <User className="w-5 h-5 text-blue-900" />
          Informasi Biodata Profil
        </CardTitle>
        <CardDescription className="text-xs text-slate-600 font-medium">
          Perbarui nama tampilan petugas yang akan tercatat pada transaksi sirkulasi dan kasir denda.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 1. Nama Lengkap Petugas (Editable) */}
          <div className="space-y-2">
            <Label
              htmlFor="petugas-name"
              className="text-xs font-bold text-blue-950 uppercase tracking-wider"
            >
              Nama Lengkap Petugas <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="petugas-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
              disabled={isUpdatingProfile}
              className="border-2 border-blue-900 rounded-md font-semibold text-sm focus-visible:ring-blue-900"
            />
          </div>

          {/* 2. Alamat Email Akun (Read-Only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="petugas-email"
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
              id="petugas-email"
              type="email"
              value={email || "-"}
              disabled
              readOnly
              className="border-2 border-slate-300 bg-slate-100 text-slate-600 rounded-md font-semibold text-sm cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Alamat email terdaftar digunakan untuk otentikasi login resmi petugas.
            </p>
          </div>

          {/* 3. Hak Akses Sistem (Read-Only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="petugas-role"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Peran & Hak Akses
              </Label>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Aktif
              </span>
            </div>
            <Input
              id="petugas-role"
              type="text"
              value="PETUGAS PERPUSTAKAAN (Staff Panel)"
              disabled
              readOnly
              className="border-2 border-slate-300 bg-slate-100 text-slate-600 rounded-md font-bold text-sm cursor-not-allowed"
            />
          </div>

          {/* Catatan Status Perubahan */}
          {isProfileDirty ? (
            <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-md text-xs text-amber-900 font-medium flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Terdapat perubahan nama profil yang belum disimpan. Klik tombol di bawah untuk menyimpan.
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
            variant="navy"
            className="w-full font-bold border-2 rounded-md transition-all mt-4"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdatingProfile
              ? "Menyimpan Perubahan..."
              : "Simpan Perubahan Nama"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
