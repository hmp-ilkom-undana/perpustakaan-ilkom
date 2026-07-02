import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoIlkom from "../assets/Logo_Ilkom.png";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/85 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] transition-all">
      <div className="w-full max-w-[93rem] mx-auto flex h-16 items-center justify-between px-6 md:px-12">
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

          {/* Hamburger (HP) */}
          <button
            className="sm:hidden p-2 text-slate-600 hover:test-orange-500 foucs:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
            <Link
              to="/"
              onClick={closeMenu}
              className={`text-base font-semibold transition-colors ${isActive("/") ? "text-orange-600" : "text-slate-600 hover:text-orange-500"}`}
            >
              Beranda
            </Link>
            <Link
              to="/katalog"
              onClick={closeMenu}
              className={`text-base font-semibold transition-colors ${isActive("/katalog") ? "text-orange-600" : "text-slate-600 hover:text-orange-500"}`}
            >
              Katalog
            </Link>
            <Link
              to="/panduan"
              onClick={closeMenu}
              className={`text-base font-semibold transition-colors ${isActive("/panduan") ? "text-orange-600" : "text-slate-600 hover:text-orange-500"}`}
            >
              Panduan
            </Link>

            <Link
              to="/login"
              onClick={closeMenu}
              className="px-5 py-2 text-base font-semibold text-white bg-orange-500 rounded-full shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all hover:-translate-y-0.5"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
