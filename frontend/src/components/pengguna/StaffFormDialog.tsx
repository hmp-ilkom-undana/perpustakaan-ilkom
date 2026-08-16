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
import { 
  UserPlus, 
  Edit3, 
  Mail, 
  Lock, 
  Plus, 
  Trash2, 
  User, 
  Users, 
  KeyRound, 
  Info 
} from "lucide-react";
import { toast } from "sonner";

export interface StaffEmailRowItem {
  id: string;
  email: string;
}

interface StaffFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staff: UserItem | null;
  mode: "create" | "edit";
  onSubmitSingle: (staffData: Partial<UserItem> & { password?: string }) => void;
  onSubmitBatch: (staffList: Array<{ email: string }>) => void;
}

export function StaffFormDialog({
  isOpen,
  onOpenChange,
  staff,
  mode,
  onSubmitSingle,
  onSubmitBatch,
}: StaffFormDialogProps) {
  const isEdit = mode === "edit";

  // Batch Rows State for Create Mode (Email only)
  const [rows, setRows] = useState<StaffEmailRowItem[]>([
    { id: "1", email: "" },
  ]);

  // Single Edit State for Edit Mode
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editStatus, setEditStatus] = useState<"Aktif" | "Non-Aktif">("Aktif");

  useEffect(() => {
    if (isOpen) {
      if (isEdit && staff) {
        setEditName(staff.name || "");
        setEditEmail(staff.email || staff.identifier || "");
        setEditPassword("");
        setEditStatus((staff.status as "Aktif" | "Non-Aktif") || "Aktif");
      } else {
        setRows([{ id: "1", email: "" }]);
      }
    }
  }, [isOpen, isEdit, staff]);

  // Multi-Row Handlers
  const handleAddRow = () => {
    const newId = Date.now().toString();
    setRows((prev) => [...prev, { id: newId, email: "" }]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEmailChange = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, email: value } : r))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      if (!editEmail.trim() || !editEmail.includes("@")) {
        toast.error("Email resmi petugas tidak valid");
        return;
      }

      onSubmitSingle({
        id: staff?.id,
        name: editName.trim() || undefined,
        email: editEmail.trim(),
        identifier: editEmail.trim(),
        status: editStatus,
        password: editPassword.trim() || undefined,
      });
      onOpenChange(false);
      return;
    }

    // Validation for Create Mode (Email only)
    const emailSet = new Set<string>();
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const email = row.email.trim().toLowerCase();

      if (!email || !email.includes("@")) {
        toast.error(`Email pada baris ke-${i + 1} tidak valid`);
        return;
      }

      if (emailSet.has(email)) {
        toast.error(`Email pada baris ke-${i + 1} duplikat dengan baris sebelumnya`);
        return;
      }
      emailSet.add(email);
    }

    onSubmitBatch(
      rows.map((r) => ({
        email: r.email.trim(),
      }))
    );

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-2 border-blue-900 [box-shadow:6px_6px_0px_#1E3A8A] rounded-lg p-6 max-h-[90vh] flex flex-col">
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
                Tambah Akun Petugas Baru
              </>
            )}
          </DialogTitle>
          <p className="text-xs text-slate-600 font-medium pt-0.5">
            {isEdit
              ? "Ubah data kredensial atau status hak akses petugas perpustakaan."
              : "Cukup masukkan alamat email resmi untuk mendaftarkan akun petugas."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden space-y-3 pt-1">
          {/* Create Mode: Email Only & Default Password Notification */}
          {!isEdit ? (
            <>
              {/* Default Password Info Card */}
              <div className="p-3 bg-amber-50 border-2 border-blue-900 rounded-md [box-shadow:2px_2px_0px_#1E3A8A] flex items-start gap-2.5 text-xs text-blue-950">
                <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-950">
                    Password Default: <code className="px-1.5 py-0.5 bg-amber-200 border border-blue-900 rounded font-mono font-bold text-blue-900">petugas_123</code>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Petugas baru dapat login dengan password default ini, lalu menggantinya melalui menu profil.
                  </p>
                </div>
              </div>

              {/* Sticky / Fixed Control Bar on Top (No scrolling needed to add row) */}
              <div className="flex items-center justify-between bg-slate-100 border-2 border-blue-900 rounded-md p-2 px-3 [box-shadow:2px_2px_0px_#1E3A8A] shrink-0">
                <div className="flex items-center gap-2 text-xs font-black text-blue-900">
                  <Users className="w-4 h-4" />
                  <span>Daftar Email Petugas ({rows.length})</span>
                </div>

                <Button
                  type="button"
                  onClick={handleAddRow}
                  size="sm"
                  className="h-7 px-3 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs border-2 border-blue-900 rounded [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Baris
                </Button>
              </div>

              {/* Scrollable Container for Row Cards Only */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[300px]">
                {rows.map((row, index) => (
                  <div
                    key={row.id}
                    className="p-3 bg-slate-50 border-2 border-blue-900 rounded-lg [box-shadow:3px_3px_0px_#1E3A8A] space-y-1.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1">
                        <Mail className="w-3 h-3 text-blue-900" />
                        Email Resmi Petugas #{index + 1}
                      </Label>

                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1 rounded transition-colors flex items-center gap-1 text-[11px] font-bold"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <Input
                      type="email"
                      placeholder="Contoh: petugas1@ilkom.ac.id"
                      value={row.email}
                      onChange={(e) =>
                        handleEmailChange(row.id, e.target.value)
                      }
                      className="h-10 bg-white border-2 border-blue-900 rounded-md text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Edit Mode */
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Nama Petugas
                </Label>
                <Input
                  type="text"
                  placeholder="Nama petugas"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-10 border-2 border-blue-900 rounded-md font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email Resmi
                </Label>
                <Input
                  type="email"
                  placeholder="petugas@ilkom.ac.id"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="h-10 border-2 border-blue-900 rounded-md font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Ganti Password (Kosongkan jika tidak diubah)
                </Label>
                <Input
                  type="password"
                  placeholder="Masukkan password baru jika ingin mengubah"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="h-10 border-2 border-blue-900 rounded-md font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Status Hak Akses
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus("Aktif")}
                    className={`py-2 px-3 rounded-md font-bold text-xs border-2 border-blue-900 transition-all ${
                      editStatus === "Aktif"
                        ? "bg-emerald-600 text-white [box-shadow:2px_2px_0px_#1E3A8A]"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Aktif (Dapat Login)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus("Non-Aktif")}
                    className={`py-2 px-3 rounded-md font-bold text-xs border-2 border-blue-900 transition-all ${
                      editStatus === "Non-Aktif"
                        ? "bg-rose-600 text-white [box-shadow:2px_2px_0px_#1E3A8A]"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Non-Aktif (Terkunci)
                  </button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row gap-2 sm:justify-between items-center shrink-0">
            <div className="text-xs font-bold text-slate-600">
              {!isEdit && (
                <span>
                  Total: <strong className="text-blue-900">{rows.length}</strong> akun petugas
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none border-2 border-blue-900 font-bold hover:bg-slate-100 rounded-md"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-md transition-all"
              >
                {isEdit
                  ? "Simpan Perubahan"
                  : rows.length > 1
                  ? `Simpan ${rows.length} Petugas`
                  : "Simpan Petugas"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
