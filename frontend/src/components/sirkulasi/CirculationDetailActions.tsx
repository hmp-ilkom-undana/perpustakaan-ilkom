import {
  CheckCircle,
  XCircle,
  Camera,
  CheckSquare,
  UploadCloud,
  RefreshCw,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CircStatus } from "@/services/borrowing.service";
import type { ReturnCondition } from "@/hooks/usePetugasCirculationDetail";

interface CirculationDetailActionsProps {
  status: CircStatus;
  isSubmitting: boolean;
  isUploaded: boolean;
  selectedPhoto: File | null;
  returnCondition: ReturnCondition;
  returnNote: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputGalleryRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraOpen: () => void;
  onGalleryOpen: () => void;
  onResetPhoto: () => void;
  onReturnConditionChange: (cond: ReturnCondition) => void;
  onReturnNoteChange: (note: string) => void;
  onOpenAccModal: () => void;
  onOpenRejectModal: () => void;
  onConfirmHandover: () => void;
  onConfirmReturn: () => void;
}

export function CirculationDetailActions({
  status,
  isSubmitting,
  isUploaded,
  returnCondition,
  returnNote,
  fileInputRef,
  fileInputGalleryRef,
  onFileSelect,
  onCameraOpen,
  onGalleryOpen,
  onResetPhoto,
  onReturnConditionChange,
  onReturnNoteChange,
  onOpenAccModal,
  onOpenRejectModal,
  onConfirmHandover,
  onConfirmReturn,
}: CirculationDetailActionsProps) {
  return (
    <div className="p-4 md:p-6 bg-white border-2 border-blue-900 rounded-xl shadow-[4px_4px_0px_#1E3A8A] space-y-4">
      {/* Hidden inputs for camera/gallery */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileSelect}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputGalleryRef}
        onChange={onFileSelect}
      />

      {/* Skenario 1: REQUESTED */}
      {status === "REQUESTED" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="flex-1 font-black"
            onClick={onOpenRejectModal}
            disabled={isSubmitting}
          >
            <XCircle className="w-5 h-5 mr-1.5" /> Tolak Pengajuan
          </Button>

          <Button
            type="button"
            variant="success"
            size="lg"
            className="flex-1 font-black"
            onClick={onOpenAccModal}
            disabled={isSubmitting}
          >
            <CheckCircle className="w-5 h-5 mr-1.5" /> ACC (Tersedia)
          </Button>
        </div>
      )}

      {/* Skenario 2: WAITING_PICKUP */}
      {status === "WAITING_PICKUP" && (
        <div className="flex flex-col gap-3">
          {!isUploaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={onCameraOpen}
                disabled={isSubmitting}
                className="font-black"
              >
                <Camera className="w-5 h-5 mr-2" /> Buka Kamera
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onGalleryOpen}
                disabled={isSubmitting}
                className="font-black"
              >
                <UploadCloud className="w-5 h-5 mr-2" /> Upload File Foto
              </Button>
            </div>
          ) : (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 fade-in">
              <div className="flex items-center justify-between gap-2 p-3 bg-emerald-50 border-2 border-emerald-600 rounded-lg text-xs font-bold text-emerald-900 shadow-[2px_2px_0px_#059669]">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>Foto Berhasil Diunggah</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={onResetPhoto}
                  className="text-emerald-800 hover:text-emerald-950 font-bold"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Ganti
                </Button>
              </div>

              <Button
                type="button"
                variant="success"
                size="lg"
                onClick={onConfirmHandover}
                disabled={isSubmitting}
                className="w-full font-black text-base"
              >
                <CheckSquare className="w-5 h-5 mr-2" />
                {isSubmitting ? "Memproses..." : "Konfirmasi Serah Terima"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Skenario 3 & 4: BORROWED / OVERDUE (PENGEMBALIAN) */}
      {(status === "BORROWED" || status === "OVERDUE") && (
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-blue-950 block">
              Kondisi Fisik Arsip saat Dikembalikan
            </label>
            <select
              value={returnCondition}
              onChange={(e) => {
                onReturnConditionChange(e.target.value as ReturnCondition);
                // Reset photo if switching to HILANG
                if (e.target.value === "HILANG") {
                  onResetPhoto();
                }
              }}
              className="w-full border-2 border-blue-900 rounded-lg p-3 text-xs md:text-sm font-bold text-blue-950 bg-white shadow-[2px_2px_0px_#1E3A8A] focus:shadow-[4px_4px_0px_#F97316] focus:border-orange-500 outline-none"
            >
              <option value="BAIK">Bagus / Baik (Lengkap Tanpa Cacat)</option>
              <option value="RUSAK">Rusak (Halaman Robek / Cacat Fisik)</option>
              <option value="HILANG">Hilang (Tidak Ditemukan / Hilang)</option>
            </select>
          </div>

          {/* KONDISI 1: HILANG (Physical Book is Lost) */}
          {returnCondition === "HILANG" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Informational Callout */}
              <div className="p-4 bg-amber-50 border-2 border-amber-500 rounded-xl shadow-[3px_3px_0px_#D97706] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-heading font-black text-amber-950 uppercase tracking-wide">
                    Pelaporan Arsip Hilang
                  </p>
                  <p className="text-xs font-semibold text-amber-850 leading-relaxed text-amber-900">
                    Foto fisik tidak diperlukan karena berkas hilang. Sistem akan otomatis mencatat denda ganti rugi arsip dan memperbarui status menjadi <strong>HILANG</strong>.
                  </p>
                </div>
              </div>

              {/* Mandatory Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
                  Catatan Kronologi Kehilangan <span className="text-rose-600">*</span>
                </label>
                <textarea
                  value={returnNote}
                  onChange={(e) => onReturnNoteChange(e.target.value)}
                  placeholder="Wajib diisi: Tuliskan kronologi pelaporan kehilangan dari mahasiswa..."
                  className="w-full border-2 border-amber-600 bg-amber-50/40 rounded-lg p-3 text-xs md:text-sm font-semibold text-amber-950 shadow-[2px_2px_0px_#D97706] focus:shadow-[4px_4px_0px_#D97706] outline-none"
                  rows={3}
                />
              </div>
              {/* Direct Confirm Button */}
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={onConfirmReturn}
                disabled={isSubmitting || returnNote.trim() === ""}
                className="w-full font-black text-base mt-2 shadow-[4px_4px_0px_#991B1B]"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                {isSubmitting
                  ? "Memproses..."
                  : "Konfirmasi Arsip Hilang & Proses Denda"}
              </Button>
            </div>
          ) : (
            /* KONDISI 2: BAIK / RUSAK (Physical Book Exists) */
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
              {returnCondition === "RUSAK" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                    Catatan Kerusakan Fisik <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    value={returnNote}
                    onChange={(e) => onReturnNoteChange(e.target.value)}
                    placeholder="Wajib diisi: Tuliskan detail kerusakan (contoh: halaman 12-15 robek, cover basah)..."
                    className="w-full border-2 border-rose-600 bg-rose-50/50 rounded-lg p-3 text-xs md:text-sm font-semibold text-rose-950 shadow-[2px_2px_0px_#E11D48] outline-none"
                    rows={2}
                  />
                </div>
              )}

              {!isUploaded ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    onClick={onCameraOpen}
                    disabled={isSubmitting}
                    className="font-black"
                  >
                    <Camera className="w-5 h-5 mr-2" /> Buka Kamera
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onGalleryOpen}
                    disabled={isSubmitting}
                    className="font-black"
                  >
                    <UploadCloud className="w-5 h-5 mr-2" /> Upload Foto Kondisi
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 animate-in slide-in-from-bottom-2 fade-in">
                  <div className="flex items-center justify-between gap-2 p-3 bg-emerald-50 border-2 border-emerald-600 rounded-lg text-xs font-bold text-emerald-900 shadow-[2px_2px_0px_#059669]">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      <span>Foto Kondisi Berhasil Diunggah</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={onResetPhoto}
                      className="text-emerald-800 hover:text-emerald-950 font-bold"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Ganti
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant={status === "OVERDUE" ? "navy" : "success"}
                    size="lg"
                    onClick={onConfirmReturn}
                    disabled={
                      isSubmitting ||
                      (returnCondition === "RUSAK" && returnNote.trim() === "")
                    }
                    className="w-full font-black text-base"
                  >
                    <CheckSquare className="w-5 h-5 mr-2" />
                    {isSubmitting
                      ? "Memproses..."
                      : status === "OVERDUE"
                      ? "Catat Lunas & Terima Pengembalian"
                      : "Konfirmasi Pengembalian Arsip"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
