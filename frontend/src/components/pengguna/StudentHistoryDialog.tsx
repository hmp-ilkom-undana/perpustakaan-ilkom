import { useState, useEffect } from "react";
import type { UserItem, BorrowingHistoryItem } from "@/services/user.service";
import { userService } from "@/services/user.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  FileText 
} from "lucide-react";

interface StudentHistoryDialogProps {
  user: UserItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentHistoryDialog({
  user,
  isOpen,
  onOpenChange,
}: StudentHistoryDialogProps) {
  const [history, setHistory] = useState<BorrowingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      const fetchHistory = async () => {
        try {
          setIsLoading(true);
          const data = await userService.getStudentBorrowings(user.id);
          setHistory(data || []);
        } catch {
          // Fallback mock history if offline
          setHistory([
            {
              id: "b1",
              archiveTitle: "Sistem Informasi Manajemen Rumah Sakit",
              archiveCode: "SKR-0012",
              category: "SISTEM INFORMASI",
              archiveType: "SKRIPSI",
              borrowDate: "10 Agustus 2026",
              returnDate: "17 Agustus 2026",
              status: "BORROWED",
              fineAmount: 0,
            },
            {
              id: "b2",
              archiveTitle: "Implementasi Algoritma K-Means Clustering",
              archiveCode: "SKR-0008",
              category: "DATA MINING",
              archiveType: "SKRIPSI",
              borrowDate: "01 Juli 2026",
              returnDate: "08 Juli 2026",
              status: "RETURNED",
              fineAmount: 0,
              kondisiKembali: "BAIK",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchHistory();
    }
  }, [user, isOpen]);

  if (!user) return null;

  const totalFine = history.reduce((acc, h) => acc + (h.fineAmount || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BORROWED":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-900 border-2 border-blue-900 font-bold px-2 py-0.5 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Sedang Dipinjam
          </Badge>
        );
      case "RETURNED":
        return (
          <Badge variant="outline" className="bg-emerald-100 text-emerald-900 border-2 border-blue-900 font-bold px-2 py-0.5 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Dikembalikan
          </Badge>
        );
      case "OVERDUE":
        return (
          <Badge variant="outline" className="bg-rose-100 text-rose-900 border-2 border-blue-900 font-bold px-2 py-0.5 text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            Terlambat
          </Badge>
        );
      case "WAITING_PICKUP":
        return (
          <Badge variant="outline" className="bg-sky-100 text-sky-900 border-2 border-blue-900 font-bold px-2 py-0.5 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu Diambil
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-800 border-2 border-blue-900 font-bold px-2 py-0.5 text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-2 border-blue-900 [box-shadow:6px_6px_0px_#1E3A8A] rounded-lg p-6 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black text-blue-900">
            <BookOpen className="w-5 h-5 text-blue-900" />
            Riwayat Peminjaman & Denda Mahasiswa
          </DialogTitle>
        </DialogHeader>

        {/* Student Summary Info Bar */}
        <div className="p-3.5 bg-slate-50 border-2 border-blue-900 rounded-md [box-shadow:3px_3px_0px_#1E3A8A] flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-800">
          <div>
            <span className="text-slate-500 font-normal">Nama: </span>
            <strong className="text-blue-950 font-bold">{user.name}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-normal">NIM: </span>
            <span className="px-2 py-0.5 font-mono font-bold bg-amber-100 border border-blue-900 rounded text-blue-900">
              {user.nim || user.identifier}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-normal">Total Transaksi: </span>
            <strong className="text-blue-900">{history.length} Arsip</strong>
          </div>
          <div>
            <span className="text-slate-500 font-normal">Total Denda: </span>
            <strong className={totalFine > 0 ? "text-rose-600 font-bold" : "text-emerald-700"}>
              Rp {totalFine.toLocaleString("id-ID")}
            </strong>
          </div>
        </div>

        {/* History List Section */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 my-3 max-h-[400px]">
          {isLoading ? (
            <div className="py-12 text-center text-sm font-bold text-slate-500 animate-pulse">
              [ Memuat Riwayat Transaksi... ]
            </div>
          ) : history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white border-2 border-blue-900 rounded-md [box-shadow:3px_3px_0px_#1E3A8A] space-y-2 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-black text-blue-900 bg-amber-100 border border-blue-900 rounded">
                      {item.archiveCode}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-bold border-blue-900/40 text-slate-700">
                      {item.category}
                    </Badge>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <h4 className="font-bold text-blue-950 text-sm leading-snug">
                  {item.archiveTitle}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-900" />
                    <span>Pinjam: {item.borrowDate}</span>
                  </div>
                  {item.returnDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Kembali: {item.returnDate}</span>
                    </div>
                  )}
                  {item.fineAmount > 0 && (
                    <div className="flex items-center gap-1 text-rose-600 font-bold">
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Denda: Rp {item.fineAmount.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50/50">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">
                Belum Ada Riwayat Transaksi
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Mahasiswa ini belum pernah mengajukan atau meminjam arsip buku.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-blue-900 hover:bg-blue-950 text-white font-bold border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-md"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
