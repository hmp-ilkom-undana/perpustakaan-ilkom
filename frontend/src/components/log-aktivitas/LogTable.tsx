import { Eye, Clock, ShieldCheck, UserCheck, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActivityLogItem } from "@/services/activity-log.service";

interface LogTableProps {
  logs: ActivityLogItem[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalLogs: number;
  onPageChange: (newPage: number) => void;
  onSelectLog: (log: ActivityLogItem) => void;
}

export function LogTable({
  logs,
  isLoading,
  page,
  totalPages,
  totalLogs,
  onPageChange,
  onSelectLog,
}: LogTableProps) {
  // Format Tanggal Indonesia
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const dateStr = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);

      const timeStr = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);

      return { dateStr, timeStr: `${timeStr} WIB` };
    } catch {
      return { dateStr: isoString, timeStr: "" };
    }
  };

  // Badge Mapping berdasarkan tipe aksi
  const renderActionBadge = (action: string) => {
    switch (action) {
      case "APPROVE_BORROW":
        return <Badge variant="success">ACC Pinjam</Badge>;
      case "REJECT_BORROW":
        return <Badge variant="destructive">Tolak Pinjam</Badge>;
      case "HANDOVER_BORROW":
        return <Badge variant="sky">Serah Terima</Badge>;
      case "RETURN_BORROW":
        return <Badge variant="navy">Pengembalian</Badge>;
      case "SETTLE_FINE":
        return <Badge variant="emerald">Kas Denda</Badge>;
      case "CREATE_ARCHIVE":
        return <Badge variant="sky">Tambah Arsip</Badge>;
      case "UPDATE_ARCHIVE":
        return <Badge variant="amber">Ubah Arsip</Badge>;
      case "DELETE_ARCHIVE":
        return <Badge variant="destructive">Hapus Arsip</Badge>;
      case "IMPORT_ARCHIVE":
        return <Badge variant="orange">Import Excel</Badge>;
      case "CREATE_PETUGAS":
      case "CREATE_PETUGAS_BATCH":
        return <Badge variant="sky">Tambah Staf</Badge>;
      case "UPDATE_PETUGAS":
        return <Badge variant="amber">Ubah Staf</Badge>;
      case "DELETE_PETUGAS":
        return <Badge variant="destructive">Hapus Staf</Badge>;
      case "UPDATE_SETTING":
        return <Badge variant="amber">Ubah Setting</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  // Skeleton Loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] overflow-hidden">
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-10 h-10 rounded-lg bg-slate-200" />
                <div className="space-y-1">
                  <div className="h-4 w-28 bg-slate-300 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-5 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-1/3 bg-slate-200 rounded" />
              <div className="h-8 w-16 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // State Kosong (Empty State)
  if (logs.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 border-2 border-blue-900 flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A]">
          <Inbox className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-base font-black text-blue-950">
          Belum Ada Catatan Aktivitas
        </h3>
        <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
          Tidak ditemukan log aktivitas yang sesuai dengan kriteria filter saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* TABEL CONTAINER */}
      <div className="bg-white rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b-2 border-blue-900 text-[11px] font-black text-blue-950 uppercase tracking-wider">
                <th className="py-3 px-4">Waktu & Tanggal</th>
                <th className="py-3 px-4">Aktor / Pelaksana</th>
                <th className="py-3 px-4">Aksi</th>
                <th className="py-3 px-4">Deskripsi Aktivitas</th>
                <th className="py-3 px-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {logs.map((log) => {
                const { dateStr, timeStr } = formatDate(log.createdAt);
                const isAdmin = log.userRole === "ADMIN";
                const initials = (log.userName || "P")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* Waktu & Tanggal */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top">
                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-blue-950">{dateStr}</p>
                          <p className="text-[11px] font-semibold text-slate-400">
                            {timeStr}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Aktor / Pelaksana */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg border-2 border-blue-900 flex items-center justify-center text-[10px] font-black shadow-[1.5px_1.5px_0px_#1E3A8A] shrink-0 ${
                            isAdmin
                              ? "bg-purple-100 text-purple-900"
                              : "bg-orange-100 text-orange-900"
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-blue-950 truncate max-w-[150px]">
                            {log.userName}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isAdmin ? (
                              <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Admin
                              </span>
                            ) : (
                              <span className="text-[10px] font-black text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200 flex items-center gap-0.5">
                                <UserCheck className="w-2.5 h-2.5" />
                                Petugas
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Badge Aksi */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top">
                      {renderActionBadge(log.action)}
                    </td>

                    {/* Deskripsi Aktivitas */}
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-medium text-slate-700 leading-relaxed line-clamp-2 max-w-md">
                        {log.description}
                      </p>
                    </td>

                    {/* Tombol Detail */}
                    <td className="py-3.5 px-4 text-center align-top whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectLog(log)}
                        className="h-8 px-2.5 text-xs font-bold border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] hover:bg-amber-400 hover:text-blue-950 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-50 p-4 border-t-2 border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="font-bold text-slate-500">
            Halaman <span className="text-blue-950 font-black">{page}</span> dari{" "}
            <span className="text-blue-950 font-black">{totalPages}</span> ({totalLogs} entri)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 px-3 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] font-bold text-xs active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Sebelumnya
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 px-3 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] font-bold text-xs active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Selanjutnya
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
