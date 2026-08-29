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
// 1. Independent Draggable Quota Button
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

  // Posisi awal: Kanan atas
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialX = window.innerWidth - 68;
      const initialY = 95;
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

    const minY = 80;
    const maxY = windowHeight - 80;
    const clampedY = Math.min(Math.max(currentY - 26, minY), maxY);

    const isCloserToLeft = currentX < windowWidth / 2;
    const targetX = isCloserToLeft ? 12 : windowWidth - 68;

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
            "absolute px-2.5 py-1 text-xs font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-50",
            side === "right"
              ? "right-full mr-2.5 -translate-x-1 group-hover:translate-x-0"
              : "left-full ml-2.5 translate-x-1 group-hover:translate-x-0"
          )}
        >
          📊 Kuota Pinjam
        </span>

        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "w-12 h-12 sm:w-13 sm:h-13 rounded-full",
            "bg-white border-2 border-blue-900",
            "shadow-[3px_3px_0px_#1E3A8A]",
            "hover:bg-orange-50 hover:shadow-[4px_4px_0px_#1E3A8A]",
            "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
            "flex items-center justify-center shrink-0",
            "transition-all duration-200 cursor-pointer outline-none relative"
          )}
          aria-label="Rincian kuota peminjaman"
        >
          <span className="font-mono font-black text-sm sm:text-base text-blue-950 leading-none">
            {quota.terpakai}/{quota.maksimal}
          </span>

          {/* Status Dot Indikator */}
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]",
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
// 2. Independent Draggable Guide Button
// ----------------------------------------------------
function DraggableGuideButton({
  onOpenGuide,
}: {
  onOpenGuide: () => void;
}) {
  const controls = useAnimationControls();
  const [isDragging, setIsDragging] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");
  const ref = useRef<HTMLDivElement>(null);

  // Posisi awal: Tepat di bawah tombol kuota
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialX = window.innerWidth - 68;
      const initialY = 160;
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

    const minY = 80;
    const maxY = windowHeight - 80;
    const clampedY = Math.min(Math.max(currentY - 26, minY), maxY);

    const isCloserToLeft = currentX < windowWidth / 2;
    const targetX = isCloserToLeft ? 12 : windowWidth - 68;

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
            "absolute px-2.5 py-1 text-xs font-black text-blue-950 bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none hidden sm:inline-block select-none whitespace-nowrap z-50",
            side === "right"
              ? "right-full mr-2.5 -translate-x-1 group-hover:translate-x-0"
              : "left-full ml-2.5 translate-x-1 group-hover:translate-x-0"
          )}
        >
          📖 Panduan Peminjaman
        </span>

        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "w-12 h-12 sm:w-13 sm:h-13 rounded-full",
            "bg-amber-400 border-2 border-blue-900",
            "shadow-[3px_3px_0px_#1E3A8A]",
            "hover:bg-amber-300 hover:shadow-[4px_4px_0px_#1E3A8A]",
            "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
            "flex items-center justify-center shrink-0",
            "transition-all duration-200 cursor-pointer outline-none"
          )}
          aria-label="Buka panduan peminjaman arsip"
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-950" strokeWidth={2.5} />
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
      <DraggableQuotaButton quota={quota} onOpenQuota={onOpenQuota} />
      <DraggableGuideButton onOpenGuide={onOpenGuide} />
    </>
  );
}
