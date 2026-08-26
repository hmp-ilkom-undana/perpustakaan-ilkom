import { useState, useMemo } from "react";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";

export interface GuideHighlight {
  label: string;
  value: string;
}

export interface GuideStep {
  step: number;
  iconName: string;
  colorKey: "indigo" | "blue" | "teal" | "violet" | "amber";
  title: string;
  subtitle: string;
  description: string;
  highlights: [GuideHighlight, GuideHighlight];
}

export function useStudentGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { data: settings, isLoading } = useSystemSettingQuery();

  const steps = useMemo<GuideStep[]>(() => {
    const loanDuration = settings?.loanDurationDays ?? 30;
    const pickupDuration = settings?.pickupDurationDays ?? 3;
    const maxSkripsi = settings?.maxActiveSkripsi ?? 2;
    const maxRingkasan = settings?.maxActiveRingkasan ?? 1;
    const maxNaskah = settings?.maxActiveNaskah ?? 1;
    const lateBase = settings?.lateBaseFine ?? 50000;
    const lateThreshold = settings?.lateThresholdDays ?? 7;
    const lateDaily = settings?.lateDailyFine ?? 10000;
    const damaged = settings?.damagedFine ?? 75000;
    const lost = settings?.lostFine ?? 100000;

    const formatRupiah = (amount: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);

    return [
      {
        step: 1,
        iconName: "Search",
        colorKey: "indigo",
        title: "Cari & Pilih Arsip",
        subtitle: "Browse the Catalog",
        description:
          "Buka halaman Katalog, temukan arsip yang kamu butuhkan, lalu klik tombol 'Ajukan Pinjam'.",
        highlights: [
          {
            label: "Maks. Skripsi / Ringkasan / Naskah",
            value: `${maxSkripsi} / ${maxRingkasan} / ${maxNaskah} arsip`,
          },
          { label: "Syarat", value: "Tidak ada tanggungan aktif" },
        ],
      },
      {
        step: 2,
        iconName: "ClipboardList",
        colorKey: "blue",
        title: "Pengajuan Terkirim",
        subtitle: "Request Submitted",
        description:
          "Pengajuanmu berhasil dikirim! Kode pengajuan bisa kamu lihat di Beranda → Aktivitas atau halaman Peminjaman.",
        highlights: [
          { label: "Simpan Kode Ini", value: "Dibutuhkan saat pengambilan" },
          { label: "Cek Status di", value: "Beranda / Halaman Peminjaman" },
        ],
      },
      {
        step: 3,
        iconName: "ShieldCheck",
        colorKey: "teal",
        title: "Menunggu Verifikasi",
        subtitle: "Pending Admin Approval",
        description:
          "Petugas akan memeriksa ketersediaan dan kondisi arsip. Kamu akan dinotifikasi setelah pengajuan disetujui.",
        highlights: [
          { label: "Status Awal", value: "MENUNGGU → DISETUJUI" },
          { label: "Jika Ditolak", value: "Cek alasan di detail pengajuan" },
        ],
      },
      {
        step: 4,
        iconName: "QrCode",
        colorKey: "violet",
        title: "Pengambilan di Ruang HMP",
        subtitle: "Physical Pickup & Handover",
        description:
          "Datang ke ruang HMP, tunjukkan kode pengajuan ke petugas. Serah terima dibuktikan dengan foto cover arsip.",
        highlights: [
          {
            label: "Batas Pengambilan",
            value: `${pickupDuration} hari kerja setelah ACC`,
          },
          {
            label: "Lewat Batas",
            value: "Pengajuan otomatis dibatalkan",
          },
        ],
      },
      {
        step: 5,
        iconName: "AlertTriangle",
        colorKey: "amber",
        title: "Masa Pinjam & Pengembalian",
        subtitle: "Loan Period & Return Policy",
        description:
          "Kembalikan arsip ke ruang HMP sebelum jatuh tempo. Denda berjalan jika terlambat, rusak, atau hilang.",
        highlights: [
          {
            label: "Durasi Pinjam",
            value: `${loanDuration} hari kalender`,
          },
          {
            label: "Denda Terlambat",
            value: `${formatRupiah(lateBase)} flat ≤${lateThreshold} hari, +${formatRupiah(lateDaily)}/hari sesudahnya`,
          },
        ],
      },
    ];
  }, [settings]);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleOpen = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setCurrentStep(0), 300);
  };

  const handleNext = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
    else handleClose();
  };

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  return {
    isOpen,
    isLoading,
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
