import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FineData {
  totalDenda: number;
  fineBorrowings: any[];
}

interface FineSummaryCardProps {
  denda: FineData;
  className?: string;
}

export function FineSummaryCard({ denda, className }: FineSummaryCardProps) {
  const { totalDenda, fineBorrowings } = denda;
  const hasFine = totalDenda > 0 && fineBorrowings.length > 0;

  return (
    <Card
      className={cn(
        "bg-white flex flex-col justify-between overflow-hidden transition-colors",
        hasFine
          ? "border-2 border-red-600 shadow-[4px_4px_0px_#DC2626]"
          : "border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A]",
        className,
      )}
    >
      <CardHeader
        className={cn(
          "p-4 sm:p-5 pb-3 border-b-2 flex flex-row items-center justify-between gap-2 shrink-0",
          hasFine
            ? "border-red-600 bg-red-50/80"
            : "border-blue-900 bg-slate-50",
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
              hasFine
                ? "bg-red-100 border-red-600 text-red-600 shadow-[1px_1px_0px_#DC2626]"
                : "bg-emerald-100 border-blue-900 text-emerald-700 shadow-[1px_1px_0px_#1E3A8A]",
            )}
          >
            {hasFine ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            )}
          </div>
          <div className="flex flex-col">
            <CardTitle
              className={cn(
                "text-xs sm:text-sm font-black uppercase tracking-wider leading-tight",
                hasFine ? "text-red-950" : "text-blue-950",
              )}
            >
              Tunggakan Denda
            </CardTitle>
            <span
              className={cn(
                "text-[11px] font-bold mt-0.5",
                hasFine ? "text-red-700" : "text-emerald-700",
              )}
            >
              {hasFine ? `${fineBorrowings.length} Arsip Menunggak` : "Bebas Denda"}
            </span>
          </div>
        </div>

        <Badge variant={hasFine ? "rose" : "emerald"}>
          Total: Rp {totalDenda.toLocaleString("id-ID")}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
        {!hasFine ? (
          <div className="py-5 px-4 flex flex-col items-center justify-center text-center my-auto">
            <div className="bg-emerald-50 border border-emerald-300 w-10 h-10 rounded-full flex items-center justify-center mb-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-black text-xs sm:text-sm text-blue-950">
              Tidak Ada Tunggakan Denda
            </h3>
            <p className="text-slate-500 text-[11px] font-medium mt-0.5 max-w-xs">
              Akun Anda bersih dan tidak memiliki tanggungan denda keterlambatan atau kerusakan arsip.
            </p>
          </div>
        ) : (
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
        )}

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
