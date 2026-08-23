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
import { Trash2, AlertTriangle } from "lucide-react";

interface StaffDeleteDialogProps {
  staff: UserItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (staff: UserItem) => void;
}

export function StaffDeleteDialog({
  staff,
  isOpen,
  onOpenChange,
  onConfirm,
}: StaffDeleteDialogProps) {
  if (!staff) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 font-black text-lg">
            <Trash2 className="w-5 h-5 text-red-600" />
            Cabut Akses / Hapus Akun Petugas
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-700 pt-2 font-medium space-y-3">
            <p>
              Apakah Anda yakin ingin menghapus hak akses dan akun untuk petugas{" "}
              <strong>{staff.name}</strong> ({staff.email || staff.identifier})?
            </p>
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-md text-xs text-red-800 font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Tindakan ini permanen. Petugas tidak akan lagi memiliki hak akses ke panel operasional sirkulasi, inventaris katalog, dan kelola denda.
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
            Ya, Hapus Petugas
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
