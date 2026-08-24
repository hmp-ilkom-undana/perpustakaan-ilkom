import { History, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecentLogItem {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  description: string;
  createdAt: string;
}

interface RecentActivityStreamProps {
  logs: RecentLogItem[];
  onNavigate: (path: string) => void;
}

export function RecentActivityStream({ logs, onNavigate }: RecentActivityStreamProps) {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return "--:--";
    }
  };

  return (
    <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-lg bg-white overflow-hidden flex flex-col justify-between">
      <CardHeader className="border-b-2 border-blue-900 bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-900 text-white flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-black text-blue-950">
                Log Aktivitas Sistem
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500">
                Audit trail transaksi dan aksi operasional terbaru
              </CardDescription>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/admin/log-aktivitas")}
            className="text-xs font-bold text-blue-900 hover:text-blue-950 hover:bg-blue-50 p-1.5 h-auto cursor-pointer"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 flex-1">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">
            Belum ada aktivitas tercatat hari ini.
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200" />

            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-7 flex flex-col gap-0.5">
                  {/* Timeline Dot */}
                  <div className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-900 ring-4 ring-white" />

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-blue-950 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {formatTime(log.createdAt)}
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[140px] sm:max-w-[200px]">
                      {log.userName}
                    </span>
                    <Badge
                      className={`text-[9px] font-black uppercase px-1 py-0 border ${
                        log.userRole === "ADMIN"
                          ? "bg-purple-100 text-purple-950 border-purple-300"
                          : "bg-amber-100 text-amber-950 border-amber-300"
                      }`}
                    >
                      {log.userRole}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">
                    {log.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
