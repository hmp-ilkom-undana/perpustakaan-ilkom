import { Mail, Sparkles } from "lucide-react";

interface ProfileHeaderCardProps {
  name: string;
  nim?: string;
  email?: string;
  initials: string;
}

export function ProfileHeaderCard({
  name,
  nim,
  email,
  initials,
}: ProfileHeaderCardProps) {
  return (
    <div className="bg-white border-2 border-blue-900 rounded-lg p-4 sm:p-6 shadow-[4px_4px_0px_#1E3A8A] sm:shadow-[6px_6px_0px_#1E3A8A] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 z-10 w-full sm:w-auto">
        {/* Avatar Inisial Neo-Brutalist Responsif */}
        <div className="w-13 h-13 sm:w-18 sm:h-18 rounded-lg border-2 border-blue-900 bg-orange-100 text-blue-950 flex items-center justify-center font-black text-lg sm:text-2xl shrink-0 shadow-[2px_2px_0px_#1E3A8A] sm:shadow-[3px_3px_0px_#1E3A8A]">
          {initials}
        </div>

        {/* Informasi Mahasiswa */}
        <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
          <h1 className="text-base sm:text-2xl font-black text-blue-950 tracking-tight truncate max-w-full">
            {name || "Mahasiswa"}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm font-semibold text-slate-600">
            <span className="font-mono text-[10px] sm:text-xs font-black text-blue-950 bg-slate-100 border border-blue-900 px-1.5 sm:px-2 py-0.5 rounded-sm shadow-[1px_1px_0px_#1E3A8A]">
              NIM: {nim || "-"}
            </span>
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-600 font-medium truncate">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-900 shrink-0" />
              <span className="truncate">{email || "mahasiswa@ilkom.com"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tag Informasi Kanan (Desktop Only) */}
      <div className="hidden lg:flex items-center gap-2 bg-blue-50 border-2 border-blue-900 rounded-md px-4 py-2.5 shadow-[3px_3px_0px_#1E3A8A] shrink-0">
        <Sparkles className="w-5 h-5 text-blue-900 shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-blue-950">Panel Akun Mahasiswa</p>
          <p className="text-slate-600 font-medium">
            Kelola data kontak & keamanan sandi
          </p>
        </div>
      </div>
    </div>
  );
}
