import { Link, useLocation } from "react-router-dom";
import logoIlkom from "../assets/Logo_Ilkom.png";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/85 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Bagian Kiri: Logo dan Nama */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoIlkom}
            alt="Logo ILKOM"
            className="h-9 w-9 object-contain rounded-full group-hover:scale-105 transition-transform"
          />
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            Perpustakaan <span className="text-orange-500">ILKOM</span>
          </span>
        </Link>

        {/* Bagian Kanan: Menu Navigasi */}
        <div className="flex items-center gap-1 sm:gap-6">
          <Link
            to="/"
            className={`hidden sm:block text-sm font-semibold transition-colors ${isActive("/") ? "text-orange-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            Beranda
          </Link>
          <Link
            to="/katalog"
            className={`hidden sm:block text-sm font-semibold transition-colors ${isActive("/katalog") ? "text-orange-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            Katalog
          </Link>
          <Link
            to="/panduan"
            className={`hidden sm:block text-sm font-semibold transition-colors ${isActive("/panduan") ? "text-orange-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            Panduan
          </Link>

          <Link
            to="/login"
            className="ml-2 sm:ml-0 px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all hover:-translate-y-0.5"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
