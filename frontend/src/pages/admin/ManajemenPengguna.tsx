import { useState } from "react";
import { Search, MoreVertical, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Dummy data
const users = [
  { id: "1", name: "Admin Utama", identifier: "admin@ilkom.com", role: "ADMIN", status: "Aktif" },
  { id: "2", name: "Petugas 1", identifier: "petugas@ilkom.com", role: "PETUGAS", status: "Aktif" },
  { id: "3", name: "Mahasiswa A", identifier: "M0521001", role: "MAHASISWA", status: "Aktif" },
  { id: "4", name: "Mahasiswa B", identifier: "M0521002", role: "MAHASISWA", status: "Aktif" },
  { id: "5", name: "Petugas 2", identifier: "petugas2@ilkom.com", role: "PETUGAS", status: "Aktif" },
];

export default function ManajemenPengguna() {
  const [search, setSearch] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; identifier: string } | null>(null);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.identifier.toLowerCase().includes(search.toLowerCase())
  );

  const handleResetPassword = (user: typeof users[0]) => {
    setSelectedUser(user);
    setIsResetDialogOpen(true);
  };

  const confirmReset = () => {
    // API Call to reset password would go here
    console.log("Resetting password for", selectedUser?.identifier);
    setIsResetDialogOpen(false);
  };

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
        
        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-200">
                <TableHead className="font-semibold text-slate-600">Nama</TableHead>
                <TableHead className="font-semibold text-slate-600">Email / NIM</TableHead>
                <TableHead className="font-semibold text-slate-600">Role</TableHead>
                <TableHead className="font-semibold text-slate-600">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-600 w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                    <TableCell className="text-slate-500">{user.identifier}</TableCell>
                    <TableCell>
                      {user.role === 'ADMIN' && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                          Admin
                        </Badge>
                      )}
                      {user.role === 'PETUGAS' && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                          Petugas
                        </Badge>
                      )}
                      {user.role === 'MAHASISWA' && (
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100">
                          Mahasiswa
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300">
                          <span className="sr-only">Buka menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Aksi Akun</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {user.role === 'MAHASISWA' && (
                            <DropdownMenuItem className="cursor-pointer">
                              Jadikan Petugas
                            </DropdownMenuItem>
                          )}
                          {user.role === 'PETUGAS' && (
                            <DropdownMenuItem className="cursor-pointer">
                              Turunkan ke Mahasiswa
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleResetPassword(user)}
                            className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                          >
                            Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    Tidak ada data pengguna yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <div>Menampilkan 1 hingga 5 dari 5 pengguna</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
            <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
          </div>
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
