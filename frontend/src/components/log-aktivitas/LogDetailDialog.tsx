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

  // Pre-filter metadata keys yang valid untuk ditampilkan
  const visibleMetadataEntries = hasMetadata
    ? Object.entries(metadata).filter(([key, value]) => {
        if (typeof value === "object" && value !== null) return false;
        return !isExcludedKey(key);
      })
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-5 border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A] overflow-hidden">
        <DialogHeader className="pb-3 border-b-2 border-blue-900">
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2">
              <Badge variant={isAdmin ? "navy" : "amber"}>
                {log.action}
              </Badge>
              <Badge variant="outline">
                {log.entity}
              </Badge>
            </div>
            <DialogDescription className="flex items-center gap-1 text-slate-500 font-semibold text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-900" />
              {formattedDate} WIB
            </DialogDescription>
          </div>
          <DialogTitle className="text-lg font-black text-blue-950 mt-1">
            Rincian Audit Log Aktivitas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          {/* BARIS 1: DIPROSES OLEH & RINGKASAN AKSI DALAM 2 KOLOM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* KARTU DIPROSES OLEH */}
            <div className="bg-slate-50 p-3 rounded-lg border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Diproses oleh
              </p>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-black text-xs sm:text-sm text-blue-950 truncate">
                    {log.userName}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 truncate">
                    {log.userEmail}
                  </p>
                </div>
                <div className="shrink-0">
                  {isAdmin ? (
                    <Badge variant="navy" className="gap-1 text-[10px] py-0.5 px-2">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="orange" className="gap-1 text-[10px] py-0.5 px-2">
                      <UserCheck className="w-3 h-3" />
                      Petugas
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* RINGKASAN AKSI */}
            <div className="bg-blue-50/50 p-3 rounded-lg border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-center">
              <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider mb-1">
                Ringkasan Aksi
              </p>
              <p className="text-xs font-semibold text-blue-950 leading-relaxed line-clamp-3">
                {log.description}
              </p>
            </div>
          </div>

          {/* BUKTI FOTO JIKA ADA */}
          {photoUrls.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-900" />
                Lampiran Foto Bukti Fisik
              </p>
              <div className="grid grid-cols-2 gap-2">
                {photoUrls.map((photo, i) => (
                  <div
                    key={i}
                    className="p-1.5 bg-white rounded-lg border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-2"
                  >
                    <div className="relative overflow-hidden rounded border border-slate-200 w-12 h-12 bg-slate-100 shrink-0">
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/100x100/e2e8f0/1e293b?text=Foto";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-slate-700 truncate">{photo.label}</p>
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-black text-blue-900 hover:text-orange-500 flex items-center gap-0.5 mt-0.5"
                      >
                        Buka Foto <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PARAMETER & NILAI TERKAIT */}
          {hasMetadata && visibleMetadataEntries.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Parameter & Nilai Terkait
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50/70 p-2.5 rounded-lg border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]">
                {visibleMetadataEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="p-2 bg-white rounded-md border border-slate-200 min-w-0"
                  >
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider truncate">
                      {formatMetadataLabel(key)}
                    </p>
                    <p
                      className="text-[11px] font-black text-blue-950 truncate mt-0.5"
                      title={formatMetadataValue(key, value)}
                    >
                      {formatMetadataValue(key, value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
