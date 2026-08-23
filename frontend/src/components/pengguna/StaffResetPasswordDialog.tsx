import type { UserItem } from "@/services/user.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldAlert, KeyRound } from "lucide-react";

interface StaffResetPasswordDialogProps {
  staff: UserItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (staff: UserItem) => void;
}

export function StaffResetPasswordDialog({
  staff,
  isOpen,
  onOpenChange,
  onConfirm,
}: StaffResetPasswordDialogProps) {
  if (!staff) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 font-black text-lg">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            Konfirmasi Reset Sandi Petugas
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-700 pt-2 font-medium space-y-3">
            <p>
              Apakah Anda yakin ingin mereset kata sandi untuk akun petugas{" "}
              <strong>{staff.name}</strong> ({staff.email || staff.identifier})?
            </p>
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-md text-xs text-red-800 font-semibold flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Sandi akun akan dikembalikan ke sandi standar (
                <code className="bg-white px-1.5 py-0.5 border border-red-300 rounded font-black text-red-900">
                  petugas_123
                </code>
                ). Petugas wajib mengganti sandi setelah berhasil login.
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="border-2 border-blue-900 font-bold hover:bg-slate-100 rounded-md cursor-pointer">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(staff)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-md transition-all cursor-pointer"
          >
            Ya, Reset Sandi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
