import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useSession, authClient } from "@/lib/auth-client";
import { useSessionSync, broadcastAuthEvent } from "@/hooks/useSessionSync";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Library, 
  Receipt, 
  LogOut,
  Menu,
  X,
  UserCircle,
  Users,
  ShieldCheck,
  Settings,
  SlidersHorizontal,
  History,
  Loader2,
} from "lucide-react";

import { NavLogo } from "@/components/NavLogo";

export default function AdminLayout() {
  useSessionSync("ADMIN");
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      broadcastAuthEvent("LOGOUT");
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

  const menus = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Sirkulasi", path: "/admin/sirkulasi", icon: ArrowRightLeft },
    { name: "Katalog Data", path: "/admin/katalog", icon: Library },
    { name: "Kelola Denda", path: "/admin/denda", icon: Receipt },
    { name: "Kelola Pengguna", path: "/admin/pengguna", icon: Users },
    { name: "Kelola Petugas", path: "/admin/petugas", icon: ShieldCheck },
    { name: "Log Aktivitas", path: "/admin/log-aktivitas", icon: History },
    { name: "Pengaturan Sistem", path: "/admin/pengaturan", icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white shadow-md z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <NavLogo size="sm" />
          <h1 className="font-bold tracking-tight text-lg">Panel Admin</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-slate-800"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white shadow-xl transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 flex flex-col shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header (Desktop) */}
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-800">
          <NavLogo size="md" />
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-tight">Perpus ILKOM</h1>
            <p className="text-[10px] text-blue-500 font-semibold tracking-widest uppercase">Panel Admin</p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path || (menu.path !== "/admin" && location.pathname.startsWith(menu.path));
            const Icon = menu.icon;
            
            return (
              <Link
                key={menu.path}
                to={menu.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                {menu.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/admin/profil"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
              location.pathname === "/admin/profil"
                ? "bg-slate-800 border-purple-500 shadow-md shadow-purple-500/10"
                : "border-slate-800 hover:bg-slate-800/70 hover:border-slate-700"
            }`}
          >
            <div className="w-9 h-9 rounded-md bg-purple-200 text-purple-950 font-black text-xs flex items-center justify-center shrink-0 border border-purple-400">
              {(session?.user?.name || "Admin")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{session?.user?.name || "Administrator"}</p>
              <p className="text-[10px] text-purple-300 font-semibold truncate flex items-center gap-1">
                <Settings className="w-3 h-3 text-purple-400 shrink-0" />
                Pengaturan Profil
              </p>
            </div>
          </Link>

          <Button
            variant="outline"
            disabled={isLoggingOut}
            className="w-full justify-start text-white border-slate-700 bg-transparent hover:bg-slate-800 hover:text-rose-400 hover:border-rose-500 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogout}
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-rose-400" />
            ) : (
              <LogOut className="w-3.5 h-3.5 mr-2" />
            )}
            {isLoggingOut ? "Mengakhiri Sesi..." : "Keluar"}
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        
        {/* BACKGROUND SILHOUETTE */}
        <div className="fixed inset-0 md:left-64 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-5">
           <img src="/assets/Logo_Ilkom.png" alt="Logo Watermark" className="w-[400px] md:w-[600px] h-auto grayscale" />
        </div>

        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 animate-in fade-in duration-500 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
