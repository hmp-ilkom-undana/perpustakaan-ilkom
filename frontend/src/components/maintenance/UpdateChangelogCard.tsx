import React from "react";
import { Sparkles, CheckCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UpdateChangelogCardProps {
  changelog?: string[];
}

export const UpdateChangelogCard: React.FC<UpdateChangelogCardProps> = ({
  changelog = [],
}) => {
  const defaultItems = [
    "Peningkatan performa pencarian katalog skripsi dan arsip ilmiah",
    "Penyempurnaan antarmuka pengguna dengan responsivitas optimal",
    "Integrasi notifikasi status peminjaman otomatis via WhatsApp",
  ];

  const items = changelog && changelog.length > 0 ? changelog : defaultItems;

  return (
    <div className="bg-white border-2 border-blue-900 rounded-lg p-5 sm:p-6 shadow-[6px_6px_0px_#1E3A8A] max-w-xl mx-auto text-left relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-orange-100 border-2 border-blue-900 flex items-center justify-center text-orange-600 shadow-[2px_2px_0px_#1E3A8A]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-blue-950 tracking-tight">
              Daftar Pembaruan Fitur
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 p-2.5 rounded-md bg-slate-50 border border-slate-200 hover:border-blue-900 transition-colors"
          >
            <div className="mt-0.5 w-5 h-5 rounded bg-emerald-100 border border-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              {item}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Peningkatan Keamanan & Kecepatan
        </span>
      </div>
    </div>
  );
};
