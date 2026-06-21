import { AlertCircle, ArchiveX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CatalogState({ type, message, onReset }) {
  const state = getState(type);
  const Icon = state.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${state.iconClass}`}
      >
        <Icon
          className={`h-7 w-7 ${type === "loading" ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
      </div>
      <h2 className="text-lg font-extrabold text-slate-900">{state.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {message || state.message}
      </p>
      {type === "empty" && onReset ? (
        <Button
          type="button"
          onClick={onReset}
          className="mt-5 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
        >
          Reset Filter
        </Button>
      ) : null}
    </div>
  );
}

function getState(type) {
  if (type === "loading") {
    return {
      icon: Loader2,
      title: "Memuat katalog",
      message: "Mengambil data dari server.",
      iconClass: "bg-blue-50 text-blue-600",
    };
  }

  if (type === "error") {
    return {
      icon: AlertCircle,
      title: "Katalog gagal dimuat",
      message: "Coba muat ulang halaman atau periksa server API.",
      iconClass: "bg-red-50 text-red-600",
    };
  }

  return {
    icon: ArchiveX,
    title: "Arsip tidak ditemukan",
    message: "Tidak ada arsip yang cocok dengan filter saat ini.",
    iconClass: "bg-slate-100 text-slate-500",
  };
}
