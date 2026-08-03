import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession, authClient } from "@/lib/auth-client";
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
  UserCircle
} from "lucide-react";

export default function PetugasLayout() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Berhasil keluar dari sistem");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Gagal keluar dari sistem");
    }
  };

  const menus = [
    { name: "Dashboard", path: "/petugas", icon: LayoutDashboard },
    { name: "Sirkulasi", path: "/petugas/sirkulasi", icon: ArrowRightLeft },
    { name: "Katalog Data", path: "/petugas/katalog", icon: Library },
    { name: "Kelola Denda", path: "/petugas/denda", icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* MOBILE HEADER (Visible only on mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white shadow-md z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0 bg-white">
            <img
              src="/assets/Logo_Ilkom.png"
              alt="Logo"
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 scale-[1.8] origin-top object-cover max-w-none w-full"
            />
          </div>
          <h1 className="font-bold tracking-tight text-lg">Panel Petugas</h1>
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

      {/* OVERLAY (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header (Desktop) */}
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 bg-white">
            <img
              src="/assets/Logo_Ilkom.png"
              alt="Logo"
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 scale-[1.8] origin-top object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-tight">Perpus ILKOM</h1>
            <p className="text-[10px] text-orange-500 font-semibold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path || (menu.path !== "/petugas" && location.pathname.startsWith(menu.path));
            const Icon = menu.icon;
            
            return (
              <Link
                key={menu.path}
                to={menu.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
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
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-4">
            <UserCircle className="w-10 h-10 text-slate-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Petugas"}</p>
              <p className="text-xs text-slate-400 truncate">{session?.user?.email || "petugas@ilkom.com"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-white border-slate-700 bg-transparent hover:bg-slate-800 hover:text-orange-500 hover:border-orange-500 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        
        {/* BACKGROUND SILHOUETTE */}
        <div className="fixed inset-0 md:left-64 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-7">
           <img src="/assets/Logo_Ilkom.png" alt="Logo Watermark" className="w-[400px] md:w-[600px] h-auto grayscale" />
        </div>

        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 animate-in fade-in duration-500 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
