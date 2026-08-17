import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Check, Info, AlertTriangle, X, Loader2 } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      duration={4500}
      closeButton
      icons={{
        success: (
          <div className="w-6 h-6 shrink-0 bg-emerald-400 border-2 border-blue-900 flex items-center justify-center text-blue-950 shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ),
        info: (
          <div className="w-6 h-6 shrink-0 bg-blue-400 border-2 border-blue-900 flex items-center justify-center text-blue-950 shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <Info className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ),
        warning: (
          <div className="w-6 h-6 shrink-0 bg-amber-400 border-2 border-blue-900 flex items-center justify-center text-blue-950 shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ),
        error: (
          <div className="w-6 h-6 shrink-0 bg-red-500 border-2 border-blue-900 flex items-center justify-center text-white shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <X className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        ),
        loading: (
          <div className="w-6 h-6 shrink-0 bg-orange-400 border-2 border-blue-900 flex items-center justify-center text-blue-950 shadow-[1.5px_1.5px_0px_#1E3A8A]">
            <Loader2 className="w-3.5 h-3.5 stroke-[3] animate-spin" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans border-2 border-blue-900 bg-white text-blue-950 [box-shadow:4px_4px_0px_#1E3A8A] rounded-none p-4 flex items-center gap-3 w-full sm:max-w-md",
          title: "font-black text-sm text-blue-950 leading-tight tracking-tight",
          description: "text-xs font-semibold text-slate-600 mt-0.5",
          actionButton:
            "bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] px-3 py-1 text-xs",
          cancelButton:
            "bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border-2 border-blue-900 px-3 py-1 text-xs",
          success: "!bg-emerald-50 !border-2 !border-blue-900 !text-blue-950",
          error: "!bg-red-50 !border-2 !border-blue-900 !text-red-950",
          warning: "!bg-amber-50 !border-2 !border-blue-900 !text-amber-950",
          info: "!bg-blue-50 !border-2 !border-blue-900 !text-blue-950",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
