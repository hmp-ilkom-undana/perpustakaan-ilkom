import { BookOpenCheck, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function EmptyBorrowingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border-2 border-blue-900 border-dashed rounded-lg shadow-[4px_4px_0px_#1E3A8A] text-center">
      <div className="bg-orange-100 border-2 border-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E3A8A]">
        <BookOpenCheck className="w-7 h-7 text-blue-950" />
      </div>
      <h3 className="text-base font-black text-blue-950">
        Tidak Ada Peminjaman Aktif
      </h3>
      <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm">
        Anda tidak memiliki arsip yang sedang dipinjam atau dalam proses antrean saat ini.
      </p>
      <div className="mt-5">
        <Link to="/mahasiswa/katalog">
          <Button size="sm" className="font-bold">
            <Search className="w-4 h-4 mr-1.5" />
            Jelajahi Katalog Arsip
          </Button>
        </Link>
      </div>
    </div>
  );
}
