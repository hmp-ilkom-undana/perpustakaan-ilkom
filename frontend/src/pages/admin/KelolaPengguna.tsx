import { useState, useMemo } from "react";
import { Search, ShieldAlert, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { getUserColumns } from "@/components/pengguna/columns";
import type { UserItem } from "@/services/user.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialStudents: UserItem[] = [
  { id: "1", name: "Ahmad Dahlan", identifier: "M0521001", role: "MAHASISWA", status: "Aktif" },
  { id: "2", name: "Budi Santoso", identifier: "M0521002", role: "MAHASISWA", status: "Aktif" },
  { id: "3", name: "Citra Lestari", identifier: "M0521003", role: "MAHASISWA", status: "Aktif" },
  { id: "4", name: "Dewi Anggraini", identifier: "M0521004", role: "MAHASISWA", status: "Non-Aktif" },
];

export default function KelolaPengguna() {
  const [search, setSearch] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const filteredUsers = useMemo(
    () =>
      initialStudents.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.identifier.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const handleResetPassword = (user: UserItem) => {
    setSelectedUser(user);
    setIsResetDialogOpen(true);
  };

  const confirmReset = () => {
    setIsResetDialogOpen(false);
  };

  const columns = useMemo(
    () => getUserColumns({ onResetPassword: handleResetPassword }),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-900 text-white rounded-md [box-shadow:2px_2px_0px_#1E3A8A]">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-blue-900">
            Kelola Pengguna
          </h1>
        </div>
        <p className="text-sm md:text-base text-slate-600 font-medium">
          Daftar seluruh akun mahasiswa dan anggota umum perpustakaan.
        </p>
      </div>

      <div className="bg-white rounded-lg border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] overflow-hidden">
        <div className="p-4 sm:p-6 border-b-2 border-blue-900 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari berdasarkan NIM atau Nama Mahasiswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 text-sm border-2 border-blue-900 bg-white rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-900 font-medium"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          headerClassName="bg-slate-100 border-b-2 border-blue-900 text-blue-900 font-bold"
          emptyText="Tidak ada data mahasiswa yang ditemukan."
        />

        <div className="p-4 border-t-2 border-blue-900 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50">
          <div>Menampilkan {filteredUsers.length} dari {initialStudents.length} pengguna</div>
        </div>
      </div>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="border-2 border-blue-900 [box-shadow:6px_6px_0px_#1E3A8A] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 font-bold">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Konfirmasi Reset Sandi
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-700 pt-2 font-medium">
              Apakah Anda yakin ingin mereset sandi untuk pengguna <strong>{selectedUser?.name}</strong> ({selectedUser?.identifier})?
              <br /><br />
              Sandi akan dikembalikan ke sandi standar (<code className="bg-slate-100 px-1.5 py-0.5 border border-slate-300 rounded font-bold text-blue-900">123456</code>).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-2 border-blue-900 font-bold hover:bg-slate-100 rounded-md">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-blue-900 [box-shadow:3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] rounded-md transition-all"
            >
              Ya, Reset Sandi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
