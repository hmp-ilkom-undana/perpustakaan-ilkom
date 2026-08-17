import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FineData {
  totalDenda: number;
  fineBorrowings: any[];
}

interface FineSummaryCardProps {
  denda: FineData;
}

export function FineSummaryCard({ denda }: FineSummaryCardProps) {
  const { totalDenda, fineBorrowings } = denda;

  if (totalDenda <= 0) return null;

  return (
    <Card className="border-2 border-red-600 shadow-[4px_4px_0px_#DC2626] bg-white flex flex-col justify-between overflow-hidden">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b-2 border-red-600 bg-red-50/80 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="flex flex-col">
            <CardTitle className="text-xs sm:text-sm font-black text-red-950 uppercase tracking-wider leading-tight">
              Tunggakan Denda
            </CardTitle>
            <span className="text-[11px] font-bold text-red-700 mt-0.5">
              {fineBorrowings.length} Arsip
            </span>
          </div>
        </div>
        <Badge variant="rose">
          Total: Rp {totalDenda.toLocaleString("id-ID")}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
          {fineBorrowings.map((fb: any) => {
            const isOverdue = fb.status === "OVERDUE";
            const isDamaged = fb.status === "DAMAGED";
            const isLost = fb.status === "LOST";

            return (
              <div
                key={fb.id}
                className="flex items-center justify-between p-2.5 bg-red-50/50 border border-red-200 rounded-md gap-3"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant={isOverdue || isLost ? "rose" : "amber"}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {isOverdue
                        ? "TERLAMBAT"
                        : isDamaged
                        ? "RUSAK"
                        : isLost
                        ? "HILANG"
                        : "DENDA"}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-black text-blue-950 truncate">
                    {fb.archive?.title}
                  </h4>
                </div>

                <span className="text-xs font-black text-red-600 shrink-0">
                  Rp {(fb.fineAmount || 0).toLocaleString("id-ID")}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <Link to="/mahasiswa/peminjaman">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-black text-blue-950 hover:bg-slate-100 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A]"
            >
              Buka Detail Peminjaman
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
