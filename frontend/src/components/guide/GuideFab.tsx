import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideFabProps {
  onClick: () => void;
  className?: string;
}

export function GuideFab({ onClick, className }: GuideFabProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Buka panduan peminjaman arsip"
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "w-14 h-14 rounded-full",
        "bg-amber-400 border-2 border-blue-900",
        "shadow-[4px_4px_0px_#1E3A8A]",
        "flex items-center justify-center",
        "hover:bg-amber-300 hover:-translate-y-0.5",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        "transition-all duration-150",
        "animate-in fade-in-0 zoom-in-75 duration-300",
        className,
      )}
    >
      <BookOpen className="w-6 h-6 text-blue-900" strokeWidth={2.5} />
    </button>
  );
}
