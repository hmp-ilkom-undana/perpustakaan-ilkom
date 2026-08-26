import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideFabProps {
  onClick: () => void;
  className?: string;
}

export function GuideFab({ onClick, className }: GuideFabProps) {
  return (
    <div
      className={cn(
        "fixed top-1/2 -translate-y-1/2 right-3 sm:right-5 z-40 flex items-center group",
        className,
      )}
    >
      {/* Tooltip Label on Hover (Kiri FAB) */}
      <span className="mr-2.5 px-2.5 py-1 text-xs font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap">
        📖 Panduan
      </span>

      {/* Assistive Touch Style FAB */}
      <button
        onClick={onClick}
        aria-label="Buka panduan peminjaman arsip"
        className={cn(
          "w-12 h-12 sm:w-13 sm:h-13 rounded-full",
          "bg-amber-400 border-2 border-blue-900",
          "shadow-[4px_4px_0px_#1E3A8A]",
          "flex items-center justify-center shrink-0",
          "opacity-75 hover:opacity-100 active:opacity-100",
          "hover:bg-amber-300 hover:shadow-[5px_5px_0px_#1E3A8A]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          "transition-all duration-200 cursor-pointer outline-none",
          "animate-in fade-in-0 zoom-in-75 duration-300",
        )}
      >
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900" strokeWidth={2.5} />
      </button>
    </div>
  );
}

