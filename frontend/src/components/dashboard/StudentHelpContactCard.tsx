import { Phone, MessageSquare, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSystemSettingQuery } from "@/hooks/queries/useSettingQuery";
import { useSession } from "@/lib/auth-client";

export function StudentHelpContactCard() {
  const { data: settings } = useSystemSettingQuery();
  const { data: session } = useSession();

  const adminName = settings?.adminContactName || "Petugas Perpustakaan";
  const rawNumber = settings?.adminWaNumber || "6281234567890";
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");

  const studentName = session?.user?.name || "Mahasiswa";
  const studentNim = (session?.user as any)?.nim || "";

  const textMessage = encodeURIComponent(
    `Halo ${adminName}, saya ${studentName}${studentNim ? ` (NIM: ${studentNim})` : ""} ingin menanyakan informasi seputar layanan/peminjaman di Perpustakaan ILKOM.`
  );

  const waUrl = `https://wa.me/${cleanNumber}?text=${textMessage}`;

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border-2 border-blue-900 rounded-xl p-5 sm:p-6 text-white shadow-[4px_4px_0px_#1E3A8A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
      {/* Sisi Kiri: Ikon & Teks Informasi */}
      <div className="space-y-1.5 max-w-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
            Pusat Bantuan & Kontak Petugas
          </h3>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
          Memerlukan bantuan terkait antrean pengambilan arsip, verifikasi pengembalian, atau konfirmasi bukti pelunasan denda? Hubungi pengurus via WhatsApp resmi.
        </p>

        <div className="flex items-center gap-4 text-[11px] font-semibold text-emerald-400 pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Respons Resmi HMP
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Jam Operasional: 08:00 - 16:00
          </span>
        </div>
      </div>

      {/* Sisi Kanan: Tombol WhatsApp */}
      <div className="w-full sm:w-auto shrink-0">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full sm:w-auto"
        >
          <Button
            type="button"
            variant="success"
            size="default"
            className="w-full sm:w-auto font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-[2px_2px_0px_#064E3B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all py-2.5 px-4"
          >
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp Petugas ({adminName})
          </Button>
        </a>
      </div>
    </div>
  );
}
