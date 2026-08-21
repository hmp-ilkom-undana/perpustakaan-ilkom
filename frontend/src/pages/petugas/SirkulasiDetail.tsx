import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/CameraCapture";
import { usePetugasCirculationDetail } from "@/hooks/usePetugasCirculationDetail";
import {
  CirculationDetailHeader,
  CirculationBorrowerSection,
  CirculationArchiveSection,
  CirculationAuditSection,
  CirculationOverdueSection,
  CirculationDetailActions,
  CirculationApproveDialog,
  CirculationRejectDialog,
} from "@/components/sirkulasi";

export default function SirkulasiDetail() {
  const {
    item,
    isLoading,
    isSubmitting,
    navigateBack,
    selectedPhoto,
    isUploaded,
    showCamera,
    fileInputRef,
    fileInputGalleryRef,
    handleFileSelect,
    handleWebRTCCapture,
    handleCameraOpen,
    handleCameraClose,
    handleGalleryOpen,
    resetPhoto,
    isAccModalOpen,
    setIsAccModalOpen,
    isRejectModalOpen,
    setIsRejectModalOpen,
    rejectReason,
    setRejectReason,
    returnCondition,
    setReturnCondition,
    returnNote,
    setReturnNote,
    handleApproveConfirm,
    handleRejectConfirm,
    handleHandoverConfirm,
    handleReturnConfirm,
  } = usePetugasCirculationDetail();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 animate-in fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-blue-950" />
        <p className="text-xs font-bold text-slate-500">
          Memuat data detail transaksi sirkulasi...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8 text-center border-2 border-rose-600 rounded-xl bg-rose-50 shadow-[4px_4px_0px_#E11D48] max-w-md mx-auto my-12">
        <p className="font-heading font-black text-rose-700 text-lg">
          Transaksi Tidak Ditemukan!
        </p>
        <p className="text-xs font-semibold text-rose-600 mt-1">
          ID transaksi ini mungkin sudah dihapus atau tidak valid.
        </p>
        <Button
          variant="outline"
          className="mt-4 font-black"
          onClick={navigateBack}
        >
          Kembali ke Sirkulasi
        </Button>
      </div>
    );
  }

  const pickupCode =
    item.pickupCode || `PK-${item.id.substring(0, 6).toUpperCase()}`;

  return (
    <>
      {showCamera && (
        <CameraCapture
          onCapture={handleWebRTCCapture}
          onCancel={handleCameraClose}
        />
      )}

      <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-4xl mx-auto">
        {/* 1. Header Detail */}
        <CirculationDetailHeader
          pickupCode={pickupCode}
          status={item.status}
          onBack={navigateBack}
        />

        {/* 2. Informasi Peminjam */}
        <CirculationBorrowerSection
          studentName={item.studentName}
          studentId={item.studentId}
        />

        {/* 3. Informasi Arsip */}
        <CirculationArchiveSection
          archiveTitle={item.archiveTitle}
          archiveType={item.archiveType}
          requestDate={item.requestDate}
        />

        {/* 4. Warning Overdue (Jika ada) */}
        {item.status === "OVERDUE" && (
          <CirculationOverdueSection dueDate={item.dueDate} fine={item.fine} />
        )}

        {/* 5. Audit Trail */}
        <CirculationAuditSection
          approvedBy={item.approvedBy}
          handoverBy={item.handoverBy}
        />

        {/* 6. Action Center */}
        <CirculationDetailActions
          status={item.status}
          isSubmitting={isSubmitting}
          isUploaded={isUploaded}
          selectedPhoto={selectedPhoto}
          returnCondition={returnCondition}
          returnNote={returnNote}
          fileInputRef={fileInputRef}
          fileInputGalleryRef={fileInputGalleryRef}
          onFileSelect={handleFileSelect}
          onCameraOpen={handleCameraOpen}
          onGalleryOpen={handleGalleryOpen}
          onResetPhoto={resetPhoto}
          onReturnConditionChange={setReturnCondition}
          onReturnNoteChange={setReturnNote}
          onOpenAccModal={() => setIsAccModalOpen(true)}
          onOpenRejectModal={() => setIsRejectModalOpen(true)}
          onConfirmHandover={handleHandoverConfirm}
          onConfirmReturn={handleReturnConfirm}
        />

        {/* 7. Dialog Konfirmasi ACC */}
        <CirculationApproveDialog
          isOpen={isAccModalOpen}
          onOpenChange={setIsAccModalOpen}
          onConfirm={handleApproveConfirm}
          isSubmitting={isSubmitting}
        />

        {/* 8. Dialog Penolakan */}
        <CirculationRejectDialog
          isOpen={isRejectModalOpen}
          onOpenChange={setIsRejectModalOpen}
          rejectReason={rejectReason}
          onRejectReasonChange={setRejectReason}
          onConfirm={handleRejectConfirm}
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
}
