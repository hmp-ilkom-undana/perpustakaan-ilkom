import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  UserCheck,
  Clock,
  Code,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ActivityLogItem } from "@/services/activity-log.service";

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
  const [showRawJson, setShowRawJson] = useState(false);

  if (!log) return null;

  const isAdmin = log.userRole === "ADMIN";
  const metadata = log.metadata;
  const hasMetadata = metadata && typeof metadata === "object" && Object.keys(metadata).length > 0;

  // Format Tanggal
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
          {/* KARTU AKTOR / PELAKSANA */}
          <div className="bg-slate-50 p-4 rounded-xl border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] space-y-2">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Aktor Pelaksana
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
            {log.userId && (
              <p className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200">
                User ID: {log.userId}
              </p>
            )}
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
                  if (key.toLowerCase().includes("fotourl")) return null;

                  return (
                    <div
                      key={key}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {key}
                      </p>
                      <p className="text-xs font-black text-blue-950 truncate mt-0.5">
                        {String(value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TOGGLE RAW JSON */}
          {hasMetadata && (
            <div className="pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRawJson(!showRawJson)}
                className="w-full text-xs font-bold text-slate-500 hover:text-blue-950 justify-between h-8 px-2"
              >
                <span className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  Inspeksi Raw JSON Payload
                </span>
                {showRawJson ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </Button>

              {showRawJson && (
                <div className="mt-2 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl border-2 border-blue-900 overflow-x-auto max-h-48 shadow-[2px_2px_0px_#1E3A8A]">
                  <pre>{JSON.stringify(metadata, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="default"
            onClick={onClose}
            className="w-full sm:w-auto font-black text-xs border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            Tutup Rincian
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
