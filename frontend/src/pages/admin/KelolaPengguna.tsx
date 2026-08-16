import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { getStudentColumns } from "@/components/pengguna/studentColumns";
import { StudentDetailDialog } from "@/components/pengguna/StudentDetailDialog";
import { StudentHistoryDialog } from "@/components/pengguna/StudentHistoryDialog";
import { userService, type UserItem } from "@/services/user.service";
import { toast } from "sonner";

const mockStudents: UserItem[] = [
  {
    id: "1",
    name: "Ahmad Dahlan",
    identifier: "M0521001",
    nim: "M0521001",
    email: "ahmad.dahlan@student.ilkom.ac.id",
    wa_number: "081234567890",
    role: "MAHASISWA",
    status: "Aktif",
    createdAt: "12 Januari 2024",
    activeBorrowings: 1,
  },
  {
    id: "2",
    name: "Budi Santoso",
    identifier: "M0521002",
    nim: "M0521002",
    email: "budi.santoso@student.ilkom.ac.id",
    wa_number: "081298765432",
    role: "MAHASISWA",
    status: "Aktif",
    createdAt: "15 Januari 2024",
    activeBorrowings: 0,
  },
  {
    id: "3",
    name: "Citra Lestari",
    identifier: "M0521003",
    nim: "M0521003",
    email: "citra.lestari@student.ilkom.ac.id",
    wa_number: "082145678901",
    role: "MAHASISWA",
    status: "Aktif",
    createdAt: "18 Januari 2024",
    activeBorrowings: 2,
  },
  {
    id: "4",
    name: "Dewi Anggraini",
    identifier: "M0521004",
    nim: "M0521004",
    email: "dewi.anggraini@student.ilkom.ac.id",
    wa_number: "085712345678",
    role: "MAHASISWA",
    status: "Non-Aktif",
    createdAt: "22 Februari 2024",
    activeBorrowings: 0,
  },
  {
    id: "5",
    name: "Eko Prasetyo",
    identifier: "M0521005",
    nim: "M0521005",
    email: "eko.prasetyo@student.ilkom.ac.id",
    wa_number: "087812349988",
    role: "MAHASISWA",
    status: "Aktif",
    createdAt: "01 Maret 2024",
    activeBorrowings: 1,
  },
];

export default function KelolaPengguna() {
  const [students, setStudents] = useState<UserItem[]>(mockStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "Aktif" | "Non-Aktif"
  >("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog States
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Fetch Students from API
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getStudents();
      if (Array.isArray(data) && data.length > 0) {
        setStudents(data);
      }
    } catch {
      // Fallback tetap menggunakan mock data jika backend belum running/kosong
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.identifier.toLowerCase().includes(search.toLowerCase()) ||
        (item.email && item.email.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Aktif").length;
    const inactive = students.filter((s) => s.status === "Non-Aktif").length;
    const totalBorrowings = students.reduce(
      (acc, s) => acc + (s.activeBorrowings || 0),
      0,
    );

    return { total, active, inactive, totalBorrowings };
  }, [students]);

  // Action Handlers
  const handleViewDetail = (user: UserItem) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleViewHistory = (user: UserItem) => {
    setSelectedUser(user);
    setIsHistoryOpen(true);
  };

  const handleWhatsApp = (user: UserItem) => {
    if (!user.wa_number) {
      toast.error(`Mahasiswa ${user.name} belum mencantumkan nomor WhatsApp`);
      return;
    }

    let cleanedNumber = user.wa_number.replace(/\D/g, "");
    if (cleanedNumber.startsWith("0")) {
      cleanedNumber = "62" + cleanedNumber.slice(1);
    } else if (!cleanedNumber.startsWith("62")) {
      cleanedNumber = "62" + cleanedNumber;
    }

    const greetingMessage = encodeURIComponent(
      `Halo ${user.name} (${user.nim || user.identifier}), kami dari Layanan Perpustakaan ILKOM Undana. Ingin mengonfirmasi status peminjaman arsip dan sirkulasi Anda. Terima kasih.`,
    );

    window.open(
      `https://wa.me/${cleanedNumber}?text=${greetingMessage}`,
      "_blank",
    );
    toast.success(`Membuka WhatsApp untuk menghubungi ${user.name}`);
  };

  const columns = useMemo(
    () =>
      getStudentColumns({
        onViewDetail: handleViewDetail,
      }),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-900 text-white rounded-md [box-shadow:2px_2px_0px_#1E3A8A]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900">
              Kelola Pengguna
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Manajemen akun mahasiswa, pemantauan status keanggotaan, dan audit
              sirkulasi peminjaman.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900">
              Total Mahasiswa
            </span>
            <Users className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950">
            {stats.total}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">
            Terdaftar di sistem
          </p>
        </div>

        <div className="p-4 bg-white border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
              Akun Aktif
            </span>
            <UserCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {stats.active}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">
            Dapat meminjam buku
          </p>
        </div>

        <div className="p-4 bg-white border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-800">
              Non-Aktif
            </span>
            <UserX className="w-4 h-4 text-rose-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700">
            {stats.inactive}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">
            Akses dinonaktifkan
          </p>
        </div>

        <div className="p-4 bg-white border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800">
              Pinjaman Aktif
            </span>
            <BookOpen className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            {stats.totalBorrowings}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">
            Buku sedang dipinjam
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b-2 border-blue-900 bg-slate-50/70 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari berdasarkan NIM, Nama, atau Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 text-sm border-2 border-blue-900 bg-white rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white p-1 border-2 border-blue-900 rounded-md">
              <span className="text-xs font-black text-blue-900 px-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Status:
              </span>
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                  statusFilter === "ALL"
                    ? "bg-blue-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Aktif")}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                  statusFilter === "Aktif"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Non-Aktif")}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                  statusFilter === "Non-Aktif"
                    ? "bg-rose-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Non-Aktif
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredStudents}
          isLoading={isLoading}
          headerClassName="bg-slate-100 border-b-2 border-blue-900 text-blue-900 font-bold"
          emptyText="Tidak ada data mahasiswa yang cocok dengan pencarian atau filter."
        />

        {/* Table Footer / Counter */}
        <div className="p-4 border-t-2 border-blue-900 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 gap-2">
          <div>
            Menampilkan{" "}
            <span className="font-bold text-blue-900">
              {filteredStudents.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-blue-900">{students.length}</span>{" "}
            mahasiswa terdaftar
          </div>
        </div>
      </div>

      {/* Interactive Dialogs */}
      <StudentDetailDialog
        user={selectedUser}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onViewHistory={handleViewHistory}
        onWhatsApp={handleWhatsApp}
      />

      <StudentHistoryDialog
        user={selectedUser}
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </div>
  );
}
