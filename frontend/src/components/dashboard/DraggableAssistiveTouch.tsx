import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardQuota } from "@/hooks/useStudentDashboard";

interface DraggableAssistiveTouchProps {
  quota: DashboardQuota;
  onOpenQuota: () => void;
  onOpenGuide: () => void;
}

// ----------------------------------------------------
// 1. Independent Draggable Guide Button (Posisi Default: Kiri Bawah - Atas)
// ----------------------------------------------------
function DraggableGuideButton({
  onOpenGuide,
}: {
  onOpenGuide: () => void;
}) {
  const controls = useAnimationControls();
  const [isDragging, setIsDragging] = useState(false);
  const [side, setSide] = useState<"left" | "right">("left");
  const ref = useRef<HTMLDivElement>(null);

  // Posisi awal: Default Kanan Bawah pada Mobile, Kiri Bawah pada Desktop
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      const initialX = isMobile ? window.innerWidth - 54 : 16;
      const initialY = Math.max(100, window.innerHeight - 150);
      setSide(isMobile ? "right" : "left");
      controls.set({ x: initialX, y: initialY });
    }
  }, [controls]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 390;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 844;

    const currentX = info.point.x;
    const currentY = info.point.y;

    const minY = 70;
    const maxY = windowHeight - 70;
    const clampedY = Math.min(Math.max(currentY - 22, minY), maxY);

    const isCloserToLeft = currentX < windowWidth / 2;
    const targetX = isCloserToLeft ? 12 : windowWidth - 54;

    setSide(isCloserToLeft ? "left" : "right");

    controls.start({
      x: targetX,
      y: clampedY,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.8,
      },
    });

    setTimeout(() => {
      setIsDragging(false);
    }, 150);
  };

  const handleClick = () => {
    if (!isDragging) {
      onOpenGuide();
    }
  };

  return (
    <motion.div
      ref={ref}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      animate={controls}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="fixed z-50 top-0 left-0 touch-none select-none cursor-grab active:cursor-grabbing"
      style={{ willChange: "transform" }}
    >
      <div className="relative flex items-center group">
        {/* Tooltip Hover (Kiri / Kanan dinamis) */}
        <span
          className={cn(
            "absolute px-2 py-0.5 text-[11px] font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-50",
            side === "right"
              ? "right-full mr-2 -translate-x-1 group-hover:translate-x-0"
              : "left-full ml-2 translate-x-1 group-hover:translate-x-0"
          )}
        >
          📖 Panduan Peminjaman
        </span>

        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full",
            "bg-amber-400 border-2 border-blue-900",
            "shadow-[2.5px_2.5px_0px_#1E3A8A]",
            "hover:bg-amber-300 hover:shadow-[3.5px_3.5px_0px_#1E3A8A]",
            "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
            "flex items-center justify-center shrink-0",
            "transition-all duration-200 cursor-pointer outline-none"
          )}
          aria-label="Buka panduan peminjaman arsip"
        >
          <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-950" strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// 2. Independent Draggable Quota Button (Posisi Default: Kanan Bawah pada Mobile)
// ----------------------------------------------------
function DraggableQuotaButton({
  quota,
  onOpenQuota,
}: {
  quota: DashboardQuota;
  onOpenQuota: () => void;
}) {
  const controls = useAnimationControls();
  const [isDragging, setIsDragging] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");
  const ref = useRef<HTMLDivElement>(null);

  // Posisi awal: Default Kanan Bawah pada Mobile, Kiri Bawah pada Desktop
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      const initialX = isMobile ? window.innerWidth - 54 : 16;
      const initialY = Math.max(155, window.innerHeight - 95);
      setSide(isMobile ? "right" : "left");
      controls.set({ x: initialX, y: initialY });
    }
  }, [controls]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 390;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 844;

    const currentX = info.point.x;
    const currentY = info.point.y;

    const minY = 70;
    const maxY = windowHeight - 70;
    const clampedY = Math.min(Math.max(currentY - 22, minY), maxY);

    const isCloserToLeft = currentX < windowWidth / 2;
    const targetX = isCloserToLeft ? 12 : windowWidth - 54;

    setSide(isCloserToLeft ? "left" : "right");

    controls.start({
      x: targetX,
      y: clampedY,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.8,
      },
    });

    setTimeout(() => {
      setIsDragging(false);
    }, 150);
  };

  const handleClick = () => {
    if (!isDragging) {
      onOpenQuota();
    }
  };

  return (
    <motion.div
      ref={ref}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      animate={controls}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="fixed z-50 top-0 left-0 touch-none select-none cursor-grab active:cursor-grabbing"
      style={{ willChange: "transform" }}
    >
      <div className="relative flex items-center group">
        {/* Tooltip Hover (Kiri / Kanan dinamis) */}
        <span
          className={cn(
            "absolute px-2 py-0.5 text-[11px] font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-50",
            side === "right"
              ? "right-full mr-2 -translate-x-1 group-hover:translate-x-0"
              : "left-full ml-2 translate-x-1 group-hover:translate-x-0"
          )}
        >
          📊 Kuota Pinjam
        </span>

        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full",
            "bg-white border-2 border-blue-900",
            "shadow-[2.5px_2.5px_0px_#1E3A8A]",
            "hover:bg-orange-50 hover:shadow-[3.5px_3.5px_0px_#1E3A8A]",
            "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
            "flex items-center justify-center shrink-0",
            "transition-all duration-200 cursor-pointer outline-none relative"
          )}
          aria-label="Rincian kuota peminjaman"
        >
          <span className="font-mono font-black text-xs sm:text-sm text-blue-950 leading-none">
            {quota.terpakai}/{quota.maksimal}
          </span>

          {/* Status Dot Indikator */}
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-blue-900 shadow-[0.5px_0.5px_0px_#1E3A8A]",
              quota.isFull
                ? "bg-rose-500"
                : quota.sisa <= 1
                ? "bg-amber-400"
                : "bg-emerald-500"
            )}
          />
        </button>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// 3. Composite Export
// ----------------------------------------------------
export function DraggableAssistiveTouch({
  quota,
  onOpenQuota,
  onOpenGuide,
}: DraggableAssistiveTouchProps) {
  return (
    <>
      <DraggableGuideButton onOpenGuide={onOpenGuide} />
      <DraggableQuotaButton quota={quota} onOpenQuota={onOpenQuota} />
    </>
  );
}
