import { ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CirculationHeaderProps {
  totalCount: number;
}

export function CirculationHeader({ totalCount }: CirculationHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 text-white border-2 border-blue-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#1E3A8A] shrink-0">
          <ArrowRightLeft className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
            Pemantauan Sirkulasi
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">
            Pantau pergerakan arsip fisik, konfirmasi penyerahan, dan catat pengembalian arsip.
          </p>
        </div>
      </div>

      <Badge variant="outline" className="w-fit self-start sm:self-auto font-black">
        {totalCount === 0 ? "Tidak Ada Transaksi Aktif" : `${totalCount} Transaksi Aktif`}
      </Badge>
    </div>
  );
}
