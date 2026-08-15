import { useState, useMemo } from "react";
import { 
  Search, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  UserPlus, 
  SlidersHorizontal 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getStaffColumns } from "@/components/pengguna/staffColumns";
import { StaffFormDialog } from "@/components/pengguna/StaffFormDialog";
import { StaffResetPasswordDialog } from "@/components/pengguna/StaffResetPasswordDialog";
import { StaffDeleteDialog } from "@/components/pengguna/StaffDeleteDialog";
import { StaffStatusToggleDialog } from "@/components/pengguna/StaffStatusToggleDialog";
import type { UserItem } from "@/services/user.service";
import { toast } from "sonner";

const mockStaff: UserItem[] = [
  {
    id: "101",
    name: "Siti Rahmawati, S.Kom.",
    identifier: "petugas1@ilkom.ac.id",
    email: "petugas1@ilkom.ac.id",
    wa_number: "081234567801",
    role: "PETUGAS",
    status: "Aktif",
    createdAt: "10 Januari 2024",
  },
  {
    id: "102",
    name: "Rian Hidayat, A.Md.",
    identifier: "petugas2@ilkom.ac.id",
    email: "petugas2@ilkom.ac.id",
    wa_number: "081234567802",
    role: "PETUGAS",
    status: "Aktif",
    createdAt: "15 Februari 2024",
  },
  {
    id: "103",
    name: "Nurul Fauziah",
    identifier: "petugas3@ilkom.ac.id",
    email: "petugas3@ilkom.ac.id",
    wa_number: "081234567803",
    role: "PETUGAS",
    status: "Non-Aktif",
    createdAt: "01 Maret 2024",
  },
];

export default function KelolaPetugas() {
  const [staffList, setStaffList] = useState<UserItem[]>(mockStaff);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Aktif" | "Non-Aktif">("ALL");

  // Dialog States
  const [selectedStaff, setSelectedStaff] = useState<UserItem | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);

  // Filter Logic
  const filteredStaff = useMemo(() => {
    return staffList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.identifier.toLowerCase().includes(search.toLowerCase()) ||
        (item.email && item.email.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [staffList, search, statusFilter]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === "Aktif").length;
    const inactive = staffList.filter((s) => s.status === "Non-Aktif").length;

    return { total, active, inactive };
  }, [staffList]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedStaff(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (staff: UserItem) => {
    setSelectedStaff(staff);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleSaveStaff = (staffData: Partial<UserItem> & { password?: string }) => {
    if (formMode === "create") {
      const newStaff: UserItem = {
        id: String(Date.now()),
        name: staffData.name || "",
        identifier: staffData.email || "",
        email: staffData.email || "",
        wa_number: staffData.wa_number || "",
        role: "PETUGAS",
        status: staffData.status || "Aktif",
        createdAt: "Baru saja",
      };
      setStaffList((prev) => [newStaff, ...prev]);
      toast.success(`Akun petugas "${newStaff.name}" berhasil dibuat`);
    } else if (staffData.id) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === staffData.id
            ? {
                ...s,
                name: staffData.name || s.name,
                email: staffData.email || s.email,
                identifier: staffData.email || s.identifier,
                wa_number: staffData.wa_number || s.wa_number,
                status: staffData.status || s.status,
              }
            : s
        )
      );
      toast.success(`Data petugas "${staffData.name}" berhasil diperbarui`);
    }
  };

  const handleOpenResetPassword = (staff: UserItem) => {
    setSelectedStaff(staff);
    setIsResetOpen(true);
  };

  const handleConfirmResetPassword = (staff: UserItem) => {
    toast.success(
      `Sandi akun petugas ${staff.name} berhasil direset ke default (123456)`
    );
    setIsResetOpen(false);
  };

  const handleOpenToggleStatus = (staff: UserItem) => {
    setSelectedStaff(staff);
    setIsToggleStatusOpen(true);
  };

  const handleConfirmToggleStatus = (staff: UserItem) => {
    const nextStatus = staff.status === "Aktif" ? "Non-Aktif" : "Aktif";
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: nextStatus } : s))
    );
    toast.success(
      `Akses petugas ${staff.name} berhasil diubah menjadi "${nextStatus}"`
    );
    setIsToggleStatusOpen(false);
  };

  const handleOpenDelete = (staff: UserItem) => {
    setSelectedStaff(staff);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = (staff: UserItem) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
    toast.success(`Akun petugas ${staff.name} berhasil dihapus dari sistem`);
    setIsDeleteOpen(false);
  };

  const columns = useMemo(
    () =>
      getStaffColumns({
        onEdit: handleOpenEdit,
        onToggleStatus: handleOpenToggleStatus,
        onResetPassword: handleOpenResetPassword,
        onDelete: handleOpenDelete,
      }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Page Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-900 text-white rounded-md [box-shadow:2px_2px_0px_#1E3A8A]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900">
                Kelola Petugas
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Manajemen akun staf operasional perpustakaan, hak akses, dan penambahan petugas baru.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center h-11"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Petugas Baru
        </Button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 bg-white border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900">Total Petugas</span>
            <ShieldCheck className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950">
            {stats.total}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Staf perpustakaan terdaftar</p>
        </div>

        <div className="p-4 bg-white border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Petugas Aktif</span>
            <UserCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {stats.active}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Akses operasional aktif</p>
        </div>

        <div className="p-4 bg-white border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-800">Akses Dinonaktifkan</span>
            <UserX className="w-4 h-4 text-rose-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700">
            {stats.inactive}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Akses login terkunci</p>
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
              placeholder="Cari berdasarkan Nama atau Email Petugas..."
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
          data={filteredStaff}
          headerClassName="bg-slate-100 border-b-2 border-blue-900 text-blue-900 font-bold"
          emptyText="Tidak ada data petugas yang cocok dengan pencarian atau filter."
        />

        {/* Table Footer */}
        <div className="p-4 border-t-2 border-blue-900 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 gap-2">
          <div>
            Menampilkan <span className="font-bold text-blue-900">{filteredStaff.length}</span> dari <span className="font-bold text-blue-900">{staffList.length}</span> petugas terdaftar
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            *Untuk mengubah sandi atau hak akses, gunakan menu aksi di sebelah kanan.
          </div>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <StaffFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        staff={selectedStaff}
        mode={formMode}
        onSubmit={handleSaveStaff}
      />

      <StaffResetPasswordDialog
        staff={selectedStaff}
        isOpen={isResetOpen}
        onOpenChange={setIsResetOpen}
        onConfirm={handleConfirmResetPassword}
      />

      <StaffStatusToggleDialog
        staff={selectedStaff}
        isOpen={isToggleStatusOpen}
        onOpenChange={setIsToggleStatusOpen}
        onConfirm={handleConfirmToggleStatus}
      />

      <StaffDeleteDialog
        staff={selectedStaff}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
