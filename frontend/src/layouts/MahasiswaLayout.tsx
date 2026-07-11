import { useState } from "react";
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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";

// Daftar Menu Mahasiswa
const menus = [
  { name: "Dashboard", path: "/mahasiswa", icon: LayoutDashboard },
  { name: "Katalog", path: "/mahasiswa/katalog", icon: Library },
  { name: "Peminjaman", path: "/mahasiswa/peminjaman", icon: BookOpenCheck },
  { name: "Riwayat", path: "/mahasiswa/riwayat", icon: History },
];

export default function MahasiswaLayout() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk mengontrol buka-tutup menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrolled = useScroll(10);

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ================= NAVBAR ATAS ================= */}
      <header
        className={cn(
          "sticky top-0 z-50 mx-auto w-full border-transparent border-b transition-all duration-500 ease-in-out bg-white/80 backdrop-blur-md supports-backdrop-filter:bg-white/50",
          {
            "border-slate-200 md:top-2 md:max-w-7xl md:rounded-xl md:shadow-md md:border bg-white/95":
              scrolled,
          },
        )}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex justify-between items-center h-16 transition-all duration-500 ease-in-out",
              {
                "md:h-14": scrolled,
              },
            )}
          >
            {/* Bagian Kiri: Logo & Nama Aplikasi */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 bg-white">
                <img
                  src="/assets/Logo_Ilkom.png"
                  alt="Logo Ilkom"
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 scale-[1.8] origin-top object-cover max-w-none w-full"

                />
              </div>

              <h1 className="text-xl font-bold text-blue-900 tracking-tight hidden sm:block">
                Perpustakaan ILKOM
              </h1>
              <h1 className="text-xl font-bold text-blue-900 tracking-tight sm:hidden">
                Perpus ILKOM
              </h1>
            </div>

            {/* Bagian Tengah: Navigasi Desktop (Disembunyikan di Mobile) */}
            <nav className="hidden md:flex space-x-1">
              {menus.map((menu) => {
                const isActive = location.pathname === menu.path;
                const Icon = menu.icon;
                return (
                  <Link
                    key={menu.path}
                    to={menu.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {menu.name}
                  </Link>
                );
              })}
            </nav>

            {/* Bagian Kanan: Profil & Logout (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {session?.user?.nim}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>

            {/* Bagian Kanan: Tombol Hamburger (Hanya Mobile) */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {/* Ikon berubah jadi 'X' jika menu terbuka, dan 'Menu' jika tertutup */}
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ================= MENU DROPDOWN (MOBILE) ================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white animate-in slide-in-from-top-2">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {menus.map((menu) => {
                const isActive = location.pathname === menu.path;
                const Icon = menu.icon;
                return (
                  <Link
                    key={menu.path}
                    to={menu.path}
                    onClick={() => setIsMobileMenuOpen(false)} // Tutup menu saat diklik
                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {menu.name}
                  </Link>
                );
              })}

              {/* Info Profil & Logout versi Mobile */}
              <div className="border-t mt-4 pt-4 px-3 pb-2">
                <div className="flex items-center gap-3 mb-4">
                  <UserCircle className="w-10 h-10 text-slate-400" />
                  <div>
                    <p className="text-base font-bold text-slate-800">
                      {session?.user?.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {session?.user?.nim}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
