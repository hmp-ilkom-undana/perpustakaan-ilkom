export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-auto pt-8 pb-6 relative z-10">
      <div className="bg-white border-2 border-blue-900 shadow-[4px_4px_0px_#000000] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/Undana.png"
              alt="Logo Undana"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/assets/Logo_Ilkom.png"
              alt="Logo ILKOM"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/assets/Arthasena.png"
              alt="Logo Arthasena"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="hidden sm:block h-7 w-[2px] bg-blue-900/20" />

          <div>
            <p className="text-xs font-black text-blue-950 uppercase tracking-tight">
              Perpustakaan Ilmu Komputer
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              FST Universitas Nusa Cendana • HMP Kabinet Arthasena
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-0.5">
          <p className="text-xs font-bold text-slate-700">
            © {currentYear}{" "}
            <span className="text-blue-950 font-black">Perpustakaan ILKOM</span>. All rights reserved.
          </p>
          <p className="text-[11px] font-semibold text-slate-500">
            Developed by{" "}
            <span className="text-orange-500 font-black">
              Delano Datty Soleman Manafe
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
