import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Calendar, MapPin, Layers } from "lucide-react";
import { useRequestBorrowingMutation } from "@/hooks/queries/useBorrowingMutation";
import { StudentArchiveItem } from "@/hooks/useStudentCatalog";

interface ArchiveDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  archive: StudentArchiveItem | null;
}

export function ArchiveDetailDialog({
  isOpen,
  onClose,
  archive,
}: ArchiveDetailDialogProps) {
  const requestMutation = useRequestBorrowingMutation();

  if (!archive) return null;

  const availableStock = archive.quantity - archive.reservedQuantity;
  const userStatus = archive.userBorrowStatus;
  const isRequestedByMe = userStatus === "REQUESTED";
  const isWaitingPickupByMe = userStatus === "WAITING_PICKUP";
  const isBorrowedByMe = userStatus === "BORROWED" || userStatus === "OVERDUE";
  const isAvailable = availableStock > 0 && archive.status !== "DIPINJAM";

  let displayStatus = "Tersedia";
  let statusVariant: "emerald" | "amber" | "secondary" = "emerald";

  if (isRequestedByMe) {
    displayStatus = "Sedang Anda Ajukan";
    statusVariant = "amber";
  } else if (isWaitingPickupByMe) {
    displayStatus = "Siap Diambil di HMP";
    statusVariant = "amber";
  } else if (isBorrowedByMe) {
    displayStatus = "Sedang Anda Pinjam";
    statusVariant = "secondary";
  } else if (!isAvailable) {
    displayStatus = "Dipinjam";
    statusVariant = "secondary";
  }

  let typeVariant: "orange" | "sky" | "navy" | "secondary" = "orange";
  const typeLower = archive.archiveType.toLowerCase();
  if (typeLower.includes("ringkasan")) {
    typeVariant = "sky";
  } else if (typeLower.includes("naskah") || typeLower.includes("publikasi")) {
    typeVariant = "navy";
  } else if (typeLower.includes("skripsi")) {
    typeVariant = "orange";
  }

  const handleBorrow = () => {
    requestMutation.mutate(archive.id, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={typeVariant}>
              {archive.archiveType}
            </Badge>
            <Badge variant="outline">
              {archive.category}
            </Badge>
          </div>
          <DialogTitle>
            {archive.title}
          </DialogTitle>
          <DialogDescription>
            Rincian informasi arsip dan ketersediaan stok fisik di perpustakaan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-3">
          <div className="bg-slate-50 border-2 border-blue-900/30 rounded-lg p-4 space-y-2.5 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" />
                Penulis
              </span>
              <span className="font-bold text-blue-950 text-right">{archive.author}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                Tahun Terbit
              </span>
              <span className="font-bold text-blue-950">{archive.year}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                Sisa Stok
              </span>
              <span className="font-bold text-blue-950">
                {availableStock} dari {archive.quantity} Eksemplar
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                Lokasi Rak
              </span>
              <span className="font-bold text-blue-950">
                {archive.shelfLocation || "Ruangan Arsip HMP"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-bold">Status Ketersediaan</span>
              <Badge variant={statusVariant}>
                {displayStatus}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleBorrow}
            disabled={
              requestMutation.isPending ||
              isRequestedByMe ||
              isWaitingPickupByMe ||
              isBorrowedByMe ||
              !isAvailable
            }
            className="w-full shadow-[2px_2px_0px_#1E3A8A]"
          >
            {requestMutation.isPending ? (
              "Memproses Pengajuan..."
            ) : isRequestedByMe ? (
              "✓ Sedang Anda Ajukan"
            ) : isWaitingPickupByMe ? (
              "✓ Menunggu Pengambilan di HMP"
            ) : isBorrowedByMe ? (
              "✓ Sedang Anda Pinjam"
            ) : isAvailable ? (
              `Ajukan Peminjaman (${availableStock} Tersedia)`
            ) : (
              "Stok Sedang Habis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
