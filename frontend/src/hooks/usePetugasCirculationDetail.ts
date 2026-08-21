import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { useBorrowingDetailQuery } from "@/hooks/queries/useBorrowingQuery";
import {
  useApproveBorrowingMutation,
  useRejectBorrowingMutation,
  useHandoverBorrowingMutation,
  useReturnBorrowingMutation,
} from "@/hooks/queries/useBorrowingMutation";

export type ReturnCondition = "BAIK" | "RUSAK" | "HILANG";

export function usePetugasCirculationDetail() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);

  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [returnCondition, setReturnCondition] = useState<ReturnCondition>("BAIK");
  const [returnNote, setReturnNote] = useState("");

  const { data: item, isPending: isLoading } = useBorrowingDetailQuery(id);

  const approveMutation = useApproveBorrowingMutation();
  const rejectMutation = useRejectBorrowingMutation();
  const handoverMutation = useHandoverBorrowingMutation();
  const returnMutation = useReturnBorrowingMutation();

  const isSubmitting =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    handoverMutation.isPending ||
    returnMutation.isPending;

  const navigateBack = useCallback(() => {
    const isApiPathAdmin = location.pathname.startsWith("/admin");
    navigate({ to: isApiPathAdmin ? "/admin/sirkulasi" : "/petugas/sirkulasi" });
  }, [location.pathname, navigate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB.");
        return;
      }
      setSelectedPhoto(file);
      setIsUploaded(true);
      toast.success("Foto berhasil dipilih dan siap diunggah!");
    }
  };

  const handleWebRTCCapture = (file: File) => {
    setSelectedPhoto(file);
    setIsUploaded(true);
    setShowCamera(false);
    toast.success("Foto berhasil dijepret dan siap diunggah!");
  };

  const handleCameraOpen = () => setShowCamera(true);
  const handleCameraClose = () => setShowCamera(false);

  const handleGalleryOpen = () => {
    if (fileInputGalleryRef.current) {
      fileInputGalleryRef.current.click();
    }
  };

  const resetPhoto = () => {
    setIsUploaded(false);
    setSelectedPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (fileInputGalleryRef.current) fileInputGalleryRef.current.value = "";
  };

  const handleApproveConfirm = async () => {
    if (!item) return;
    try {
      await approveMutation.mutateAsync(item.id);
      setIsAccModalOpen(false);
      navigateBack();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleRejectConfirm = async () => {
    if (!item || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: item.id, reason: rejectReason.trim() });
      setIsRejectModalOpen(false);
      navigateBack();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleHandoverConfirm = async () => {
    if (!item) return;
    try {
      const formData = new FormData();
      if (selectedPhoto) formData.append("photo", selectedPhoto);
      await handoverMutation.mutateAsync({ id: item.id, formData });
      navigateBack();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleReturnConfirm = async () => {
    if (!item) return;
    try {
      const formData = new FormData();
      if (selectedPhoto) formData.append("photo", selectedPhoto);
      formData.append("kondisiKembali", returnCondition);
      if (returnNote.trim()) formData.append("catatanKondisiKembali", returnNote.trim());
      await returnMutation.mutateAsync({ id: item.id, formData });
      resetPhoto();
      setReturnCondition("BAIK");
      setReturnNote("");
      navigateBack();
    } catch {
      // Error handled by mutation toast
    }
  };

  return {
    item,
    isLoading,
    isSubmitting,
    navigateBack,
    // Photo & Camera
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
    // Modal states
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
    // Confirm actions
    handleApproveConfirm,
    handleRejectConfirm,
    handleHandoverConfirm,
    handleReturnConfirm,
  };
}
