import { useState } from "react";
import {
  Search,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Wallet,
  Users,
  Receipt,
  Loader2,
  Calendar,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useFineListQuery,
  useFineStatsQuery,
} from "@/hooks/queries/useFineQuery";
import { usePayFineMutation } from "@/hooks/queries/useFineMutation";
import type { FineItem } from "@/services/fine.service";

export default function Denda() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"UNPAID" | "PAID">("UNPAID");

  // TanStack Query Hooks
  const { data: stats, isLoading: isStatsLoading } = useFineStatsQuery();
  const {
    data: rawFines = [],
    isLoading: isFinesLoading,
    isFetching,
  } = useFineListQuery({
    status: activeTab,
    search: searchQuery,
  });

  const payFineMutation = usePayFineMutation();

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<FineItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"Tunai" | "Transfer">("Tunai");
  const [paymentNotes, setPaymentNotes] = useState("");

  const handleOpenPayment = (fine: FineItem) => {
    setSelectedFine(fine);
    setPaymentMethod("Tunai");
    setPaymentNotes("");
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedFine) return;
    try {
      await payFineMutation.mutateAsync({
        id: selectedFine.id,
        payload: {
          paymentMethod,
          notes: paymentNotes,
        },
      });
      setIsPaymentOpen(false);
    } catch {
    }
  };

  const getFineBadgeStyle = (fineType: string) => {
    if (fineType === "Kerusakan Fisik") {
      return "bg-red-100 text-red-900 border-2 border-blue-900 font-black shadow-[1px_1px_0px_#1E3A8A]";
    }
    if (fineType === "Kehilangan Arsip") {
      return "bg-purple-100 text-purple-900 border-2 border-blue-900 font-black shadow-[1px_1px_0px_#1E3A8A]";
    }
    return "bg-amber-300 text-blue-950 border-2 border-blue-900 font-black shadow-[1px_1px_0px_#1E3A8A]";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-blue-900 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900 uppercase">
            Kasir & Kelola Denda
          </h1>
          <p className="text-sm font-bold text-slate-500">
            Pencatatan sanksi denda, status blokir peminjam, dan verifikasi pelunasan
          </p>
        </div>
      </div>

      {/* METRIC STAT CARDS (NEO-BRUTALISM) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Tunggakan Aktif */}
        <div className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Total Tunggakan Aktif
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-100 border-2 border-blue-900 flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isStatsLoading ? (
                <span className="text-slate-400 text-lg">Memuat...</span>
              ) : (
                `Rp ${(stats?.totalUnpaidAmount || 0).toLocaleString("id-ID")}`
              )}
            </p>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Dari {stats?.unpaidCount || 0} tagihan belum dibayar
            </p>
          </div>
        </div>

        {/* Card 2: Terkumpul (Bulan Ini) */}
        <div className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              Terkumpul (Bulan Ini)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border-2 border-blue-900 flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isStatsLoading ? (
                <span className="text-slate-400 text-lg">Memuat...</span>
              ) : (
                `Rp ${(stats?.totalPaidAmount || 0).toLocaleString("id-ID")}`
              )}
            </p>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Dari {stats?.paidCount || 0} transaksi lunas
            </p>
          </div>
        </div>

        {/* Card 3: Mahasiswa Terblokir */}
        <div className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Mahasiswa Terblokir
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 border-2 border-blue-900 flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
              <Users className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isStatsLoading ? (
                <span className="text-slate-400 text-lg">Memuat...</span>
              ) : (
                `${stats?.blockedStudentsCount || 0} Orang`
              )}
            </p>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Akses pinjam terkunci otomatis
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & TAB CONTROLS (NEO-BRUTALISM) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] space-y-4">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-900" />
          <Input
            placeholder="Cari NIM, Nama Mahasiswa, Judul Arsip, atau Kode Transaksi..."
            className="pl-10 w-full bg-slate-50 border-2 border-blue-900 font-bold text-slate-800 placeholder:text-slate-400 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white rounded-lg h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab("UNPAID")}
            className={`px-4 py-2.5 rounded-lg border-2 border-blue-900 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "UNPAID"
                ? "bg-red-500 text-white shadow-[3px_3px_0px_#1E3A8A]"
                : "bg-white text-slate-700 hover:bg-slate-50 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px]"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Menunggu Pelunasan
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black border border-blue-900 ${
                activeTab === "UNPAID"
                  ? "bg-white text-red-600"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {stats?.unpaidCount || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("PAID")}
            className={`px-4 py-2.5 rounded-lg border-2 border-blue-900 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "PAID"
                ? "bg-emerald-600 text-white shadow-[3px_3px_0px_#1E3A8A]"
                : "bg-white text-slate-700 hover:bg-slate-50 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Riwayat Pelunasan
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black border border-blue-900 ${
                activeTab === "PAID"
                  ? "bg-white text-emerald-700"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {stats?.paidCount || 0}
            </span>
          </button>

          {isFetching && !isFinesLoading && (
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 ml-auto">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-900" />
              Menyinkronkan...
            </span>
          )}
        </div>
      </div>

      {/* FINE ITEMS LIST (NEO-BRUTALISM) */}
      <div className="space-y-3.5">
        {isFinesLoading ? (
          <div className="bg-white rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] p-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="font-bold text-slate-600">Memuat data tagihan denda...</p>
          </div>
        ) : rawFines.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-blue-900/60 p-12 text-center flex flex-col items-center justify-center gap-3 shadow-[2px_2px_0px_#1E3A8A]">
            <Receipt className="w-12 h-12 text-slate-300" />
            <p className="text-slate-600 font-bold text-base">
              {searchQuery
                ? "Tidak ada data tagihan yang sesuai dengan pencarian."
                : activeTab === "UNPAID"
                ? "Tidak ada tagihan denda yang belum dibayar. Bersih! 🎉"
                : "Belum ada riwayat pembayaran denda."}
            </p>
          </div>
        ) : (
          rawFines.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:shadow-[5px_5px_0px_#1E3A8A]`}
            >
              {/* Sisi Kiri: Informasi Mahasiswa & Denda */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-slate-900 text-lg">
                    {item.studentName}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-slate-100 text-blue-900 border-2 border-blue-900 font-bold text-xs shadow-[1px_1px_0px_#1E3A8A]"
                  >
                    NIM: {item.studentId}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white text-slate-700 border-2 border-blue-900 font-bold text-xs shadow-[1px_1px_0px_#1E3A8A]"
                  >
                    {item.transactionId}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={getFineBadgeStyle(item.fineType)}
                  >
                    {item.fineType}
                  </Badge>
                  {item.archiveCode && (
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Kode: {item.archiveCode}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-700 line-clamp-2">
                  <span className="text-slate-400 font-bold">Judul Arsip:</span>{" "}
                  {item.archiveTitle}
                </p>

                {/* Info Riwayat Bayar untuk tab PAID */}
                {item.status === "PAID" && (
                  <div className="bg-emerald-50 border-2 border-emerald-800/30 rounded-lg p-2.5 text-xs text-emerald-950 font-semibold space-y-1 mt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        {item.paidAt
                          ? new Date(item.paidAt).toLocaleString("id-ID")
                          : "-"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                        Metode: {item.paymentMethod || "Tunai"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        Kasir: {item.receivedBy || "Petugas"}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-emerald-800 italic">
                        Catatan: "{item.notes}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Sisi Kanan: Nominal & Tombol Aksi */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t-2 md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                <div className="text-right">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Nominal Denda
                  </span>
                  <span
                    className={`text-2xl sm:text-3xl font-black tracking-tight ${
                      item.status === "UNPAID"
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    Rp {item.amount.toLocaleString("id-ID")}
                  </span>
                </div>

                {item.status === "UNPAID" ? (
                  <Button
                    onClick={() => handleOpenPayment(item)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-5 py-2.5 rounded-lg border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
                  >
                    Bayar / Pelunasan
                  </Button>
                ) : (
                  <div className="bg-emerald-400 text-emerald-950 font-black text-xs px-3.5 py-1.5 rounded-lg border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    LUNAS
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAYMENT MODAL (NEO-BRUTALISM DIALOG) */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md z-[60] border-4 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-xl bg-white p-6">
          <DialogHeader className="border-b-2 border-blue-900 pb-3">
            <DialogTitle className="text-xl font-black text-blue-900 uppercase tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-orange-500" />
              Kasir Pelunasan Denda
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500">
              Pastikan dana pembayaran telah diterima sebelum melakukan konfirmasi pelunasan pada sistem.
            </DialogDescription>
          </DialogHeader>

          {selectedFine && (
            <div className="space-y-5 py-2">
              {/* Ringkasan Tagihan */}
              <div className="bg-amber-50/70 p-4 rounded-xl border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Mahasiswa</span>
                  <span className="font-black text-slate-900">
                    {selectedFine.studentName} ({selectedFine.studentId})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Kode Transaksi</span>
                  <span className="font-black text-blue-900">
                    {selectedFine.transactionId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Jenis Pelanggaran</span>
                  <span className="font-black text-red-600">
                    {selectedFine.fineType}
                  </span>
                </div>
                <div className="border-t-2 border-blue-900/40 pt-2 flex justify-between items-center">
                  <span className="text-xs font-black text-blue-900 uppercase">
                    Total Wajib Bayar
                  </span>
                  <span className="text-xl font-black text-red-600">
                    Rp {selectedFine.amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Pilihan Metode Bayar */}
              <div className="space-y-2">
                <label className="text-xs font-black text-blue-900 uppercase tracking-wider block">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-blue-900 cursor-pointer transition-all ${
                      paymentMethod === "Tunai"
                        ? "bg-amber-300 text-blue-950 font-black shadow-[3px_3px_0px_#1E3A8A]"
                        : "bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-[1px_1px_0px_#1E3A8A]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Tunai"
                      checked={paymentMethod === "Tunai"}
                      onChange={() => setPaymentMethod("Tunai")}
                      className="hidden"
                    />
                    <Wallet className="w-4 h-4" />
                    <span>Tunai (Cash)</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-blue-900 cursor-pointer transition-all ${
                      paymentMethod === "Transfer"
                        ? "bg-amber-300 text-blue-950 font-black shadow-[3px_3px_0px_#1E3A8A]"
                        : "bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-[1px_1px_0px_#1E3A8A]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Transfer"
                      checked={paymentMethod === "Transfer"}
                      onChange={() => setPaymentMethod("Transfer")}
                      className="hidden"
                    />
                    <DollarSign className="w-4 h-4" />
                    <span>Transfer Bank</span>
                  </label>
                </div>
              </div>

              {/* Catatan Petugas */}
              <div className="space-y-2">
                <label className="text-xs font-black text-blue-900 uppercase tracking-wider block">
                  Catatan Kasir (Opsional)
                </label>
                <Input
                  placeholder="Misal: Uang pas Rp50.000 / Bukti TF ref #1234"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="border-2 border-blue-900 rounded-lg bg-slate-50 font-bold text-slate-800 placeholder:text-slate-400 shadow-[2px_2px_0px_#1E3A8A] focus-visible:ring-0 focus-visible:bg-white"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 border-t-2 border-blue-900 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              disabled={payFineMutation.isPending}
              onClick={() => setIsPaymentOpen(false)}
              className="border-2 border-blue-900 font-bold text-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={payFineMutation.isPending}
              onClick={handleConfirmPayment}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
            >
              {payFineMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Konfirmasi Lunas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
