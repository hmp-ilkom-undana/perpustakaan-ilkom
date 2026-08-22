import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { CatalogItem } from "@/types/katalog";

interface KatalogDeleteDialogProps {
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
}: KatalogDeleteDialogProps) {
  if (!item) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-blue-900 bg-white shadow-[4px_4px_0px_#1E3A8A] rounded-xl max-w-md p-6">
        <AlertDialogHeader className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <div className="w-12 h-12 rounded-xl bg-rose-100 border-2 border-rose-600 flex items-center justify-center text-rose-600 mb-2 shadow-[2px_2px_0px_#E11D48]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <AlertDialogTitle className="text-xl font-black text-blue-950">
            Hapus Data Arsip?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs font-semibold text-slate-600 mt-1">
            Tindakan ini tidak dapat dibatalkan. Data arsip berikut akan dihapus secara permanen dari basis data perpustakaan:
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* ITEM CARD PREVIEW */}
        <div className="bg-slate-50 border-2 border-blue-900/40 rounded-lg p-3.5 my-2 space-y-1.5 text-left shadow-[2px_2px_0px_#1E3A8A]">
          <div className="flex items-center gap-2">
            <Badge variant="amber" className="font-mono text-xs font-black">
              {item.archiveCode}
            </Badge>
            <span className="text-xs font-bold text-slate-500 uppercase">
              {item.type}
            </span>
          </div>
          <p className="font-black text-sm text-blue-950 line-clamp-2">
            {item.title}
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Penulis: {item.author} ({item.year})
          </p>
        </div>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto font-bold"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            variant="destructive"
            className="w-full sm:w-auto font-black"
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
