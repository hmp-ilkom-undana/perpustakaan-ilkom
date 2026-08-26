import {
  Search,
  ClipboardList,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideStep } from "@/hooks/useStudentGuide";
import { GuideHighlightBadge } from "./GuideHighlightBadge";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Search,
  ClipboardList,
  ShieldCheck,
  QrCode,
  AlertTriangle,
};

const COLOR_MAP: Record<
  GuideStep["colorKey"],
  { bg: string; border: string; iconBg: string; iconColor: string }
> = {
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-700",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-700",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-700",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
};

interface GuideStepContentProps {
  step: GuideStep;
}

export function GuideStepContent({ step }: GuideStepContentProps) {
  const Icon = ICON_MAP[step.iconName] ?? Search;
  const colors = COLOR_MAP[step.colorKey];

  return (
    <div className="flex flex-col gap-5">
      {/* Icon + Title Area */}
      <div className={cn("flex items-start gap-4 p-4 rounded-xl border-2", colors.bg, colors.border)}>
        <div
          className={cn(
            "w-12 h-12 rounded-lg border-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1E3A8A]",
            colors.iconBg,
            colors.border,
          )}
        >
          <Icon className={cn("w-6 h-6", colors.iconColor)} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {step.subtitle}
          </p>
          <h3 className="text-lg font-black text-blue-950 leading-tight">
            {step.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm font-medium text-slate-600 leading-relaxed px-1">
        {step.description}
      </p>

      {/* Highlight Badges */}
      <div className="grid grid-cols-1 gap-3">
        {step.highlights.map((h, i) => (
          <GuideHighlightBadge key={i} label={h.label} value={h.value} />
        ))}
      </div>
    </div>
  );
}
