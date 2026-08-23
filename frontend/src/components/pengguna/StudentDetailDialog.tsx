import type { UserItem } from "@/services/user.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Shield, 
  CheckCircle2, 
  XCircle,
  MessageCircle,
  Clock
} from "lucide-react";

interface StudentDetailDialogProps {
  user: UserItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onViewHistory: (user: UserItem) => void;
  onWhatsApp: (user: UserItem) => void;
}

export function StudentDetailDialog({
  user,
  isOpen,
  onOpenChange,
  onViewHistory,
  onWhatsApp,
}: StudentDetailDialogProps) {
  if (!user) return null;

  const isActive = user.status === "Aktif";
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-2 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black text-blue-900">
            <User className="w-5 h-5 text-blue-900" />
            Detail Profil Mahasiswa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Avatar Header Box */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-blue-900 rounded-lg shadow-[3px_3px_0px_#1E3A8A]">
            <div className="w-14 h-14 rounded-md bg-blue-100 border-2 border-blue-900 text-blue-900 font-black text-xl flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1E3A8A]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-lg text-blue-950 truncate">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-0.5 text-xs font-mono font-black text-blue-900 bg-amber-100 border-2 border-blue-900 rounded">
                  {user.nim || user.identifier}
                </span>
                <Badge
                  variant="outline"
                  className={`border-2 border-blue-900 font-bold px-2 py-0.5 rounded text-[11px] ${
                    isActive
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-rose-100 text-rose-900"
                  }`}
                >
                  {isActive ? "Akun Aktif" : "Akun Non-Aktif"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Mail className="w-3.5 h-3.5 text-blue-900" />
                Alamat Email
              </div>
              <p className="font-semibold text-sm text-slate-900 truncate">
                {user.email || user.identifier}
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                Nomor WhatsApp
              </div>
              <p className="font-mono font-semibold text-sm text-slate-900 truncate">
                {user.wa_number || "-"}
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                Role Akses
              </div>
              <p className="font-bold text-sm text-blue-900">
                {user.role}
              </p>
            </div>

            <div className="p-3 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-900" />
                Terdaftar Sejak
              </div>
              <p className="font-semibold text-sm text-slate-900">
                {user.createdAt || "Agustus 2026"}
              </p>
            </div>
          </div>

          {/* Activity Box */}
          <div className="p-4 bg-amber-50/70 border-2 border-blue-900 rounded-md shadow-[3px_3px_0px_#1E3A8A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-200 border-2 border-blue-900 rounded text-blue-900">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pinjaman Aktif</p>
                <p className="text-sm font-black text-blue-950">
                  {user.activeBorrowings ?? 0} Arsip
                </p>
              </div>
            </div>
            {isActive ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Dapat Meminjam
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <XCircle className="w-4 h-4" />
                Akses Dibatasi
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-between items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onViewHistory(user);
              }}
              className="flex-1 sm:flex-none border-2 border-blue-900 font-bold hover:bg-slate-100 rounded-md text-xs shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-900" />
              Riwayat Peminjaman
            </Button>
            {user.wa_number && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onWhatsApp(user)}
                className="flex-1 sm:flex-none border-2 border-emerald-800 text-emerald-800 hover:bg-emerald-50 font-bold rounded-md text-xs shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                Kirim WhatsApp
              </Button>
            )}
          </div>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-blue-900 hover:bg-blue-950 text-white font-bold border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-md transition-all cursor-pointer"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
