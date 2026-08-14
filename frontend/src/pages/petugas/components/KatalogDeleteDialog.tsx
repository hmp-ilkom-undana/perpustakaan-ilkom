import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { CatalogItem } from "@/types/katalog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: CatalogItem | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function KatalogDeleteDialog({
  isOpen,
  onOpenChange,
  item,
  onConfirm,
  isDeleting = false,
}: Props) {
  if (!item) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-blue-900 bg-white [box-shadow:4px_4px_0px_#1E3A8A] max-w-md p-6">
        <AlertDialogHeader className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <div className="w-12 h-12 rounded-full bg-red-100 border-2 border-red-600 flex items-center justify-center text-red-600 mb-2">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <AlertDialogTitle className="text-xl font-black text-blue-950">
            Hapus Data Arsip?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-600 mt-1">
            Tindakan ini tidak dapat dibatalkan. Data arsip berikut akan dihapus secara permanen dari database:
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* ITEM CARD PREVIEW */}
        <div className="bg-slate-50 border-2 border-slate-300 p-3.5 my-2 space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black bg-amber-300 text-blue-950 px-2 py-0.5 border border-blue-900">
              {item.archiveCode}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase">
              {item.type}
            </span>
          </div>
          <p className="font-bold text-sm text-blue-950 line-clamp-2">
            {item.title}
          </p>
          <p className="text-xs text-slate-500">
            Penulis: {item.author} ({item.year})
          </p>
        </div>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-2 border-blue-900 font-bold text-blue-900"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-900 [box-shadow:2px_2px_0px_#7f1d1d] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#7f1d1d]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Ya, Hapus Arsip
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
