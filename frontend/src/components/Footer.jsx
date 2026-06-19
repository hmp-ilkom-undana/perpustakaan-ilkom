import logoUndana from "../assets/Undana.png";
import logoIlkom from "../assets/Logo_Ilkom.png";
import logoArthasena from "../assets/Arthasena.png";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        
        {/* Barisan Logo */}
        <div className="flex items-center gap-6">
          <img src={logoUndana} alt="Undana" className="h-12 w-12 object-contain rounded-full" />
          <img src={logoIlkom} alt="Ilmu Komputer" className="h-12 w-12 object-contain rounded-full" />
          <img src={logoArthasena} alt="Arthasena" className="h-12 w-12 object-contain rounded-full" />
        </div>

        {/* Teks Copyright */}
        <div className="text-center">
          <p className="text-sm font-medium text-slate-900">
            Dikelola oleh HMP Ilmu Komputer 
          </p>
          <p className="text-sm font-medium text-slate-900">
            Kabinet Arthasena
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Universitas Nusa Cendana &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}