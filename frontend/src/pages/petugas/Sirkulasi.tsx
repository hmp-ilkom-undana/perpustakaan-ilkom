import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  Package,
  BookOpen,
  AlertCircle,
  ScanBarcode,
} from "lucide-react";
import {
  getCirculationData,
  CirculationItem,
  CircStatus,
} from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function Sirkulasi() {
  const navigate = useNavigate();
  const [data, setData] = useState<CirculationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CircStatus>("REQUESTED");

  useEffect(() => {
    // Fetch initial data
    setData(getCirculationData());
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const requestedItems = filteredData.filter((i) => i.status === "REQUESTED");
  const waitingItems = filteredData.filter(
    (i) => i.status === "WAITING_PICKUP",
  );
  const borrowedItems = filteredData.filter((i) => i.status === "BORROWED");
  const overdueItems = filteredData.filter((i) => i.status === "OVERDUE");

  const getStatusConfig = (status: CircStatus) => {
    switch (status) {
      case "REQUESTED":
        return {
          icon: Clock,
          color: "text-blue-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
        };
      case "WAITING_PICKUP":
        return {
          icon: Package,
          color: "text-orange-500",
          bg: "bg-orange-50",
          border: "border-orange-200",
        };
      case "BORROWED":
        return {
          icon: BookOpen,
          color: "text-emerald-500",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
        };
      case "OVERDUE":
        return {
          icon: AlertCircle,
          color: "text-rose-500",
          bg: "bg-rose-50",
          border: "border-rose-200",
        };
      default:
        return {
          icon: Clock,
          color: "text-slate-500",
          bg: "bg-slate-50",
          border: "border-slate-200",
        };
    }
  };

  const renderCard = (item: CirculationItem) => {
    const config = getStatusConfig(item.status);
    const Icon = config.icon;

    return (
      <div
        key={item.id}
        onClick={() => navigate(`/petugas/sirkulasi/${item.id}`)}
        className="group relative bg-white border border-slate-200 p-4 rounded-xl cursor-pointer hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
      >
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="outline"
            className={`${config.bg} ${config.color} ${config.border} rounded-md font-bold text-[10px] tracking-wider px-2 py-0.5 border-transparent`}
          >
            {item.id}
          </Badge>
          <div className="p-1.5 rounded-full bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
          {item.archiveTitle}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-3">
          {item.archiveType}
        </p>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Peminjam
            </span>
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
              {item.studentName}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
            {item.studentId}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* SUPER SEARCH BAR */}
      <div className="mb-6 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-xl pb-2 pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-4 hidden md:block">
          Pemantauan Sirkulasi
        </h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm"
            placeholder="Ketik Kode Pengajuan (Contoh: REQ-XXXX)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"></div>
        </div>
      </div>

      {/* MOBILE TABS */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-4">
        {[
          {
            id: "REQUESTED",
            label: "Menunggu ACC",
            count: requestedItems.length,
          },
          {
            id: "WAITING_PICKUP",
            label: "Siap Diambil",
            count: waitingItems.length,
          },
          {
            id: "BORROWED",
            label: "Sedang Dipinjam",
            count: borrowedItems.length,
          },
          { id: "OVERDUE", label: "Terlambat", count: overdueItems.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CircStatus)}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#0F172A] text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200"
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* DESKTOP KANBAN / MOBILE LIST */}
      <div className="flex-1 min-h-0">
        <div className="h-full flex flex-col md:flex-row gap-6 md:overflow-x-auto pb-4">
          {/* KANBAN COLUMN 1: REQUESTED */}
          <div
            className={`flex-shrink-0 w-full md:w-80 flex flex-col h-full ${activeTab !== "REQUESTED" ? "hidden md:flex" : "flex"}`}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Menunggu ACC
              </h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {requestedItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4 no-scrollbar">
              {requestedItems.map(renderCard)}
              {requestedItems.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-8">
                  Kosong
                </p>
              )}
            </div>
          </div>

          {/* KANBAN COLUMN 2: WAITING_PICKUP */}
          <div
            className={`flex-shrink-0 w-full md:w-80 flex flex-col h-full ${activeTab !== "WAITING_PICKUP" ? "hidden md:flex" : "flex"}`}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                Siap Diambil
              </h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {waitingItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4 no-scrollbar">
              {waitingItems.map(renderCard)}
              {waitingItems.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-8">
                  Kosong
                </p>
              )}
            </div>
          </div>

          {/* KANBAN COLUMN 3: BORROWED */}
          <div
            className={`flex-shrink-0 w-full md:w-80 flex flex-col h-full ${activeTab !== "BORROWED" ? "hidden md:flex" : "flex"}`}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Sedang Dipinjam
              </h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {borrowedItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4 no-scrollbar">
              {borrowedItems.map(renderCard)}
              {borrowedItems.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-8">
                  Kosong
                </p>
              )}
            </div>
          </div>

          {/* KANBAN COLUMN 4: OVERDUE */}
          <div
            className={`flex-shrink-0 w-full md:w-80 flex flex-col h-full ${activeTab !== "OVERDUE" ? "hidden md:flex" : "flex"}`}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Terlambat
              </h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {overdueItems.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4 no-scrollbar">
              {overdueItems.map(renderCard)}
              {overdueItems.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-8">
                  Kosong
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
