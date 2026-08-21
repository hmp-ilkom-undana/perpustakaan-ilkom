import { Mail, GraduationCap, Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="bg-white border-2 border-blue-900 rounded-lg p-6 shadow-[6px_6px_0px_#1E3A8A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
      <div className="flex items-center gap-5 z-10">
        {/* Avatar Inisial Neo-Brutalist */}
        <div className="w-20 h-20 rounded-lg border-2 border-blue-900 bg-orange-100 text-blue-950 flex items-center justify-center font-black text-2xl shrink-0 shadow-[3px_3px_0px_#1E3A8A]">
          {initials}
        </div>

        {/* Informasi Mahasiswa */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-blue-950 tracking-tight">
              {name || "Mahasiswa"}
            </h1>
            <Badge
              variant="outline"
              className="bg-amber-100 text-blue-950 border-2 border-blue-900 font-black text-xs px-2.5 py-0.5 shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-900" />
              Mahasiswa ILKOM
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-slate-600">
            <span className="font-mono text-xs font-black text-blue-950 bg-slate-100 border border-blue-900 px-2 py-0.5 rounded-sm shadow-[1px_1px_0px_#1E3A8A]">
              NIM: {nim || "-"}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Mail className="w-3.5 h-3.5 text-blue-900" />
              {email || "mahasiswa@ilkom.com"}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Akun Portal Layanan Peminjaman Mahasiswa
          </p>
        </div>
      </div>

      {/* Tag Informasi Kanan */}
      <div className="hidden lg:flex items-center gap-2 bg-blue-50 border-2 border-blue-900 rounded-md px-4 py-2.5 shadow-[3px_3px_0px_#1E3A8A]">
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
