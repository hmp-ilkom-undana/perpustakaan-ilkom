import { Link } from "@tanstack/react-router";
import { KeyRound, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LupaSandi() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E3A8A0A_1px,transparent_1px),linear-gradient(to_bottom,#1E3A8A0A_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border-2 border-blue-900 rounded-xl [box-shadow:8px_8px_0px_#1E3A8A] p-6 sm:p-8 relative z-10 space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-100 border-2 border-blue-900 text-blue-900 rounded-xl flex items-center justify-center mx-auto [box-shadow:4px_4px_0px_#1E3A8A]">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight">
            Lupa Kata Sandi
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            Ini halaman lupa sandi
          </p>
        </div>

        {/* Info Box Placeholder */}
        <div className="p-4 bg-amber-50 border-2 border-blue-900 rounded-lg [box-shadow:3px_3px_0px_#1E3A8A] flex items-start gap-3 text-xs text-blue-950 font-medium leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 mb-1">
              [ Modul Pemulihan Kata Sandi ]
            </p>
            <p className="text-slate-700">
              Kerangka halaman lupa sandi telah disiapkan. Fitur input email/NIM dan pengiriman token verifikasi akan disempurnakan pada tahap berikutnya.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="pt-2">
          <Link to="/login">
            <Button
              type="button"
              className="w-full h-11 bg-blue-900 hover:bg-blue-950 text-white font-black border-2 border-blue-900 rounded-lg [box-shadow:4px_4px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A] transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Halaman Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
