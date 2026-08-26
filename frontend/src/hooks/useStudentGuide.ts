import { useState, useMemo, useEffect, useCallback } from "react";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { useSession } from "@/lib/auth-client";

export interface SystemConfigValues {
  loanDuration: number;
  pickupDuration: number;
  maxSkripsi: number;
  maxRingkasan: number;
  maxNaskah: number;
  lateBase: number;
  lateThreshold: number;
  lateDaily: number;
  damagedFine: number;
  lostFine: number;
  formatRupiah: (amount: number) => string;
}

export interface GuideStep {
  step: number;
  iconName: string;
  colorKey: "indigo" | "blue" | "teal" | "violet" | "amber";
  title: string;
  subtitle: string;
  description: string;
}

const GUIDE_SEEN_PREFIX = "guide_seen_";

export function useStudentGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { data: session } = useSession();
  const { data: settings, isLoading } = useSystemSettingQuery();

  const guideKey = session?.user?.id
    ? `${GUIDE_SEEN_PREFIX}${session.user.id}`
    : null;

  useEffect(() => {
    if (!guideKey) return;
    const hasSeen = localStorage.getItem(guideKey);
    if (!hasSeen) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [guideKey]);

  const config = useMemo<SystemConfigValues>(() => {
    const loanDuration = settings?.loanDurationDays ?? 30;
    const pickupDuration = settings?.pickupDurationDays ?? 3;
    const maxSkripsi = settings?.maxActiveSkripsi ?? 2;
    const maxRingkasan = settings?.maxActiveRingkasan ?? 1;
    const maxNaskah = settings?.maxActiveNaskah ?? 1;
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
      loanDuration,
      pickupDuration,
      maxSkripsi,
      maxRingkasan,
      maxNaskah,
      lateBase,
      lateThreshold,
      lateDaily,
      damagedFine,
      lostFine,
      formatRupiah,
    };
  }, [settings]);

  const steps = useMemo<GuideStep[]>(() => {
    return [
      {
        step: 1,
        iconName: "Search",
        colorKey: "indigo",
        title: "Cari & Pilih Arsip",
        subtitle: "Langkah 1 • Penelusuran Katalog",
        description:
          "Jelajahi koleksi arsip di halaman Katalog. Setiap mahasiswa memiliki kuota peminjaman aktif sesuai kategori dokumen.",
      },
      {
        step: 2,
        iconName: "ClipboardList",
        colorKey: "blue",
        title: "Pengajuan & Kode Unik",
        subtitle: "Langkah 2 • Bukti Pengajuan",
        description:
          "Setelah mengajukan, sistem menerbitkan kode pengajuan unik. Simpan kode ini untuk ditunjukkan saat pengambilan fisik.",
      },
      {
        step: 3,
        iconName: "ShieldCheck",
        colorKey: "teal",
        title: "Verifikasi Petugas",
        subtitle: "Langkah 3 • Validasi Dokumen",
        description:
          "Petugas memeriksa fisik dan kelayakan arsip sebelum menyetujui peminjaman dalam standar waktu operasional.",
      },
      {
        step: 4,
        iconName: "QrCode",
        colorKey: "violet",
        title: "Pengambilan di Ruang HMP",
        subtitle: "Langkah 4 • Serah Terima Fisik",
        description:
          "Datang ke ruang HMP tepat waktu. Serah terima didokumentasikan melalui foto cover arsip bersama petugas.",
      },
      {
        step: 5,
        iconName: "AlertTriangle",
        colorKey: "amber",
        title: "Masa Pinjam & Pengembalian",
        subtitle: "Langkah 5 • Tanggung Jawab & Denda",
        description:
          "Kembalikan arsip sebelum batas jatuh tempo untuk menghindari denda berjenjang, kerusakan, atau kehilangan.",
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
