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
    `Halo ${adminName}, saya ${studentName}${studentNim ? ` (NIM: ${studentNim})` : ""} ingin menanyakan informasi seputar layanan/peminjaman di Perpustakaan ILKOM.`,
  );

  const waUrl = `https://wa.me/${cleanNumber}?text=${textMessage}`;

  return (
    <div className="bg-white border-2 border-blue-900 rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_#1E3A8A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 transition-all">
      {/* Sisi Kiri: Ikon Neo-Brutalist & Teks Informasi */}
      <div className="space-y-3 max-w-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-100 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex items-center justify-center text-emerald-800 shrink-0">
            <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-800" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-xs sm:text-sm font-black text-blue-950 uppercase tracking-wider leading-tight">
              Pusat Bantuan & Kontak Petugas
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5">
              Layanan Konsultasi & Bantuan Sirkulasi
            </span>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
          Memerlukan bantuan terkait antrean pengambilan arsip, verifikasi
          pengembalian, atau konfirmasi bukti pelunasan denda? Hubungi pengurus
          via WhatsApp.
        </p>
      </div>

      {/* Sisi Kanan: Tombol WhatsApp Neo-Brutalism */}
      <div className="w-full sm:w-auto shrink-0 self-stretch sm:self-center">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full sm:w-auto"
        >
          <Button
            type="button"
            className="w-full sm:w-auto font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E3A8A] transition-all py-3 px-4 min-h-[44px] flex items-center justify-center text-center cursor-pointer"
          >
            <Phone className="w-4 h-4 mr-2 text-white shrink-0" />
            <span>Hubungi {adminName}</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
