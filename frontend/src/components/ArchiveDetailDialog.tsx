import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
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
import { BookOpen, User, Calendar, MapPin, Layers } from "lucide-react";

interface Archive {
  id: string;
  title: string;
  author: string;
  year: number | string;
  archiveType: string;
  category: string;
  status: string;
  quantity: number;
  shelfLocation: string | null;
  reservedQuantity: number;
  isRequestedByCurrentUser?: boolean;
}

interface ArchiveDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  archive: Archive | null;
}

export function ArchiveDetailDialog({
  isOpen,
  onClose,
  archive,
}: ArchiveDetailDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!archive) return null;

  const availableStock = archive.quantity - archive.reservedQuantity;
  const isRequestedByMe = archive.isRequestedByCurrentUser;
  const isAvailable = availableStock > 0 && archive.status !== "DIPINJAM";

  let displayStatus = "Tersedia";
  let statusVariant: "emerald" | "amber" | "secondary" = "emerald";

  if (isRequestedByMe) {
    displayStatus = "Sedang Diajukan";
    statusVariant = "amber";
  } else if (!isAvailable) {
    displayStatus = "Sedang Dipinjam";
    statusVariant = "secondary";
  }

  const handleBorrow = async () => {
    setIsLoading(true);

    try {
      const response = await api.post(
        "/api/borrowings",
        { archiveId: archive.id }
      );

      onClose();
      toast.success("Pengajuan Berhasil!", {
        description:
          response.data.message || "Silakan cek menu Peminjaman untuk melihat tiket antrean.",
      });
    } catch (error: any) {
      console.error("Gagal mengajukan pinjaman:", error);
      const errorMsg =
        error.response?.data?.message || "Terjadi kesalahan pada sistem.";

      toast.error("Pengajuan Gagal", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="orange">
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
            Rincian informasi dokumen dan ketersediaan stok fisik di perpustakaan.
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
            disabled={isLoading || isRequestedByMe || !isAvailable}
            className="w-full"
          >
            {isLoading ? (
              "Memproses Pengajuan..."
            ) : isRequestedByMe ? (
              "✓ Sedang Anda Ajukan"
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
