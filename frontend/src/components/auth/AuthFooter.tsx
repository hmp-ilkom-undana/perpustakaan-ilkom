export function AuthFooter() {
  return (
    <footer className="w-full max-w-md bg-blue-900/90 border-2 border-blue-900 rounded-xl px-5 py-3.5 flex flex-col items-center gap-3 text-center z-20 shadow-[3px_3px_0px_#1E3A8A] mt-auto">
      <div className="flex items-center justify-center gap-6">
        <img
          src="/assets/Undana.png"
          alt="Logo Undana"
          className="h-10 w-auto object-contain"
        />
        <img
          src="/assets/Logo_Ilkom.png"
          alt="Logo ILKOM"
          className="h-10 w-auto object-contain"
        />
        <img
          src="/assets/Arthasena.png"
          alt="Logo Arthasena"
          className="h-10 w-auto object-contain"
        />
      </div>
      <div className="text-[10px] tracking-wider font-bold text-blue-200 uppercase leading-relaxed text-center">
        <p>Dikelola oleh:</p>
        <p>HMP Ilmu Komputer Periode 2026/2027</p>
        <p>Kabinet Arthasena</p>
      </div>
    </footer>
  );
}
