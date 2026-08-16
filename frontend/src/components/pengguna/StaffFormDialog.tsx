import { useState, useEffect } from "react";
import type { UserItem } from "@/services/user.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Edit3, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";

interface StaffFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staff: UserItem | null;
  mode: "create" | "edit";
  onSubmit: (staffData: Partial<UserItem> & { password?: string }) => void;
}

export function StaffFormDialog({
  isOpen,
  onOpenChange,
  staff,
  mode,
  onSubmit,
}: StaffFormDialogProps) {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"Aktif" | "Non-Aktif">("Aktif");

  useEffect(() => {
    if (staff && isEdit) {
      setName(staff.name || "");
      setEmail(staff.email || staff.identifier || "");
      setWaNumber(staff.wa_number || "");
      setStatus((staff.status as "Aktif" | "Non-Aktif") || "Aktif");
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setWaNumber("");
      setPassword("");
      setStatus("Aktif");
    }
  }, [staff, isEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama petugas wajib diisi");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Email resmi petugas tidak valid");
      return;
    }

    if (!isEdit && (!password.trim() || password.length < 6)) {
      toast.error("Password awal minimal 6 karakter");
      return;
    }

    onSubmit({
      id: staff?.id,
      name,
      email,
      identifier: email,
      wa_number: waNumber,
      role: "PETUGAS",
      status,
      password: password || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-blue-900 [box-shadow:6px_6px_0px_#1E3A8A] rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black text-blue-900">
            {isEdit ? (
              <>
                <Edit3 className="w-5 h-5 text-blue-900" />
                Edit Data Petugas
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-blue-900" />
                Tambah Petugas Baru
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nama Petugas */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Nama Lengkap
            </Label>
            <Input
              type="text"
              placeholder="Contoh: Siti Rahmawati, S.Kom."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 border-2 border-blue-900 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email Resmi Perpustakaan
            </Label>
            <Input
              type="email"
              placeholder="Contoh: petugas1@ilkom.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-2 border-blue-900 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
              required
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Nomor WhatsApp (Opsional)
            </Label>
            <Input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className="h-11 border-2 border-blue-900 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
            />
          </div>

          {/* Password (for create or optional edit) */}
          {!isEdit ? (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Password Awal Akun
              </Label>
              <Input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-2 border-blue-900 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                required
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Ganti Password (Kosongkan jika tidak diubah)
              </Label>
              <Input
                type="password"
                placeholder="Masukkan password baru jika ingin mengubah"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-2 border-blue-900 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
              />
            </div>
          )}

          {/* Status Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Status Hak Akses
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("Aktif")}
                className={`py-2.5 px-3 rounded-md font-bold text-xs border-2 border-blue-900 transition-all ${
                  status === "Aktif"
                    ? "bg-emerald-600 text-white [box-shadow:2px_2px_0px_#1E3A8A]"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Aktif (Dapat Login)
              </button>
              <button
                type="button"
                onClick={() => setStatus("Non-Aktif")}
                className={`py-2.5 px-3 rounded-md font-bold text-xs border-2 border-blue-900 transition-all ${
                  status === "Non-Aktif"
                    ? "bg-rose-600 text-white [box-shadow:2px_2px_0px_#1E3A8A]"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Non-Aktif (Terkunci)
              </button>
            </div>
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-2 border-blue-900 font-bold hover:bg-slate-100 rounded-md"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-md transition-all"
            >
              {isEdit ? "Simpan Perubahan" : "Tambah Petugas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
