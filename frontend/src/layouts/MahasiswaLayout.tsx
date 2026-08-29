import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useSession, authClient } from "@/lib/auth-client";
import {
  StudentGuideProvider,
  useStudentGuideContext,
} from "@/context/StudentGuideContext";
import { GuideModal } from "@/components/guide/GuideModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Library,
  BookOpenCheck,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";
import { NavLogo } from "@/components/NavLogo";

// Daftar Menu Mahasiswa
const menus = [
  { name: "Beranda", path: "/mahasiswa", icon: LayoutDashboard },
  { name: "Katalog", path: "/mahasiswa/katalog", icon: Library },
  { name: "Peminjaman", path: "/mahasiswa/peminjaman", icon: BookOpenCheck },
];

export default function MahasiswaLayout() {
  return (
    <StudentGuideProvider>
      <MahasiswaLayoutContent />
    </StudentGuideProvider>
  );
}

function MahasiswaLayoutContent() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const scrolled = useScroll(10);
  const guide = useStudentGuideContext();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      toast.success("Berhasil Keluar!", {
        description: "Sesi Anda telah berhasil diakhiri.",
        duration: 2000,
      });
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1500);
    } catch {
      toast.error("Gagal keluar dari sistem");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ================= NAVBAR ATAS ================= */}
      <header
        className={cn(
          "sticky top-0 z-50 mx-auto w-full border-b-2 border-transparent bg-white transition-all duration-300 ease-in-out",
          {
            "border-blue-900 md:top-2 md:max-w-7xl md:rounded-md md:border-2 md:shadow-[4px_4px_0px_#1E3A8A]":
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
              <NavLogo size="md" variant="brutalist" />

              <h1 className="text-xl font-black text-blue-900 tracking-tight hidden sm:block uppercase">
                Perpustakaan ILKOM
              </h1>
              <h1 className="text-xl font-black text-blue-900 tracking-tight sm:hidden uppercase">
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                      isActive
                        ? "bg-amber-400 text-blue-900 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-900 border-2 border-transparent hover:border-blue-900 hover:shadow-[2px_2px_0px_#1E3A8A]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-blue-900" : ""}`}
                    />
                    {menu.name}
                  </Link>
                );
              })}
            </nav>

            {/* Bagian Kanan: User Profile Trigger with Dropdown (Desktop) */}
            <div className="hidden md:flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex items-center gap-2.5 py-1.5 px-3 rounded-lg border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] hover:border-orange-500 hover:shadow-[3px_3px_0px_#F97316] hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-left select-none outline-none">
                  <div className="w-7 h-7 rounded bg-orange-100 border border-blue-900 text-blue-950 font-black text-[10px] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1E3A8A]">
                    {(session?.user?.name || "M")
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-xs font-black text-blue-950 truncate max-w-[130px] group-hover:text-orange-600 transition-colors leading-tight">
                      {session?.user?.name || "Mahasiswa"}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      NIM: {session?.user?.nim || "-"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-y-0.5 transition-all shrink-0" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 p-1.5 border-2 border-blue-900 bg-white shadow-[4px_4px_0px_#1E3A8A] rounded-lg animate-in fade-in-80 zoom-in-95"
                >
                  <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Akun Mahasiswa
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/mahasiswa/profil" })}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-blue-950 hover:bg-orange-50 hover:text-orange-600 rounded-md cursor-pointer transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-blue-900" />
                    Edit Profil
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 border-t border-slate-200" />

                  <DropdownMenuItem
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-md cursor-pointer transition-colors data-disabled:opacity-50 data-disabled:pointer-events-none"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 text-rose-600" />
                    )}
                    {isLoggingOut ? "Mengakhiri Sesi..." : "Keluar"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-bold transition-all ${
                      isActive
                        ? "bg-amber-400 text-blue-900 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-900 border-2 border-transparent hover:border-blue-900 hover:shadow-[2px_2px_0px_#1E3A8A]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-blue-900" : ""}`}
                    />
                    {menu.name}
                  </Link>
                );
              })}

              {/* Info Profil & Logout versi Mobile */}
              <div className="border-t border-slate-200 mt-4 pt-4 px-3 pb-2 space-y-3">
                <Link
                  to="/mahasiswa/profil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between p-3 rounded-lg border-2 border-blue-900 bg-orange-50/70 shadow-[3px_3px_0px_#1E3A8A] hover:bg-orange-100 hover:shadow-[4px_4px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-md bg-orange-100 border-2 border-blue-900 text-blue-950 font-black text-xs flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1E3A8A]">
                      {(session?.user?.name || "M")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-blue-950 truncate group-hover:text-orange-600 transition-colors">
                        {session?.user?.name || "Mahasiswa"}
                      </p>
                      <p className="text-xs font-mono font-bold text-slate-500">
                        NIM: {session?.user?.nim || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Badge Indikator Aksi Edit Profil */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-blue-900 text-blue-950 font-black text-[11px] shadow-[1px_1px_0px_#1E3A8A] group-hover:bg-amber-400 transition-colors shrink-0 ml-2">
                    <UserCircle className="w-3.5 h-3.5 text-blue-900" />
                    <span>Edit Profil</span>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-900" />
                  </div>
                </Link>

                <Button
                  variant="outline"
                  disabled={isLoggingOut}
                  className="w-full justify-start text-rose-600 border-2 border-rose-300 hover:bg-rose-50 font-bold shadow-[2px_2px_0px_#E11D48] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleLogout}
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 mr-2" />
                  )}
                  {isLoggingOut ? "Mengakhiri Sesi..." : "Keluar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-0 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <GuideModal
        isOpen={guide.isOpen}
        isLoading={guide.isLoading}
        isFirstTime={guide.isFirstTime}
        config={guide.config}
        steps={guide.steps}
        currentStep={guide.currentStep}
        totalSteps={guide.totalSteps}
        isFirstStep={guide.isFirstStep}
        isLastStep={guide.isLastStep}
        onClose={guide.handleClose}
        onNext={guide.handleNext}
        onPrev={guide.handlePrev}
      />
    </div>
  );
}
