import logoUndana from "../assets/Undana.png";
import logoIlkom from "../assets/Logo_Ilkom.png";
import logoArthasena from "../assets/Arthasena.png";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-slate-50/80 py-10 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50" />
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6 relative z-10">
        
        {/* Barisan Logo */}
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
          <img src={logoUndana} alt="Undana" className="h-12 w-12 object-contain" />
          <div className="w-px h-8 bg-slate-200" />
          <img src={logoIlkom} alt="Ilmu Komputer" className="h-12 w-12 object-contain rounded-full" />
          <div className="w-px h-8 bg-slate-200" />
          <img src={logoArthasena} alt="Arthasena" className="h-12 w-12 object-contain rounded-full" />
        </div>

        {/* Teks Copyright */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-700 tracking-tight">
            Dikelola oleh <span className="text-slate-900 font-bold">HMP Ilmu Komputer</span> Kabinet Arthasena
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Universitas Nusa Cendana &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}