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
import { UserCheck, UserX } from "lucide-react";

interface StaffStatusToggleDialogProps {
  staff: UserItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (staff: UserItem) => void;
}

export function StaffStatusToggleDialog({
  staff,
  isOpen,
  onOpenChange,
  onConfirm,
}: StaffStatusToggleDialogProps) {
  if (!staff) return null;

  const isActive = staff.status === "Aktif";

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-blue-900 [box-shadow:6px_6px_0px_#1E3A8A] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 font-black text-lg ${isActive ? "text-amber-600" : "text-emerald-600"}`}>
            {isActive ? (
              <>
                <UserX className="w-5 h-5 text-amber-600" />
                Konfirmasi Penonaktifan Akses Petugas
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Konfirmasi Aktivasi Akses Petugas
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-700 pt-2 font-medium">
            {isActive ? (
              <span>
                Apakah Anda yakin ingin menonaktifkan akses petugas{" "}
                <strong>{staff.name}</strong> ({staff.email || staff.identifier})?
                Akun ini tidak akan dapat login ke panel petugas sementara waktu.
              </span>
            ) : (
              <span>
                Apakah Anda yakin ingin mengaktifkan kembali akses petugas{" "}
                <strong>{staff.name}</strong> ({staff.email || staff.identifier})?
                Petugas akan dapat kembali login dan menjalankan operasional perpustakaan.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="border-2 border-blue-900 font-bold hover:bg-slate-100 rounded-md">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(staff)}
            className={`text-white font-bold border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-md transition-all ${
              isActive
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isActive ? "Ya, Nonaktifkan Akses" : "Ya, Aktifkan Akses"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
