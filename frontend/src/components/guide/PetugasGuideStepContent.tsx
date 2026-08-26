import {
  ClipboardCheck,
  ShieldCheck,
  Camera,
  PackageCheck,
  CheckCircle,
  XCircle,
  UploadCloud,
  CheckSquare,
  Clock,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import type { PetugasGuideStep, PetugasConfigValues } from "@/hooks/usePetugasGuide";

interface PetugasGuideStepContentProps {
  step: PetugasGuideStep;
  config: PetugasConfigValues;
}

const iconMap: Record<string, React.ElementType> = {
  ClipboardCheck,
  ShieldCheck,
  Camera,
  PackageCheck,
};

const colorMap: Record<
  PetugasGuideStep["colorKey"],
  { bg: string; border: string; text: string; badge: string; shadow: string }
> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-700",
    text: "text-blue-900",
    badge: "bg-blue-100 border-blue-700 text-blue-900",
    shadow: "shadow-[2px_2px_0px_#1D4ED8]",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-700",
    text: "text-teal-900",
    badge: "bg-teal-100 border-teal-700 text-teal-900",
    shadow: "shadow-[2px_2px_0px_#0F766E]",
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-700",
    text: "text-violet-900",
    badge: "bg-violet-100 border-violet-700 text-violet-900",
    shadow: "shadow-[2px_2px_0px_#6D28D9]",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-600",
    text: "text-amber-900",
    badge: "bg-amber-100 border-amber-600 text-amber-900",
    shadow: "shadow-[2px_2px_0px_#D97706]",
  },
};

function Step1Content({ config }: { config: PetugasConfigValues }) {
  return (
    <div className="space-y-3">
      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 shadow-[2px_2px_0px_#059669] flex flex-col justify-between">
          <div>
            <CheckCircle className="w-4 h-4 text-emerald-700 mb-1" />
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block">
              ACC
            </span>
          </div>
          <span className="text-[10px] text-emerald-800 font-medium leading-tight mt-1.5 block">
            Arsip tersedia & layak dipinjam
          </span>
        </div>
        <div className="p-2.5 rounded-xl border-2 border-rose-600 bg-rose-50 shadow-[2px_2px_0px_#DC2626] flex flex-col justify-between">
          <div>
            <XCircle className="w-4 h-4 text-rose-700 mb-1" />
            <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider block">
              TOLAK
            </span>
          </div>
          <span className="text-[10px] text-rose-800 font-medium leading-tight mt-1.5 block">
            Arsip tidak ada atau tidak layak
          </span>
        </div>
      </div>

      {/* Deadline Info */}
      <div className="p-3 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A]">
        <div className="flex items-center gap-2 mb-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Batas Pengambilan Setelah ACC
          </span>
        </div>
        <span className="text-sm font-black text-blue-950">
          {config.pickupDuration} Hari Kerja
        </span>
        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
          Mahasiswa wajib mengambil arsip dalam batas waktu ini
        </p>
      </div>

      {/* Lokasi */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-blue-900 bg-slate-50 shadow-[1px_1px_0px_#1E3A8A]">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lokasi:</span>
        <span className="text-xs font-black text-blue-950">Sirkulasi → Tab MENUNGGU</span>
      </div>
    </div>
  );
}

function Step2Content() {
  return (
    <div className="space-y-3">
      {/* Checklist Verifikasi */}
      <div className="p-3 rounded-xl border-2 border-teal-700 bg-teal-50 shadow-[2px_2px_0px_#0F766E] space-y-2">
        <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider block">
          Checklist Sebelum ACC
        </span>
        {[
          "Arsip ditemukan di rak",
          "Cover dan isi tidak rusak",
          "Tidak ada halaman hilang",
          "Kondisi layak dipinjam",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
            <span className="text-[11px] font-semibold text-teal-900">{item}</span>
          </div>
        ))}
      </div>

      {/* SLA Verifikasi */}
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
              Jika Tidak Layak
            </span>
            <span className="text-xs font-black text-rose-700 block mt-0.5">
              Tolak + Alasan
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1.5 block">
            Tertera di detail pengajuan
          </span>
        </div>
      </div>
    </div>
  );
}

function Step3Content() {
  return (
    <div className="space-y-3">
      {/* Alur Serah Terima */}
      <div className="space-y-1.5">
        {[
          { icon: ClipboardCheck, label: "Minta kode REQ mahasiswa", color: "text-violet-700" },
          { icon: CheckCircle, label: "Verifikasi kode di sistem", color: "text-blue-700" },
          { icon: ShieldCheck, label: "Cek fisik bersama mahasiswa", color: "text-teal-700" },
          { icon: Camera, label: "Foto cover arsip (Buka Kamera / Upload)", color: "text-violet-700" },
          { icon: CheckSquare, label: "Konfirmasi Serah Terima", color: "text-emerald-700" },
        ].map(({ icon: Icon, label, color }, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-blue-900 bg-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1E3A8A]">
              <span className="text-[9px] font-black text-blue-900">{i + 1}</span>
            </div>
            <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white">
              <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
              <span className="text-[11px] font-semibold text-slate-700">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kode REQ preview */}
      <div className="p-2.5 rounded-lg border-2 border-violet-700 bg-violet-50 shadow-[2px_2px_0px_#6D28D9] flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold text-violet-500 uppercase tracking-wider block">
            Contoh Kode Pengajuan
          </span>
          <span className="font-mono text-sm font-black text-violet-900 tracking-wider">
            REQ-2026-XXXXX
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-emerald-500 bg-emerald-50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black text-emerald-800">DIPINJAM ✓</span>
        </div>
      </div>

      {/* Upload method buttons */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 p-2 rounded-lg border-2 border-blue-900 bg-white shadow-[1px_1px_0px_#1E3A8A]">
          <Camera className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span className="text-[10px] font-black text-blue-950">Buka Kamera</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-lg border-2 border-blue-900 bg-white shadow-[1px_1px_0px_#1E3A8A]">
          <UploadCloud className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span className="text-[10px] font-black text-blue-950">Upload File</span>
        </div>
      </div>
    </div>
  );
}

function Step4Content({ config }: { config: PetugasConfigValues }) {
  return (
    <div className="space-y-3">
      {/* Kondisi Arsip Cards */}
      <div className="space-y-2">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
          Pilihan Kondisi Arsip
        </span>

        {/* BAIK */}
        <div className="p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 shadow-[2px_2px_0px_#059669]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">
                BAIK / Lengkap
              </span>
            </div>
            <span className="text-[10px] font-black text-emerald-700">Tanpa Denda</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-medium mt-0.5 block">
            Foto kondisi + Konfirmasi Terima
          </span>
        </div>

        {/* RUSAK */}
        <div className="p-2.5 rounded-xl border-2 border-amber-600 bg-amber-50 shadow-[2px_2px_0px_#D97706]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">
                RUSAK
              </span>
            </div>
            <span className="text-[10px] font-black text-amber-700">
              {config.formatRupiah(config.damagedFine)}
            </span>
          </div>
          <span className="text-[10px] text-amber-800 font-medium mt-0.5 block">
            Catatan kerusakan + Foto kondisi wajib
          </span>
        </div>

        {/* HILANG */}
        <div className="p-2.5 rounded-xl border-2 border-rose-700 bg-rose-50 shadow-[2px_2px_0px_#BE123C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
              <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider">
                HILANG
              </span>
            </div>
            <span className="text-[10px] font-black text-rose-700">
              {config.formatRupiah(config.lostFine)}
            </span>
          </div>
          <span className="text-[10px] text-rose-800 font-medium mt-0.5 block">
            Kronologi wajib · Foto tidak diperlukan
          </span>
        </div>
      </div>

      {/* Denda Keterlambatan */}
      <div className="p-3 rounded-xl border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A]">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Denda Keterlambatan (Otomatis)
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div>
            <span className="text-[9px] text-slate-400 font-medium">≤ {config.lateThreshold} hari</span>
            <p className="text-[11px] font-black text-blue-950">{config.formatRupiah(config.lateBase)}</p>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-medium">&gt; {config.lateThreshold} hari</span>
            <p className="text-[11px] font-black text-blue-950">+{config.formatRupiah(config.lateDaily)}/hari</p>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 font-medium mt-1.5">
          * Semua denda dihitung otomatis oleh sistem
        </p>
      </div>
    </div>
  );
}

export function PetugasGuideStepContent({
  step,
  config,
}: PetugasGuideStepContentProps) {
  const Icon = iconMap[step.iconName] ?? ClipboardCheck;
  const colors = colorMap[step.colorKey];

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className={`p-4 rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.shadow}`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg border-2 ${colors.border} bg-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1E3A8A]`}>
            <Icon className={`w-4.5 h-4.5 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-bold uppercase tracking-widest ${colors.text} opacity-70`}>
              {step.subtitle}
            </p>
            <h3 className={`text-base font-black ${colors.text} leading-tight`}>
              {step.title}
            </h3>
            <p className="text-[11px] text-slate-600 font-medium mt-1.5 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </div>

      {/* Step-specific micro-widgets */}
      {step.step === 1 && <Step1Content config={config} />}
      {step.step === 2 && <Step2Content />}
      {step.step === 3 && <Step3Content />}
      {step.step === 4 && <Step4Content config={config} />}
    </div>
  );
}
