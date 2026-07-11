import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Library, 
  BookOpenCheck, 
  History, 
  UserCircle,
  LogOut
} from "lucide-react";

// Daftar Menu Mahasiswa
const menus = [
  { name: "Dashboard", path: "/mahasiswa", icon: LayoutDashboard },
  { name: "Katalog Buku", path: "/mahasiswa/katalog", icon: Library },
  { name: "Peminjaman Saya", path: "/mahasiswa/peminjaman", icon: BookOpenCheck },
  { name: "Riwayat Peminjaman", path: "/mahasiswa/riwayat", icon: History },
  { name: "Profil & Pengaturan", path: "/mahasiswa/profil", icon: UserCircle },
];

export default function MahasiswaLayout() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mendeteksi menu mana yang sedang aktif

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Berhasil keluar dari sistem");
      navigate("/login");
    } catch {
      toast.error("Gagal keluar dari sistem");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Area Sidebar Kiri */}
      <aside className="w-72 bg-white border-r shadow-sm flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-bold text-blue-900 tracking-tight">Perpustakaan ILKOM</h1>
          </div>
          <nav className="p-4 space-y-1">
            {menus.map((menu) => {
              // Mengecek apakah menu sedang aktif (sesuai URL saat ini)
              const isActive = location.pathname === menu.path;
              const Icon = menu.icon;
              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
                  {menu.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Info Pengguna & Tombol Keluar di Bawah */}
        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex flex-col mb-4 px-2">
            <span className="text-sm font-bold text-slate-800 line-clamp-1">{session?.user?.name}</span>
            <span className="text-xs text-slate-500 uppercase font-medium">{session?.user?.role} - {session?.user?.nim}</span>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Area Konten Utama Kanan */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Komponen Outlet ini adalah lubang tempat konten dari halaman lain akan dirender */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
