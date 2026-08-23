import { Calendar, Wallet, UserCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import type { FineItem } from "@/services/fine.service";
import { getFineBadgeVariant } from "@/hooks/usePetugasDenda";

interface FineCardProps {
  item: FineItem;
  onPay: (item: FineItem) => void;
}

export function FineCard({ item, onPay }: FineCardProps) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isUnpaid = item.status === "UNPAID";

  return (
    <div className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:shadow-[6px_6px_0px_#1E3A8A]">
      {/* SISI KIRI: INFORMASI MAHASISWA & DENDA */}
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-black text-blue-950 text-base sm:text-lg">
            {item.studentName}
          </h3>
          <Badge
            variant="outline"
            className="bg-slate-100 text-blue-950 font-black text-xs"
          >
            NIM: {item.studentId}
          </Badge>
          <Badge
            variant="amber"
            className="font-mono font-black text-xs"
          >
            {item.transactionId}
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={getFineBadgeVariant(item.fineType)}
            className="font-black text-xs"
          >
            {item.fineType}
          </Badge>
          {item.archiveCode && (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kode Arsip: <span className="text-blue-950 font-black">{item.archiveCode}</span>
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-700 line-clamp-2">
          <span className="text-slate-400 font-bold uppercase text-[11px] tracking-wider block sm:inline">
            Judul Arsip:{" "}
          </span>
          {item.archiveTitle}
        </p>

        {/* INFO RIWAYAT BAYAR UNTUK STATUS PAID (HANYA DITAMPILKAN UNTUK ROLE ADMIN) */}
        {!isUnpaid && isAdmin && (
          <div className="bg-emerald-50 border-2 border-emerald-600 rounded-lg p-3 text-xs text-emerald-950 font-semibold space-y-1.5 mt-2 shadow-[2px_2px_0px_#059669]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                {item.paidAt
                  ? new Date(item.paidAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold">
                <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                Metode: {item.paymentMethod || "Tunai"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold">
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                Kasir: {item.receivedBy || "Petugas"}
              </span>
            </div>
            {item.notes && (
              <p className="text-[11px] text-emerald-900 font-medium italic pt-1 border-t border-emerald-200">
                Catatan Kasir: "{item.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* SISI KANAN: NOMINAL & TOMBOL AKSI */}
      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t-2 md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
        <div className="text-left md:text-right">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
            Nominal Denda
          </span>
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isUnpaid ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            Rp {item.amount.toLocaleString("id-ID")}
          </span>
        </div>

        {isUnpaid ? (
          <Button
            type="button"
            onClick={() => onPay(item)}
            variant="default"
            size="default"
            className="font-black text-sm px-5 cursor-pointer"
          >
            Bayar / Pelunasan
          </Button>
        ) : (
          <Badge
            variant="emerald"
            className="font-black text-xs px-3.5 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_#059669]"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-950" />
            LUNAS
          </Badge>
        )}
      </div>
    </div>
  );
}
