import { Link } from "react-router-dom";
import logoIlkom from "../assets/Logo_Ilkom.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Bagian Kiri: Logo dan Nama */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoIlkom}
            alt="Logo ILKOM"
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Perpustakaan <span className="text-orange-500">ILKOM</span>
          </span>
        </Link>

        {/* Bagian Kanan: Menu Navigasi */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Beranda
          </Link>
          <Link
            to="/katalog"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Katalog
          </Link>
          <Link
            to="/panduan"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Panduan
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
