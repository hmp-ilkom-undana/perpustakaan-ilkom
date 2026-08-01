import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CirculationItem } from "@/lib/mockData";
import { ArrowLeft, CheckCircle, XCircle, Camera, CheckSquare, UploadCloud, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "sonner";

export default function SirkulasiDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<CirculationItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Skenario 2 states
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  // Modal states
  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (id) {
        try {
          const response = await api.get("/api/borrowings/active");
          const found = response.data.find((item: any) => item.id === id);
          if (found) {
            setItem({
              id: found.id,
              studentName: found.user.name,
              studentId: found.user.nim,
              archiveTitle: found.archive.title,
              archiveType: found.archive.archiveType,
              status: found.status,
              requestDate: found.borrowDate,
              dueDate: found.returnDate || "-",
              fine: found.fineAmount,
              approvedBy: found.pickupCode ? "Petugas" : undefined,
            });
          }
        } catch (error) {
          console.error("Gagal mengambil detail:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data transaksi...</div>;
  if (!item) return <div className="p-8 text-center text-rose-500">Transaksi tidak ditemukan!</div>;

  const handleAction = async (newStatus: CirculationItem['status'], successMsg: string) => {
    try {
      setIsSubmitting(true);
      if (newStatus === "WAITING_PICKUP") {
        await api.patch(`/api/borrowings/${item.id}/approve`);
        setIsAccModalOpen(false);
      } else if (newStatus === "REJECTED") {
        await api.patch(`/api/borrowings/${item.id}/reject`, { reason: rejectReason });
        setIsRejectModalOpen(false);
      } else {
        // Fallback untuk mockup Tahap 2 & 3
      }
      
      toast.success(successMsg);
      navigate("/petugas/sirkulasi");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCameraMock = () => {
    setIsUploading(true);
    // Simulasi kompresi 1.5 detik
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
      toast.success("Foto berhasil dikompresi (< 200KB) dan diunggah!");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white sm:rounded-2xl sm:border border-slate-200 overflow-hidden shadow-sm">
      {/* HEADER TILE */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-100 bg-slate-50/50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/petugas/sirkulasi")} className="shrink-0 rounded-full hover:bg-slate-200">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-900 leading-tight">Detail Transaksi</h1>
          <p className="text-xs font-semibold text-slate-500">REQ-{item.id.substring(0, 6).toUpperCase()}</p>
        </div>
        <Badge variant="outline" className={`font-bold uppercase tracking-wider
          ${item.status === 'REQUESTED' && 'bg-blue-100 text-blue-700 border-blue-200'}
          ${item.status === 'WAITING_PICKUP' && 'bg-orange-100 text-orange-700 border-orange-200'}
          ${item.status === 'BORROWED' && 'bg-emerald-100 text-emerald-700 border-emerald-200'}
          ${item.status === 'OVERDUE' && 'bg-rose-100 text-rose-700 border-rose-200'}
        `}>
          {item.status}
        </Badge>
      </div>

      {/* DATA CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Info Mahasiswa */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Informasi Peminjam</h2>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="font-bold text-lg text-slate-900">{item.studentName}</p>
            <p className="text-sm font-medium text-slate-500">NIM: {item.studentId}</p>
          </div>
        </section>

        {/* Info Arsip */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Arsip Fisik</h2>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="font-bold text-slate-900 line-clamp-2">{item.archiveTitle}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Jenis: {item.archiveType}</p>
          </div>
        </section>

        {/* Audit Trail */}
        {(item.approvedBy || item.handoverBy) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Audit Trail</h2>
            <div className="space-y-2 text-xs font-medium text-slate-500 bg-white p-4 rounded-xl border border-slate-100">
              {item.approvedBy && <p>✅ Di-ACC oleh: <span className="text-slate-900 font-bold">{item.approvedBy}</span></p>}
              {item.handoverBy && <p>🤝 Diserahkan oleh: <span className="text-slate-900 font-bold">{item.handoverBy}</span></p>}
            </div>
          </section>
        )}

        {/* Skenario 3: Overdue Info */}
        {item.status === "OVERDUE" && item.fine !== undefined && (
          <section className="animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <div>
                  <p className="text-sm font-bold text-rose-700">Denda Keterlambatan</p>
                  <p className="text-xs font-medium text-rose-600/80">Lewat jatuh tempo: {item.dueDate}</p>
                </div>
              </div>
              <p className="text-xl font-black text-rose-600">Rp {item.fine.toLocaleString('id-ID')}</p>
            </div>
          </section>
        )}
      </div>

      {/* ACTION CENTER (Sticky Bottom) */}
      <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        {/* Skenario 1: REQUESTED */}
        {item.status === "REQUESTED" && (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold h-12"
              onClick={() => setIsRejectModalOpen(true)}
            >
              <XCircle className="w-5 h-5 mr-2" /> Tolak
            </Button>
            <Button 
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 shadow-lg shadow-emerald-500/20"
              onClick={() => setIsAccModalOpen(true)}
            >
              <CheckCircle className="w-5 h-5 mr-2" /> ACC (Tersedia)
            </Button>
          </div>
        )}

        {/* Skenario 2: WAITING_PICKUP */}
        {item.status === "WAITING_PICKUP" && (
          <div className="flex flex-col gap-3">
            {!isUploaded ? (
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleCameraMock}
                  disabled={isUploading}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 text-sm shadow-lg shadow-orange-500/20 transition-all"
                >
                  {isUploading ? (
                    <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Memproses...</>
                  ) : (
                    <><Camera className="w-5 h-5 mr-2" /> Ambil Foto</>
                  )}
                </Button>
                <Button 
                  onClick={handleCameraMock} // Mock yang sama untuk purwarupa
                  disabled={isUploading}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold h-14 text-sm transition-all"
                >
                  {isUploading ? (
                    <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Memproses...</>
                  ) : (
                    <><UploadCloud className="w-5 h-5 mr-2" /> Upload File</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-2 fade-in">
                <div className="flex items-center gap-2 mb-3 justify-center text-emerald-600 bg-emerald-50 py-2 rounded-lg text-sm font-bold border border-emerald-100">
                  <UploadCloud className="w-4 h-4" /> Foto Berhasil Diunggah
                </div>
                <Button 
                  onClick={() => handleAction("BORROWED", "Serah terima sukses! Argometer 30 hari berjalan.")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-14 text-base shadow-lg shadow-emerald-500/20"
                >
                  <CheckSquare className="w-5 h-5 mr-2" /> Konfirmasi Serah Terima
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Skenario 3: BORROWED */}
        {item.status === "BORROWED" && (
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => handleAction("COMPLETED", "Buku diterima dengan baik.")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 text-base shadow-lg shadow-blue-500/20"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Terima Pengembalian
            </Button>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2">Lapor Kerusakan / Kehilangan?</button>
          </div>
        )}

        {/* Skenario 3: OVERDUE */}
        {item.status === "OVERDUE" && (
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => handleAction("COMPLETED", "Denda lunas & Buku diterima.")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 text-base shadow-lg shadow-blue-500/20"
            >
              <CheckSquare className="w-5 h-5 mr-2" /> Catat Lunas & Terima Pengembalian
            </Button>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2">Lapor Kerusakan tambahan?</button>
          </div>
        )}

      </div>

      {/* MODAL KONFIRMASI ACC */}
      <Dialog open={isAccModalOpen} onOpenChange={setIsAccModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Persetujuan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyetujui pengajuan ini? Sistem akan membuat Pickup Code secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsAccModalOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white" 
              onClick={() => handleAction("WAITING_PICKUP", "Pengajuan di-ACC! Memulai timer 2 hari ambil.")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Ya, Setujui"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL KONFIRMASI TOLAK */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Pengajuan</DialogTitle>
            <DialogDescription>
              Silakan tuliskan alasan mengapa pengajuan ini ditolak. Alasan ini akan dapat dilihat oleh mahasiswa.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Alasan Penolakan</label>
            <textarea
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              rows={3}
              placeholder="Contoh: Buku sedang direstorasi karena halamannya robek..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button 
              className="bg-rose-500 hover:bg-rose-600 text-white" 
              onClick={() => handleAction("REJECTED", "Pengajuan berhasil ditolak!")}
              disabled={isSubmitting || rejectReason.trim() === ""}
            >
              {isSubmitting ? "Memproses..." : "Tolak Pengajuan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
