import { usePetugasCirculation } from "@/hooks/usePetugasCirculation";
import {
  CirculationHeader,
  CirculationSearchBar,
  CirculationMobileTabs,
  CirculationStatusColumn,
  CirculationSkeleton,
} from "@/components/sirkulasi";

export default function Sirkulasi() {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    counts,
    columns,
    isLoading,
    handleNavigateToDetail,
  } = usePetugasCirculation();

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-130px)] gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. Header Section */}
      <CirculationHeader totalCount={counts.total} />

      {/* 2. Search Bar */}
      <div className="shrink-0">
        <CirculationSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* 3. Mobile Responsive Status Tabs */}
      <div className="shrink-0">
        <CirculationMobileTabs
          columns={columns}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </div>

      {/* 4. Kanban / Column Status Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading ? (
          <CirculationSkeleton />
        ) : (
          <div className="h-full flex flex-col md:flex-row gap-5 md:overflow-x-auto pb-2">
            {columns.map((column) => (
              <CirculationStatusColumn
                key={column.id}
                column={column}
                isActiveOnMobile={activeTab === column.id}
                onSelectCard={handleNavigateToDetail}
                isFiltered={Boolean(searchQuery.trim())}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
