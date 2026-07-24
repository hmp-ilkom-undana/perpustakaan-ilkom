import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle2, DollarSign, Wallet, Users, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { 
  FineItem, 
  getFineData, 
  payFine 
} from "@/lib/mockData";

export default function Denda() {
  const { data: session } = useSession();
  const [data, setData] = useState<FineItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"UNPAID" | "PAID">("UNPAID");
  
  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<FineItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"Tunai" | "Transfer">("Tunai");
  const [paymentNotes, setPaymentNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData(getFineData());
  };

  const handleOpenPayment = (fine: FineItem) => {
    setSelectedFine(fine);
    setPaymentMethod("Tunai");
    setPaymentNotes("");
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (selectedFine) {
      payFine(
        selectedFine.id, 
        paymentMethod, 
        paymentNotes, 
        session?.user?.name || "Petugas"
      );
      toast.success("Pembayaran berhasil diverifikasi");
      setIsPaymentOpen(false);
      loadData();
    }
  };

  // Derived Metrics
  const unpaidFines = data.filter(d => d.status === "UNPAID");
  const paidFines = data.filter(d => d.status === "PAID");
  
  const totalUnpaidAmount = unpaidFines.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaidAmount = paidFines.reduce((acc, curr) => acc + curr.amount, 0);
  const blockedStudentsCount = new Set(unpaidFines.map(d => d.studentId)).size;

  const filteredItems = (activeTab === "UNPAID" ? unpaidFines : paidFines).filter(item => {
    const q = searchQuery.toLowerCase();
    return item.studentName.toLowerCase().includes(q) || 
           item.studentId.toLowerCase().includes(q) ||
           item.transactionId.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* HEADER STAT CARDS */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Kasir & Kelola Denda</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-red-50/50 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <AlertCircle className="w-5 h-5" />
                Total Tunggakan Aktif
              </div>
              <p className="text-3xl font-bold text-slate-900">
                Rp {totalUnpaidAmount.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-slate-500">Dari {unpaidFines.length} transaksi</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-emerald-50/50 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <DollarSign className="w-5 h-5" />
                Terkumpul (Bulan Ini)
              </div>
              <p className="text-3xl font-bold text-slate-900">
                Rp {totalPaidAmount.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-slate-500">Dari {paidFines.length} pelunasan</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-amber-50/50 group-hover:scale-110 transition-transform">
              <Users className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex items-center gap-2 text-amber-600 font-semibold">
                <Users className="w-5 h-5" />
                Mahasiswa Terblokir
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {blockedStudentsCount} Orang
              </p>
              <p className="text-sm text-slate-500">Akses pinjam terkunci otomatis</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & OMNISEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 relative z-20">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Cari NIM, Nama, atau Kode Transaksi..." 
            className="pl-10 w-full bg-slate-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex border-b border-slate-200">
          <button
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === "UNPAID" 
                ? "border-red-500 text-red-600" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
            onClick={() => setActiveTab("UNPAID")}
          >
            Menunggu Pelunasan ({unpaidFines.length})
          </button>
          <button
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === "PAID" 
                ? "border-emerald-500 text-emerald-600" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
            onClick={() => setActiveTab("PAID")}
          >
            Riwayat Pelunasan ({paidFines.length})
          </button>
        </div>
      </div>

      {/* LIST VIEW (Compact Row List) */}
      <div className="space-y-3 relative z-20">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center gap-3">
            <Receipt className="w-12 h-12 text-slate-300" />
            <p className="text-slate-500 font-medium">Tidak ada data tagihan</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`bg-white p-4 sm:p-5 rounded-xl shadow-sm border-l-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${
                item.status === "UNPAID" ? "border-l-red-500 border border-slate-200" : "border-l-emerald-500 border border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{item.studentName}</h3>
                  <span className="text-sm font-medium text-slate-500">{item.studentId}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {item.fineType}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium border border-slate-200 px-2 py-0.5 rounded">
                    {item.transactionId}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1 max-w-lg mt-1">
                  Arsip: {item.archiveTitle}
                </p>
                
                {item.status === "PAID" && (
                  <p className="text-xs text-slate-400 mt-2 bg-slate-50 inline-block p-1.5 rounded-md border border-slate-100">
                    🗓 Dibayar pada {new Date(item.paidAt!).toLocaleString('id-ID')} via {item.paymentMethod} (Oleh: {item.receivedBy})
                  </p>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className={`text-xl font-black ${item.status === "UNPAID" ? "text-red-600" : "text-emerald-600"}`}>
                  Rp {item.amount.toLocaleString('id-ID')}
                </div>
                
                {item.status === "UNPAID" ? (
                  <Button 
                    onClick={() => handleOpenPayment(item)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full sm:w-auto shadow-sm shadow-orange-500/20"
                  >
                    Bayar / Pelunasan
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-full text-sm border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" />
                    LUNAS
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAYMENT MODAL (Dialog) */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md z-[60]">
          <DialogHeader>
            <DialogTitle>Verifikasi Pembayaran Denda</DialogTitle>
            <DialogDescription>
              Pastikan Anda telah menerima dana sebelum melakukan konfirmasi pelunasan pada sistem.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFine && (
            <div className="space-y-6 py-4">
              {/* Ringkasan Tagihan */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Mahasiswa</span>
                  <span className="font-bold text-slate-900">{selectedFine.studentName} ({selectedFine.studentId})</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Kode Transaksi</span>
                  <span className="font-medium text-slate-700">{selectedFine.transactionId}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Jenis Penalti</span>
                  <span className="font-medium text-red-600">{selectedFine.fineType}</span>
                </div>
                <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                  <span className="text-slate-700 font-bold">Total Tagihan</span>
                  <span className="text-xl font-black text-red-600">Rp {selectedFine.amount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Native Radio Group for Payment Method */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${paymentMethod === "Tunai" ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"}
                  `}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Tunai" 
                      checked={paymentMethod === "Tunai"}
                      onChange={() => setPaymentMethod("Tunai")}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300"
                    />
                    <div className="flex items-center gap-2">
                      <Wallet className={`w-4 h-4 ${paymentMethod === "Tunai" ? "text-orange-600" : "text-slate-400"}`} />
                      <span className={`font-semibold text-sm ${paymentMethod === "Tunai" ? "text-orange-900" : "text-slate-600"}`}>Tunai</span>
                    </div>
                  </label>
                  
                  <label className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${paymentMethod === "Transfer" ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"}
                  `}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Transfer" 
                      checked={paymentMethod === "Transfer"}
                      onChange={() => setPaymentMethod("Transfer")}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300"
                    />
                    <div className="flex items-center gap-2">
                      <DollarSign className={`w-4 h-4 ${paymentMethod === "Transfer" ? "text-orange-600" : "text-slate-400"}`} />
                      <span className={`font-semibold text-sm ${paymentMethod === "Transfer" ? "text-orange-900" : "text-slate-600"}`}>Transfer</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Catatan Kasir (Opsional)</label>
                <Input 
                  placeholder="Misal: Bukti tf BCA a.n Budi, Uang pas" 
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsPaymentOpen(false)}>Batal</Button>
            <Button onClick={handleConfirmPayment} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Konfirmasi Lunas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
