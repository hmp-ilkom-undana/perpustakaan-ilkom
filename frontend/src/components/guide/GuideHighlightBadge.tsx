interface GuideHighlightBadgeProps {
  label: string;
  value: string;
}

export function GuideHighlightBadge({ label, value }: GuideHighlightBadgeProps) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg border-2 border-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A]">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span className="text-sm font-black text-blue-950 leading-tight">
        {value}
      </span>
    </div>
  );
}
