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

interface StudentStatusToggleDialogProps {
  user: UserItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: UserItem) => void;
}

export function StudentStatusToggleDialog({
  user,
  isOpen,
  onOpenChange,
  onConfirm,
}: StudentStatusToggleDialogProps) {
  if (!user) return null;

  const isActive = user.status === "Aktif";

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-blue-900 [box-shadow:6px_6px_0px_#1E3A8A] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 font-black text-lg ${isActive ? "text-amber-600" : "text-emerald-600"}`}>
            {isActive ? (
              <>
                <UserX className="w-5 h-5 text-amber-600" />
                Konfirmasi Penonaktifan Akun
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Konfirmasi Aktivasi Akun
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-700 pt-2 font-medium">
            {isActive ? (
              <span>
                Apakah Anda yakin ingin menonaktifkan akun mahasiswa{" "}
                <strong>{user.name}</strong> ({user.nim || user.identifier})?
                Akun yang dinonaktifkan tidak akan dapat login atau meminjam koleksi perpustakaan.
              </span>
            ) : (
              <span>
                Apakah Anda yakin ingin mengaktifkan kembali akun mahasiswa{" "}
                <strong>{user.name}</strong> ({user.nim || user.identifier})?
                Pengguna akan dapat kembali mengakses layanan perpustakaan secara penuh.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="border-2 border-blue-900 font-bold hover:bg-slate-100 rounded-md">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(user)}
            className={`text-white font-bold border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-md transition-all ${
              isActive
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isActive ? "Ya, Nonaktifkan Akun" : "Ya, Aktifkan Akun"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
