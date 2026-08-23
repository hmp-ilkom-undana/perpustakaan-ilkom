import { History, Calendar, ShieldCheck, UserCheck } from "lucide-react";
import type { ActivityLogStats } from "@/services/activity-log.service";

interface LogStatsHeaderProps {
  stats?: ActivityLogStats;
  isLoading: boolean;
}

export function LogStatsHeader({ stats, isLoading }: LogStatsHeaderProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="w-8 h-8 rounded-lg bg-slate-200" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-24 bg-slate-300 rounded" />
              <div className="h-3 w-32 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Aktivitas",
      value: stats?.totalLogs ?? 0,
      description: "Semua riwayat log tercatat",
      icon: History,
      color: "text-blue-900",
      bgBadge: "bg-blue-100",
      iconColor: "text-blue-900",
    },
    {
      title: "Aktivitas Hari Ini",
      value: stats?.todayLogs ?? 0,
      description: "Aksi per hari ini (00:00 WIB)",
      icon: Calendar,
      color: "text-emerald-700",
      bgBadge: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      title: "Aksi Administrator",
      value: stats?.adminLogs ?? 0,
      description: "Aksi oleh akun Admin",
      icon: ShieldCheck,
      color: "text-purple-700",
      bgBadge: "bg-purple-100",
      iconColor: "text-purple-700",
    },
    {
      title: "Aksi Petugas",
      value: stats?.petugasLogs ?? 0,
      description: "Operasional meja sirkulasi",
      icon: UserCheck,
      color: "text-orange-600",
      bgBadge: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] flex flex-col justify-between gap-3 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${item.color}`}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </span>
              <div
                className={`w-8 h-8 rounded-lg ${item.bgBadge} border-2 border-blue-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E3A8A]`}
              >
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                {item.value.toLocaleString("id-ID")}
              </p>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
