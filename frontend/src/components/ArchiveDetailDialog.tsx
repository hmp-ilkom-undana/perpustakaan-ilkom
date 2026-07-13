import { useState } from "react";
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

  // Jika tidak ada arsip yang dipilih, jangan render apa-apa
  if (!archive) return null;

  const isAvailable = archive.status.toUpperCase() === "TERSEDIA";

  const handleBorrow = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    onClose(); // Tutup modal
    toast.success("Berhasil mengajukan pinjaman! Silakan cek menu Riwayat.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900 leading-tight">
            {archive.title}
          </DialogTitle>
          <DialogDescription>
            {archive.archiveType} • {archive.category}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-semibold text-slate-500">Penulis</div>
            <div className="col-span-2 text-slate-800">{archive.author}</div>

            <div className="font-semibold text-slate-500">Tahun</div>
            <div className="col-span-2 text-slate-800">{archive.year}</div>

            <div className="font-semibold text-slate-500">Status</div>
            <div className="col-span-2">
              <Badge
                className={
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {archive.status}
              </Badge>
            </div>

            <div className="font-semibold text-slate-500">Stok Tersedia</div>
            <div className="col-span-2 text-slate-800">
              {archive.quantity} Eksemplar
            </div>

            <div className="font-semibold text-slate-500">Lokasi Rak</div>
            <div className="col-span-2 text-slate-800">
              {archive.shelfLocation
                ? archive.shelfLocation
                : "Belum ditentukan"}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleBorrow}
            disabled={!isAvailable || isLoading}
            className={`w-full font-bold shadow-none rounded-md transition-colors ${
              isAvailable
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoading
              ? "Memproses..."
              : isAvailable
                ? "Ajukan Peminjaman"
                : "Tidak Tersedia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
