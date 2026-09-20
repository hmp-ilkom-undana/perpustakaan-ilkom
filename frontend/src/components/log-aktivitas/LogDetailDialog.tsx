import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  UserCheck,
  Clock,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import type { ActivityLogItem } from "@/services/activity-log.service";
import { formatRupiah } from "@/lib/utils";

interface LogDetailDialogProps {
  log: ActivityLogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LogDetailDialog({
  log,
  isOpen,
  onClose,
}: LogDetailDialogProps) {
  if (!log) return null;

  const isAdmin = log.userRole === "ADMIN";
  const metadata = log.metadata;
  const hasMetadata = metadata && typeof metadata === "object" && Object.keys(metadata).length > 0;

  // Format Tanggal Indonesia
  const formattedDate = (() => {
    try {
      const d = new Date(log.createdAt);
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(d);
    } catch {
      return log.createdAt;
    }
  })();

  // Cek foto bukti jika ada di metadata
  const photoUrls: Array<{ label: string; url: string }> = [];
  if (hasMetadata) {
    if (metadata.fotoUrlPinjam) photoUrls.push({ label: "Foto Serah Terima", url: metadata.fotoUrlPinjam });
    if (metadata.fotoUrlKembali) photoUrls.push({ label: "Foto Pengembalian", url: metadata.fotoUrlKembali });
    if (metadata.fotoUrl) photoUrls.push({ label: "Foto Bukti Fisik", url: metadata.fotoUrl });
  }

  // Format Kamus Nama Key Metadata dengan spasi & Bahasa Indonesia
  const formatMetadataLabel = (rawKey: string): string => {
    const key = rawKey.toLowerCase().replace(/[^a-z0-9]/g, "");
    const dictionary: Record<string, string> = {
      pickupcode: "Kode Ambil",
      studentnim: "NIM Mahasiswa",
      studentname: "Nama Mahasiswa",
      archivetitle: "Judul Arsip",
      archivecode: "Kode Arsip",
      archivetype: "Jenis Arsip",
      fineamount: "Nominal Denda",
      paymentmethod: "Metode Bayar",
      condition: "Kondisi Fisik",
      rejectreason: "Alasan Penolakan",
      notes: "Catatan Tambahan",
      shelflocation: "Lokasi Rak",
      quantity: "Jumlah Stok",
      category: "Kategori Arsip",
      author: "Penulis / Pembuat",
      year: "Tahun Terbit",
      totalrows: "Total Baris",
      insertedcount: "Berhasil Diimpor",
      skippedcount: "Dilewati (Duplikat)",
      email: "Alamat Email",
      name: "Nama Lengkap",
      role: "Peran Akun",
      loandurationdays: "Durasi Pinjam (Hari)",
      pickupdeadlinehours: "Batas Ambil (Jam)",
      maxactiveskripsi: "Maks. Skripsi",
      maxactiveringkasan: "Maks. Ringkasan",
      maxactivenaskah: "Maks. Naskah",
      latebasefine: "Denda Pokok Terlambat",
      latedailyfine: "Denda Harian",
      latethresholddays: "Tenggat Hari",
      damagedfine: "Denda Kerusakan",
      lostfine: "Denda Kehilangan",
      adminwanumber: "No. WA Admin",
      admincontactname: "Nama Kontak Admin",
    };

    if (dictionary[key]) {
      return dictionary[key];
    }

    // Fallback: Pisahkan camelCase & snake_case menjadi kata dengan spasi
    return rawKey
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  // Format Nilai Metadata (Format Rupiah jika denda / nominal)
  const formatMetadataValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "-";
    const lowerKey = key.toLowerCase();
    if (
      (lowerKey.includes("fine") || lowerKey.includes("amount") || lowerKey.includes("nominal")) &&
      typeof value === "number"
    ) {
      return formatRupiah(value);
    }
    if (typeof value === "boolean") {
      return value ? "Ya" : "Tidak";
    }
    return String(value);
  };

  // Daftar Key yang disembunyikan (ID internal database, URL Foto, dan Judul Arsip redundan)
  const isExcludedKey = (rawKey: string): boolean => {
    const lower = rawKey.toLowerCase();
    return (
      lower.includes("fotourl") ||
      lower === "borrowingid" ||
      lower === "borrowing_id" ||
      lower === "id" ||
      lower === "transactionid" ||
      lower === "userid" ||
      lower === "petugasid" ||
      lower === "adminid" ||
      lower === "archiveid" ||
      lower === "entityid" ||
      lower === "archivetitle" ||
      lower === "title" ||
      lower === "judul"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isAdmin ? "navy" : "amber"}>
              {log.action}
            </Badge>
            <Badge variant="outline">
              {log.entity}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-black text-blue-950">
            Rincian Audit Log Aktivitas
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-slate-500 font-semibold text-xs">
            <Clock className="w-3.5 h-3.5" />
            {formattedDate} WIB
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* KARTU DIPROSES OLEH */}
          <div className="bg-slate-50 p-4 rounded-xl border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] space-y-2">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Diproses oleh
            </p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black text-sm text-blue-950">{log.userName}</p>
                <p className="text-xs font-semibold text-slate-500">{log.userEmail}</p>
              </div>
              <div className="shrink-0">
                {isAdmin ? (
                  <Badge variant="navy" className="gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge variant="orange" className="gap-1">
                    <UserCheck className="w-3 h-3" />
                    Petugas
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* DESKRIPSI UTAMA */}
          <div className="bg-blue-50/50 p-4 rounded-xl border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
            <p className="text-[11px] font-black text-blue-900 uppercase tracking-wider mb-1">
              Ringkasan Aksi
            </p>
            <p className="text-sm font-semibold text-blue-950 leading-relaxed">
              {log.description}
            </p>
          </div>

          {/* BUKTI FOTO JIKA ADA */}
          {photoUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-900" />
                Lampiran Foto Bukti Fisik
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {photoUrls.map((photo, i) => (
                  <div
                    key={i}
                    className="p-2 bg-white rounded-xl border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] space-y-1.5"
                  >
                    <p className="text-[11px] font-bold text-slate-700">{photo.label}</p>
                    <div className="relative group overflow-hidden rounded-lg border border-slate-200 aspect-video bg-slate-100 flex items-center justify-center">
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x250/e2e8f0/1e293b?text=Foto+Tidak+Tersedia";
                        }}
                      />
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-blue-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Buka Foto Asli
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* METADATA TERSTRUKTUR */}
          {hasMetadata && (
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Parameter & Nilai Terkait
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-xl border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
                {Object.entries(metadata).map(([key, value]) => {
                  if (typeof value === "object" && value !== null) return null;
                  if (isExcludedKey(key)) return null;

                  return (
                    <div
                      key={key}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {formatMetadataLabel(key)}
                      </p>
                      <p className="text-xs font-black text-blue-950 truncate mt-0.5">
                        {formatMetadataValue(key, value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
