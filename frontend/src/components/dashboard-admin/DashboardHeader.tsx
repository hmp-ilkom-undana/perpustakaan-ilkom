import { Calendar, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DashboardPeriod } from "@/services/dashboard.service";

interface DashboardHeaderProps {
  period: DashboardPeriod;
  onPeriodChange: (val: string) => void;
  onExportLpj: () => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function DashboardHeader({
  period,
  onPeriodChange,
  onExportLpj,
  onRefresh,
  isFetching = false,
}: DashboardHeaderProps) {
  const periodLabelMap: Record<DashboardPeriod, string> = {
    hari_ini: "Hari Ini",
    "7_hari": "7 Hari Terakhir",
    bulan_ini: "Bulan Ini",
    semester_ini: "Semester Ini",
    tahun_ini: "Tahun Akademik",
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
          Dashboard Administrator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
          Ringkasan eksekutif sirkulasi arsip, performa kas denda, dan tren topik riset akademik.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Time Period Filter Dropdown */}
        <Select value={period} onValueChange={(val) => { if (val) onPeriodChange(val); }}>
          <SelectTrigger className="h-9 px-3 text-xs font-bold border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] rounded-md hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-2 w-auto focus:ring-0">
            <Calendar className="w-3.5 h-3.5 text-blue-900 shrink-0" />
            <span className="text-[11px] font-black uppercase text-blue-950 tracking-wider">
              Periode:
            </span>
            <SelectValue placeholder="Pilih Periode">
              {periodLabelMap[period]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end" className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] font-semibold text-xs min-w-[160px] rounded-md">
            <SelectItem value="hari_ini">Hari Ini</SelectItem>
            <SelectItem value="7_hari">7 Hari Terakhir</SelectItem>
            <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
            <SelectItem value="semester_ini">Semester Ini</SelectItem>
            <SelectItem value="tahun_ini">Tahun Akademik</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 px-3 text-xs font-bold border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin text-blue-900" : ""}`} />
          Segarkan
        </Button>

        {/* Export LPJ Button */}
        <Button
          size="sm"
          onClick={onExportLpj}
          className="h-9 px-3.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Unduh Laporan
        </Button>
      </div>
    </div>
  );
}
