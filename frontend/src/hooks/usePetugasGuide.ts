import { useState, useMemo, useEffect, useCallback } from "react";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { useSession } from "@/lib/auth-client";

export interface PetugasConfigValues {
  pickupDuration: number;
  lateBase: number;
  lateThreshold: number;
  lateDaily: number;
  damagedFine: number;
  lostFine: number;
  formatRupiah: (amount: number) => string;
}

export interface PetugasGuideStep {
  step: number;
  iconName: string;
  colorKey: "blue" | "teal" | "violet" | "amber";
  title: string;
  subtitle: string;
  description: string;
}

const GUIDE_PETUGAS_PREFIX = "guide_petugas_";

export function usePetugasGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { data: session } = useSession();
  const { data: settings, isLoading } = useSystemSettingQuery();

  const guideKey = session?.user?.id
    ? `${GUIDE_PETUGAS_PREFIX}${session.user.id}`
    : null;

  useEffect(() => {
    if (!guideKey) return;
    const hasSeen = localStorage.getItem(guideKey);
    if (!hasSeen) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [guideKey]);

  const config = useMemo<PetugasConfigValues>(() => {
    const pickupDuration = settings?.pickupDurationDays ?? 3;
    const lateBase = settings?.lateBaseFine ?? 50000;
    const lateThreshold = settings?.lateThresholdDays ?? 7;
    const lateDaily = settings?.lateDailyFine ?? 10000;
    const damagedFine = settings?.damagedFine ?? 75000;
    const lostFine = settings?.lostFine ?? 100000;

    const formatRupiah = (amount: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);

    return {
      pickupDuration,
      lateBase,
      lateThreshold,
      lateDaily,
      damagedFine,
      lostFine,
      formatRupiah,
    };
  }, [settings]);

  const steps = useMemo<PetugasGuideStep[]>(() => {
    return [
      {
        step: 1,
        iconName: "ClipboardCheck",
        colorKey: "blue",
        title: "Kelola Pengajuan",
        subtitle: "Langkah 1 • Verifikasi Permintaan",
        description:
          "Tinjau pengajuan masuk di Tab MENUNGGU. Setujui jika arsip tersedia dan layak, atau tolak dengan alasan yang jelas.",
      },
      {
        step: 2,
        iconName: "ShieldCheck",
        colorKey: "teal",
        title: "Verifikasi Arsip Fisik",
        subtitle: "Langkah 2 • Pengecekan Kondisi",
        description:
          "Sebelum menyetujui, pastikan arsip ditemukan di rak dan kondisinya layak. Lakukan pengecekan ulang bersama mahasiswa saat serah terima.",
      },
      {
        step: 3,
        iconName: "Camera",
        colorKey: "violet",
        title: "Serah Terima & Foto",
        subtitle: "Langkah 3 • Dokumentasi Fisik",
        description:
          "Mahasiswa menunjukkan kode pengajuan. Cek kondisi fisik bersama, foto cover arsip sebagai bukti serah terima, lalu konfirmasi. Status arsip berubah menjadi DIPINJAM.",
      },
      {
        step: 4,
        iconName: "PackageCheck",
        colorKey: "amber",
        title: "Penerimaan Kembali",
        subtitle: "Langkah 4 • Pengembalian & Denda",
        description:
          "Pilih kondisi fisik arsip saat dikembalikan. Sistem menghitung denda secara otomatis berdasarkan kondisi dan durasi keterlambatan.",
      },
    ];
  }, []);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleOpen = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (guideKey) {
      localStorage.setItem(guideKey, "true");
    }
    setIsOpen(false);
    setTimeout(() => setCurrentStep(0), 300);
  }, [guideKey]);

  const handleNext = useCallback(() => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
    else handleClose();
  }, [isLastStep, handleClose]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  }, [isFirstStep]);

  return {
    isOpen,
    isLoading,
    config,
    steps,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    handleOpen,
    handleClose,
    handleNext,
    handlePrev,
  };
}
