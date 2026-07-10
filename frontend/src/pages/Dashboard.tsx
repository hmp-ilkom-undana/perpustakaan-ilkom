import { useNavigate } from "react-router-dom";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // 1. Mengambil data sesi pengguna yang sedang aktif
  const { data: session } = useSession();

  // 2. Fungsi untuk menangani proses logout
  const handleLogout = async () => {
    try {
      // Menghapus sesi di backend
      await authClient.signOut();
      
      toast.success("Berhasil keluar dari sistem");
      navigate("/login"); // Kembalikan ke halaman login
    } catch (error) {
      toast.error("Gagal keluar dari sistem");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- NAVBAR --- */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-blue-900">Perpustakaan ILKOM</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            {/* Menampilkan Nama dan Role dari data sesi */}
            <p className="text-sm font-bold text-slate-800">{session?.user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{session?.user?.role?.toLowerCase()}</p>
          </div>
          
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </header>

      {/* --- KONTEN UTAMA --- */}
      <main className="p-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Selamat Datang, {session?.user?.name}!
        </h2>
        <p className="text-slate-600 mt-2">
          Anda masuk dengan hak akses sebagai <strong>{session?.user?.role}</strong>.
        </p>
      </main>
    </div>
  );
}
