export function CirculationSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-3 lg:gap-4 overflow-hidden">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="w-full md:flex-1 md:min-w-0 flex flex-col gap-3">
          <div className="h-8 bg-slate-200/70 border-2 border-blue-900/20 rounded-lg animate-pulse" />
          <div className="space-y-2.5">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="h-28 bg-white border-2 border-blue-900/20 rounded-lg p-3 shadow-[2px_2px_0px_rgba(30,58,138,0.2)] animate-pulse flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="w-20 h-5 bg-slate-200 rounded" />
                  <div className="w-6 h-6 bg-slate-200 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="w-3/4 h-4 bg-slate-200 rounded" />
                  <div className="w-1/2 h-3 bg-slate-100 rounded" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="w-24 h-3 bg-slate-200 rounded" />
                  <div className="w-16 h-3 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
