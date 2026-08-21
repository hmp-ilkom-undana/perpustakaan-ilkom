import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CircStatus } from "@/services/borrowing.service";

interface CirculationDetailHeaderProps {
  pickupCode: string;
  status: CircStatus;
  onBack: () => void;
}

export function CirculationDetailHeader({
  pickupCode,
  status,
  onBack,
}: CirculationDetailHeaderProps) {
  const getBadgeVariant = (s: CircStatus) => {
    switch (s) {
      case "REQUESTED":
        return "sky";
      case "WAITING_PICKUP":
        return "orange";
      case "BORROWED":
        return "emerald";
      case "OVERDUE":
        return "rose";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-5 bg-white border-2 border-blue-900 rounded-xl shadow-[4px_4px_0px_#1E3A8A]">
      <div className="flex items-center gap-3.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onBack}
          className="shrink-0 rounded-lg"
          aria-label="Kembali ke daftar sirkulasi"
        >
          <ArrowLeft className="w-5 h-5 text-blue-950" />
        </Button>
        <div>
          <h1 className="text-lg md:text-xl font-heading font-black text-blue-950 leading-tight">
            Detail Transaksi
          </h1>
          <p className="text-xs font-mono font-bold text-orange-600 tracking-wider">
            {pickupCode}
          </p>
        </div>
      </div>

      <Badge variant={getBadgeVariant(status)} className="text-xs px-3 py-1 font-black">
        {status}
      </Badge>
    </div>
  );
}
