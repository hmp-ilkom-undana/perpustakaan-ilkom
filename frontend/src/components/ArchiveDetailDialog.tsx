import { useState } from "react";
import axios from "axios";
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

  // Jika tidak ada arsip yang dipilih, jangan render apa-apa
  if (!archive) return null;

  // 1. Kalkulasi stok nyata (Quantity asli dikurangi yang sedang diantre)
  const availableStock = archive.quantity - archive.reservedQuantity;

  // 2. Cek apakah user yang sedang login sudah mengantre buku ini
  const isRequestedByMe = archive.isRequestedByCurrentUser;

  // 3. Status ketersediaan untuk orang lain
  const isAvailable = availableStock > 0 && archive.status !== "DIPINJAM";

  let displayStatus = "Tersedia";
  let badgeStyle = "bg-green-100 text-green-700";
  if (isRequestedByMe) {
    displayStatus = "Sedang Diajukan";
    badgeStyle = "bg-blue-100 text-blue-700";
  } else if (!isAvailable) {
    displayStatus = "Sedang Dipinjam";
    badgeStyle = "bg-slate-100 text-slate-500";
  }

  const handleBorrow = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/borrowings",
        { archiveId: archive.id },
        { withCredentials: true },
      );

      // Jika berhasil, tutup modal dan tampilkan notifikasi sukses
      onClose();
      toast.success("Pengajuan Berhasil!", {
        description:
          response.data.message || "Silakan cek menu Riwayat Peminjaman.",
      });
    } catch (error: any) {
      console.error("Gagal mengajukan pinjaman:", error);

      // Ambil pesan error spesifik dari backend
      const errorMsg =
        error.response?.data?.error || "Terjadi kesalahan pada sistem.";

      // Tampilkan notifikasi gagal
      toast.error("Pengajuan Gagal", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
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
              <Badge className={`${badgeStyle} shadow-none`}>
                {displayStatus}
              </Badge>
            </div>

            <div className="font-semibold text-slate-500">Sisa Stok</div>
            <div className="col-span-2 text-slate-800">
              {/* Tampilkan sisa stok */}
              {availableStock} dari {archive.quantity} Eksemplar
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
            // Tombol mati jika: Sedang loading, Sudah diantre user ini, ATAU stok habis
            disabled={isLoading || isRequestedByMe || !isAvailable}
            className={`w-full font-bold shadow-none rounded-md transition-colors ${
              isRequestedByMe
                ? "bg-blue-50 text-blue-600 border border-blue-200 cursor-not-allowed" // STATE 1: Milik Saya
                : isAvailable
                  ? "bg-orange-500 hover:bg-orange-600 text-white" // STATE 2: Tersedia
                  : "bg-slate-100 text-slate-400 cursor-not-allowed" // STATE 3: Habis
            }`}
          >
            {isLoading
              ? "Memproses..."
              : isRequestedByMe
                ? "✓ Sedang Anda Ajukan (Cek Peminjaman)"
                : isAvailable
                  ? `Ajukan Peminjaman (Sisa: ${availableStock})`
                  : "Stok Habis"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
