import {
  Search,
  ClipboardList,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  GraduationCap,
  FileText,
  ScrollText,
  CheckCircle2,
  Clock,
  Camera,
  CalendarClock,
  ArrowRight,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideStep, SystemConfigValues } from "@/hooks/useStudentGuide";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Search,
  ClipboardList,
  ShieldCheck,
  QrCode,
  AlertTriangle,
};

const COLOR_MAP: Record<
  GuideStep["colorKey"],
  {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
  }
> = {
  indigo: {
    bg: "bg-indigo-50/60",
    border: "border-blue-900",
    iconBg: "bg-amber-400",
    iconColor: "text-blue-950",
    badgeBg: "bg-indigo-100 text-blue-950",
  },
  blue: {
    bg: "bg-blue-50/60",
    border: "border-blue-900",
    iconBg: "bg-sky-400",
    iconColor: "text-blue-950",
    badgeBg: "bg-blue-100 text-blue-950",
  },
  teal: {
    bg: "bg-teal-50/60",
    border: "border-blue-900",
    iconBg: "bg-emerald-400",
    iconColor: "text-blue-950",
    badgeBg: "bg-teal-100 text-teal-950",
  },
  violet: {
    bg: "bg-violet-50/60",
    border: "border-blue-900",
    iconBg: "bg-violet-300",
    iconColor: "text-blue-950",
    badgeBg: "bg-violet-100 text-violet-950",
  },
  amber: {
    bg: "bg-amber-50/60",
    border: "border-blue-900",
    iconBg: "bg-orange-400",
    iconColor: "text-blue-950",
    badgeBg: "bg-amber-100 text-amber-950",
  },
};

interface GuideStepContentProps {
  step: GuideStep;
  config: SystemConfigValues;
}

export function GuideStepContent({ step, config }: GuideStepContentProps) {
  const Icon = ICON_MAP[step.iconName] ?? Search;
  const colors = COLOR_MAP[step.colorKey];

  return (
    <div className="flex flex-col gap-4">
      {/* ================= HERO BANNER ================= */}
      <div
        className={cn(
          "flex items-center gap-3.5 p-3.5 rounded-xl border-2 shadow-[3px_3px_0px_#1E3A8A]",
          colors.bg,
          colors.border,
        )}
      >
        <div
          className={cn(
            "w-11 h-11 rounded-lg border-2 border-blue-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1E3A8A]",
            colors.iconBg,
          )}
        >
          <Icon className={cn("w-5 h-5", colors.iconColor)} strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block leading-none mb-1">
            {step.subtitle}
          </span>
          <h3 className="text-base font-black text-blue-950 tracking-tight leading-tight">
            {step.title}
          </h3>
        </div>
      </div>

      {/* ================= DESKRIPSI ================= */}
      <p className="text-xs font-medium text-slate-600 leading-relaxed px-0.5">
        {step.description}
      </p>

      {/* ================= STEP-SPECIFIC MICRO UI ================= */}
      {step.step === 1 && (
        <div className="space-y-3 pt-1">
          {/* Header Kuota */}
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
              Batas Kuota Pinjaman Aktif
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-950 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]">
              Per Kategori
            </span>
          </div>

          {/* 3 Bento Cards for Categories */}
          <div className="grid grid-cols-3 gap-2">
            {/* Skripsi */}
            <div className="flex flex-col items-center justify-between p-2.5 rounded-xl border-2 border-blue-900 bg-amber-50/80 shadow-[2px_2px_0px_#1E3A8A] text-center">
              <div className="w-7 h-7 rounded-lg bg-amber-300 border border-blue-900 flex items-center justify-center mb-1 shadow-[1px_1px_0px_#1E3A8A]">
                <GraduationCap className="w-4 h-4 text-blue-950" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Skripsi
              </span>
              <span className="text-sm font-black text-blue-950 leading-none mt-1">
                {config.maxSkripsi}{" "}
                <span className="text-[10px] font-bold text-slate-600">
                  Arsip
                </span>
              </span>
            </div>

            {/* Ringkasan */}
            <div className="flex flex-col items-center justify-between p-2.5 rounded-xl border-2 border-blue-900 bg-sky-50/80 shadow-[2px_2px_0px_#1E3A8A] text-center">
              <div className="w-7 h-7 rounded-lg bg-sky-300 border border-blue-900 flex items-center justify-center mb-1 shadow-[1px_1px_0px_#1E3A8A]">
                <FileText className="w-4 h-4 text-blue-950" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Ringkasan
              </span>
              <span className="text-sm font-black text-blue-950 leading-none mt-1">
                {config.maxRingkasan}{" "}
                <span className="text-[10px] font-bold text-slate-600">
                  Arsip
                </span>
              </span>
            </div>

            {/* Naskah */}
            <div className="flex flex-col items-center justify-between p-2.5 rounded-xl border-2 border-blue-900 bg-emerald-50/80 shadow-[2px_2px_0px_#1E3A8A] text-center">
              <div className="w-7 h-7 rounded-lg bg-emerald-300 border border-blue-900 flex items-center justify-center mb-1 shadow-[1px_1px_0px_#1E3A8A]">
                <ScrollText className="w-4 h-4 text-blue-950" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Naskah
              </span>
              <span className="text-sm font-black text-blue-950 leading-none mt-1">
                {config.maxNaskah}{" "}
                <span className="text-[10px] font-bold text-slate-600">
                  Arsip
                </span>
              </span>
            </div>
          </div>

          {/* Syarat Box */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A]">
            <div className="w-6 h-6 rounded-md bg-emerald-100 border border-blue-900 flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#1E3A8A]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
            </div>
            <div className="text-xs min-w-0">
              <span className="font-black text-blue-950 block">
                Syarat Pengajuan:
              </span>
              <span className="text-slate-600 font-medium leading-relaxed block">
                Akun bebas dari tunggakan denda aktif atau keterlambatan arsip
                lain.
              </span>
            </div>
          </div>
        </div>
      )}

      {step.step === 2 && (
        <div className="space-y-3 pt-1">
          {/* Mock Code Preview */}
          <div className="p-3.5 rounded-xl border-2 border-blue-900 bg-blue-50/70 shadow-[2px_2px_0px_#1E3A8A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                Format Kode Pengajuan
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-blue-950 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]">
                Wajib Disimpan
              </span>
            </div>
            <div className="p-2.5 rounded-lg border-2 border-blue-900 bg-white shadow-[1px_1px_0px_#1E3A8A] flex items-center justify-between">
              <span className="font-mono text-sm font-black text-blue-950 tracking-wider">
                REQ-2026-XXXXX
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Dibuat Otomatis
              </span>
            </div>
          </div>

          {/* Lokasi Cek Kode */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lokasi 1
                </span>
                <span className="text-[11px] sm:text-xs font-black text-blue-950 block mt-0.5 leading-snug">
                  Beranda (Aktivitas)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1.5 block">
                Card ringkasan status
              </span>
            </div>
            <div className="p-2.5 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lokasi 2
                </span>
                <span className="text-[11px] sm:text-xs font-black text-blue-950 block mt-0.5 leading-snug">
                  Menu Peminjaman
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1.5 block">
                Detail kartu & barcode
              </span>
            </div>
          </div>
        </div>
      )}

      {step.step === 3 && (
        <div className="space-y-3 pt-1">
          {/* Status Pipeline */}
          <div className="p-3.5 rounded-xl border-2 border-blue-900 bg-teal-50/70 shadow-[2px_2px_0px_#1E3A8A] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900 block">
              Alur Perubahan Status
            </span>
            <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-lg border-2 border-blue-900 shadow-[1px_1px_0px_#1E3A8A]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-black text-amber-800">
                  MENUNGGU
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-900 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-black text-emerald-800">
                  DISETUJUI ✓
                </span>
              </div>
            </div>
          </div>

          {/* Detail Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Estimasi Verifikasi
                </span>
                <span className="text-xs font-black text-blue-950 block mt-0.5">
                  Maks. 1x24 Jam
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1.5 block">
                Pada hari kerja
              </span>
            </div>
            <div className="p-2.5 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Jika Ditolak
                </span>
                <span className="text-xs font-black text-rose-700 block mt-0.5">
                  Alasan Tertera
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1.5 block">
                Pada detail pengajuan
              </span>
            </div>
          </div>
        </div>
      )}

      {step.step === 4 && (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-2">
            {/* Batas Pengambilan */}
            <div className="p-3 rounded-xl border-2 border-blue-900 bg-amber-50/80 shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-900 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-wider">
                  Tenggat Ambil
                </span>
              </div>
              <div>
                <span className="text-sm font-black text-blue-950 block leading-tight">
                  {config.pickupDuration} Hari Kerja
                </span>
                <span className="text-[9px] text-rose-700 font-bold mt-1 block">
                  Batal jika terlewat
                </span>
              </div>
            </div>

            {/* Foto Serah Terima */}
            <div className="p-3 rounded-xl border-2 border-blue-900 bg-violet-50/80 shadow-[2px_2px_0px_#1E3A8A] flex flex-col justify-between">
              <div className="flex items-center gap-1 text-violet-900 mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-wider">
                  Dokumentasi
                </span>
              </div>
              <div>
                <span className="text-xs font-black text-blue-950 block leading-tight">
                  Foto Cover Fisik
                </span>
                <span className="text-[9px] text-slate-600 font-medium mt-1 block">
                  Di ruang HMP ILKOM
                </span>
              </div>
            </div>
          </div>

          {/* Status Note */}
          <div className="p-2.5 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              Status setelah foto serah terima:
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-900 text-white border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]">
              DIPINJAM ✓
            </span>
          </div>
        </div>
      )}

      {step.step === 5 && (
        <div className="space-y-3 pt-1">
          {/* Masa Pinjam Card */}
          <div className="p-2.5 rounded-xl border-2 border-blue-900 bg-emerald-50/80 shadow-[2px_2px_0px_#1E3A8A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-300 border border-blue-900 flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
                <CalendarClock className="w-4 h-4 text-blue-950" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">
                  Masa Pinjam Aktif
                </span>
                <span className="text-xs font-black text-blue-950 leading-tight block">
                  {config.loanDuration} Hari Kalender
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-200 text-emerald-950 border border-emerald-800">
              Tertib & Aman
            </span>
          </div>

          {/* Denda Keterlambatan Berjenjang */}
          <div className="p-3 rounded-xl border-2 border-blue-900 bg-rose-50/70 shadow-[2px_2px_0px_#1E3A8A] space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Skema Denda Keterlambatan (Hari Kerja)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white p-2 rounded-lg border border-blue-900 text-center shadow-[1px_1px_0px_#1E3A8A]">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">
                  1 – {config.lateThreshold} Hari
                </span>
                <span className="text-xs font-black text-rose-600 block my-0.5">
                  {config.formatRupiah(config.lateBase)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold block">
                  Tarif Awal
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-900 text-center shadow-[1px_1px_0px_#1E3A8A]">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">
                  &gt; {config.lateThreshold} Hari
                </span>
                <span className="text-xs font-black text-rose-600 block my-0.5">
                  +{config.formatRupiah(config.lateDaily)}
                  <span className="text-[9px] text-slate-500">/hr</span>
                </span>
                <span className="text-[9px] text-slate-400 font-semibold block">
                  Akumulatif
                </span>
              </div>
            </div>
          </div>

          {/* Denda Fisik */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg border border-blue-900 bg-white shadow-[1px_1px_0px_#1E3A8A] text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Kerusakan
              </span>
              <span className="text-xs font-black text-blue-950">
                {config.formatRupiah(config.damagedFine)}
              </span>
            </div>
            <div className="p-2 rounded-lg border border-blue-900 bg-white shadow-[1px_1px_0px_#1E3A8A] text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Kehilangan
              </span>
              <span className="text-xs font-black text-blue-950">
                {config.formatRupiah(config.lostFine)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
