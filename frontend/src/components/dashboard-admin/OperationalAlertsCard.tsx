import { Activity, AlertTriangle, CircleAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AlertItem {
  id: string;
  title: string;
  detail: string;
  desc: string;
  type: "danger" | "warning" | "info";
  targetUrl: string;
}

interface OperationalAlertsCardProps {
  alerts: AlertItem[];
  onNavigate: (path: string) => void;
}

export function OperationalAlertsCard({ alerts, onNavigate }: OperationalAlertsCardProps) {
  return (
    <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-lg bg-white overflow-hidden">
      <CardHeader className="border-b-2 border-blue-900 bg-slate-50/50 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-400 border border-blue-900 flex items-center justify-center text-blue-950 shadow-[1px_1px_0px_#1E3A8A]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-black text-blue-950">
              Perhatian Operasional
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-500">
              Antrean dan kendala yang memerlukan tindakan segera dari petugas
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {alerts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">Semua Operasional Lancar</p>
            <p className="text-xs text-slate-500 font-medium">
              Tidak ada pengajuan menunggak, keterlambatan parah, atau kendala loket saat ini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onNavigate(alert.targetUrl)}
                className="flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                {/* Icon based on alert type */}
                <div className="shrink-0 mr-3.5">
                  {alert.type === "danger" && (
                    <div className="w-9 h-9 rounded-md bg-rose-100 border-2 border-rose-600 flex items-center justify-center shadow-[1px_1px_0px_#E11D48]">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    </div>
                  )}
                  {alert.type === "warning" && (
                    <div className="w-9 h-9 rounded-md bg-amber-100 border-2 border-amber-600 flex items-center justify-center shadow-[1px_1px_0px_#D97706]">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                  )}
                  {alert.type === "info" && (
                    <div className="w-9 h-9 rounded-md bg-blue-100 border-2 border-blue-900 flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
                      <CircleAlert className="w-4 h-4 text-blue-900" />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-black text-blue-950 truncate">
                      {alert.title}
                    </p>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-50 border border-blue-900 text-blue-950">
                      {alert.detail}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                    {alert.desc}
                  </p>
                </div>

                {/* Arrow Action */}
                <div className="ml-3 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded border-2 border-blue-900 shadow-[1px_1px_0px_#1E3A8A] group-hover:bg-blue-900 group-hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
