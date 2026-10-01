export function AuthFooter() {
  return (
    <footer className="w-full max-w-md bg-blue-900/90 border-2 border-blue-900 rounded-xl px-5 py-3.5 flex flex-col items-center gap-3 text-center z-20 shadow-[4px_4px_0px_#000000] mt-auto">
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
        <p className="text-orange-400 font-black">Dikelola oleh:</p>
        <p className="text-white font-black">HMP Ilmu Komputer Periode 2026/2027</p>
        <p className="text-blue-200">Kabinet Arthasena</p>
      </div>
    </footer>
  );
}
