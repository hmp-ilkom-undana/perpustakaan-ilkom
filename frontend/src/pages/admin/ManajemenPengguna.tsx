import { useState, useMemo } from "react";
import { Search, ShieldAlert } from "lucide-react";
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

const users: UserItem[] = [
  { id: "1", name: "Admin Utama", identifier: "admin@ilkom.com", role: "ADMIN", status: "Aktif" },
  { id: "2", name: "Petugas 1", identifier: "petugas@ilkom.com", role: "PETUGAS", status: "Aktif" },
  { id: "3", name: "Mahasiswa A", identifier: "M0521001", role: "MAHASISWA", status: "Aktif" },
  { id: "4", name: "Mahasiswa B", identifier: "M0521002", role: "MAHASISWA", status: "Aktif" },
  { id: "5", name: "Petugas 2", identifier: "petugas2@ilkom.com", role: "PETUGAS", status: "Aktif" },
];

export default function ManajemenPengguna() {
  const [search, setSearch] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const filteredUsers = useMemo(
    () =>
      users.filter(
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
    console.log("Resetting password for", selectedUser?.identifier);
    setIsResetDialogOpen(false);
  };

  const columns = useMemo(
    () => getUserColumns({ onResetPassword: handleResetPassword }),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manajemen Pengguna</h1>
        <p className="text-slate-500">Kelola akun mahasiswa, petugas, dan admin perpustakaan dengan aman.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Cari NIM atau Nama Mahasiswa..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base border-slate-200 bg-slate-50/50 focus-visible:ring-slate-300"
            />
          </div>
        </div>
        
        {/* TanStack Data Table */}
        <DataTable
          columns={columns}
          data={filteredUsers}
          headerClassName="bg-slate-50 border-b border-slate-200"
          emptyText="Tidak ada data pengguna yang ditemukan."
        />
        
        {/* Pagination Info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <div>Menampilkan {filteredUsers.length} dari {users.length} pengguna</div>
        </div>
      </div>

      {/* Security Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="border-red-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              Konfirmasi Reset Keamanan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 pt-2 text-base">
              Apakah Anda yakin ingin mereset sandi untuk NIM/Email <strong>{selectedUser?.identifier}</strong>? 
              <br/><br/>
              Sandi akan dikembalikan ke default (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">123456</code>).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-slate-200 hover:bg-slate-50 text-slate-600">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReset}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Ya, Reset Sandi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
