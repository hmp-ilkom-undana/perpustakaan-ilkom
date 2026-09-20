import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useSession, authClient } from "@/lib/auth-client";
import { useSessionSync, broadcastAuthEvent } from "@/hooks/useSessionSync";
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
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { BorrowingQuotaDialog } from "@/components/dashboard/BorrowingQuotaDialog";
import { useStudentQuota } from "@/hooks/useStudentQuota";
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
  useSessionSync("MAHASISWA");
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const scrolled = useScroll(10);
  const guide = useStudentGuideContext();
  const { quota } = useStudentQuota();
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      broadcastAuthEvent("LOGOUT");
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
                const isActive =
                  menu.path === "/mahasiswa"
                    ? location.pathname === "/mahasiswa"
                    : location.pathname.startsWith(menu.path);
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

            {/* Bagian Kanan: User Profile Trigger & Panduan (Desktop) */}
            <div className="hidden md:flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={guide.handleOpen}
                className="h-10 w-10 rounded-lg border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] hover:bg-amber-100 hover:border-blue-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-blue-950"
                aria-label="Buka panduan peminjaman arsip"
                title="Panduan Peminjaman"
              >
                <HelpCircle className="w-6 h-6" strokeWidth={2.3} />
              </Button>

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
                    <span className="text-[10px] font-mono font-bold text-slate-500 leading-tight mt-0.5">
                      Kuota: {quota.terpakai}/{quota.maksimal}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-y-0.5 transition-all shrink-0" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 p-1.5 border-2 border-blue-900 bg-white shadow-[4px_4px_0px_#1E3A8A] rounded-lg animate-in fade-in-80 zoom-in-95"
                >
                  <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex flex-col gap-0.5">
                    <span className="text-blue-950 font-black text-xs truncate">
                      {session?.user?.name || "Mahasiswa"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      NIM: {session?.user?.nim || "-"}
                    </span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1 border-t border-slate-200" />

                  <DropdownMenuItem
                    onClick={() => setIsQuotaModalOpen(true)}
                    className="flex items-center justify-between px-2.5 py-2 text-xs font-bold text-blue-950 hover:bg-orange-50 hover:text-orange-600 rounded-md cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-blue-900" />
                      <span>Rincian Kuota</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-blue-950 px-1.5 py-0.5 rounded border border-blue-900/20">
                      {quota.terpakai}/{quota.maksimal}
                    </span>
                  </DropdownMenuItem>

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

            {/* Bagian Kanan: Tombol Panduan & Hamburger (Hanya Mobile) */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={guide.handleOpen}
                className="h-10 w-10 rounded-lg border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-blue-950"
                aria-label="Buka panduan peminjaman arsip"
                title="Panduan Peminjaman"
              >
                <HelpCircle className="w-6 h-6" strokeWidth={2.3} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-10 w-10 rounded-lg border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-blue-950" />
                ) : (
                  <Menu className="w-5 h-5 text-blue-950" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ================= BACKDROP OVERLAY (MOBILE) ================= */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 top-16 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ================= MENU DROPDOWN (MOBILE) ================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-blue-900 bg-white shadow-[0px_8px_16px_rgba(30,58,138,0.15)] max-h-[calc(100dvh-4.5rem)] overflow-y-auto z-50 relative animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 pt-3 pb-4 space-y-1.5">
              {menus.map((menu) => {
                const isActive =
                  menu.path === "/mahasiswa"
                    ? location.pathname === "/mahasiswa"
                    : location.pathname.startsWith(menu.path);
                const Icon = menu.icon;
                return (
                  <Link
                    key={menu.path}
                    to={menu.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-bold transition-all ${
                      isActive
                        ? "bg-amber-400 text-blue-950 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
                        : "text-slate-700 hover:bg-slate-100 hover:text-blue-950 border-2 border-transparent hover:border-blue-900 hover:shadow-[2px_2px_0px_#1E3A8A]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-blue-950" : "text-slate-500"}`}
                    />
                    {menu.name}
                  </Link>
                );
              })}

              {/* Info Profil & Logout versi Mobile */}
              <div className="border-t border-slate-200 mt-4 pt-4 px-1 pb-2 space-y-3">
                {/* 1. Kartu Profil Mahasiswa (Original Edit Profile Card) */}
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

                {/* 2. Kartu Rincian Kuota (Neo-Brutalist Compact Bento) */}
                <div
                  onClick={() => setIsQuotaModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  className="group flex items-center justify-between p-3 rounded-lg border-2 border-blue-900 bg-amber-50/60 shadow-[3px_3px_0px_#1E3A8A] hover:bg-amber-100/70 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer select-none"
                  aria-label="Buka rincian alokasi kuota peminjaman"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-amber-400 border-2 border-blue-900 text-blue-950 flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1E3A8A]">
                      <BookOpen className="w-4 h-4 text-blue-950" />
                    </div>
                    <span className="text-xs font-black text-blue-950 uppercase tracking-tight">
                      Kuota Peminjaman
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-mono font-black text-blue-950 bg-white border border-blue-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E3A8A]">
                      {quota.terpakai}/{quota.maksimal}
                    </span>
                    <div className="flex items-center gap-0.5 text-[11px] font-black text-blue-900 group-hover:text-orange-600 transition-colors">
                      <span>Rincian</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
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

      <BorrowingQuotaDialog
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        quota={quota}
      />
    </div>
  );
}
