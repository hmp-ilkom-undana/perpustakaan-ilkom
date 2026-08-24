import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-slate-200 border-2 border-slate-300 rounded" />
          <Skeleton className="h-4 w-96 bg-slate-200 border border-slate-300 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-36 bg-slate-200 border-2 border-slate-300 rounded" />
          <Skeleton className="h-9 w-24 bg-slate-200 border-2 border-slate-300 rounded" />
          <Skeleton className="h-9 w-36 bg-slate-200 border-2 border-slate-300 rounded" />
        </div>
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border-2 border-slate-300 rounded-lg p-5 shadow-[4px_4px_0px_#CBD5E1] space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28 bg-slate-200 rounded" />
              <Skeleton className="h-8 w-8 bg-slate-200 rounded" />
            </div>
            <Skeleton className="h-8 w-24 bg-slate-200 rounded" />
            <Skeleton className="h-4 w-full bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Main Visuals Grid (70% : 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7 bg-white border-2 border-slate-300 rounded-lg p-6 shadow-[4px_4px_0px_#CBD5E1] space-y-4">
          <Skeleton className="h-6 w-48 bg-slate-200 rounded" />
          <Skeleton className="h-4 w-72 bg-slate-100 rounded" />
          <Skeleton className="h-[280px] w-full bg-slate-100 rounded" />
        </div>
        <div className="lg:col-span-3 bg-white border-2 border-slate-300 rounded-lg p-6 shadow-[4px_4px_0px_#CBD5E1] space-y-4">
          <Skeleton className="h-6 w-40 bg-slate-200 rounded" />
          <Skeleton className="h-[140px] w-full bg-slate-100 rounded-full mx-auto max-w-[140px]" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-4 w-full bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Activity Grid (50% : 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-slate-300 rounded-lg p-6 shadow-[4px_4px_0px_#CBD5E1] space-y-4">
          <Skeleton className="h-6 w-48 bg-slate-200 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((k) => (
              <Skeleton key={k} className="h-14 w-full bg-slate-100 rounded" />
            ))}
          </div>
        </div>
        <div className="bg-white border-2 border-slate-300 rounded-lg p-6 shadow-[4px_4px_0px_#CBD5E1] space-y-4">
          <Skeleton className="h-6 w-48 bg-slate-200 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((l) => (
              <Skeleton key={l} className="h-10 w-full bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
