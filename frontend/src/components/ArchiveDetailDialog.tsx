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
  let badgeStyle = "bg-green-300 text-slate-800 border border-blue-900/30 shadow-[1px_1px_0px_#1E3A8A]";
  if (isRequestedByMe) {
    displayStatus = "Sedang Diajukan";
    badgeStyle = "bg-amber-400 text-slate-800 border border-blue-900/30 shadow-[1px_1px_0px_#1E3A8A]";
  } else if (!isAvailable) {
    displayStatus = "Sedang Dipinjam";
    badgeStyle = "bg-slate-300 text-slate-800 border border-blue-900/30 shadow-[1px_1px_0px_#1E3A8A]";
  }

  const handleBorrow = async () => {
    setIsLoading(true);

    try {
      const response = await api.post(
        "/api/borrowings",
        { archiveId: archive.id }
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
        error.response?.data?.message || "Terjadi kesalahan pada sistem.";

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
      <DialogContent className="sm:max-w-[500px] p-8 border border-blue-900/30 shadow-[2px_2px_0px_#1E3A8A] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-blue-900 leading-tight uppercase">
            {archive.title}
          </DialogTitle>
          <DialogDescription className="font-bold text-slate-500 mt-2">
            {archive.archiveType} • {archive.category}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-black text-blue-900 uppercase">Penulis</div>
            <div className="col-span-2 font-bold text-slate-800">{archive.author}</div>

            <div className="font-black text-blue-900 uppercase">Tahun</div>
            <div className="col-span-2 font-bold text-slate-800">{archive.year}</div>

            <div className="font-black text-blue-900 uppercase">Status</div>
            <div className="col-span-2">
              <Badge className={badgeStyle}>
                {displayStatus}
              </Badge>
            </div>

            <div className="font-black text-blue-900 uppercase">Sisa Stok</div>
            <div className="col-span-2 font-bold text-slate-800">
              {/* Tampilkan sisa stok */}
              {availableStock} dari {archive.quantity} Eksemplar
            </div>

            <div className="font-black text-blue-900 uppercase">Lokasi Rak</div>
            <div className="col-span-2 font-bold text-slate-800">
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
            className={`w-full font-bold transition-all ${
              isRequestedByMe
                ? "bg-slate-200 text-slate-500 opacity-100" // STATE 1: Milik Saya
                : isAvailable
                  ? "" // STATE 2: Tersedia (pakai default neobrutalist button)
                  : "bg-slate-200 text-slate-500 opacity-100" // STATE 3: Habis
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
