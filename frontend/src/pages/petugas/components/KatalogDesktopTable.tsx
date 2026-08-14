import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { CatalogItem } from "@/types/katalog";

interface Props {
  data: CatalogItem[];
  isLoading: boolean;
  currentPage: number;
  pageSize?: number;
  onDetail: (item: CatalogItem) => void;
  onEdit: (item: CatalogItem) => void;
  onDelete: (item: CatalogItem) => void;
}

export function KatalogDesktopTable({
  data,
  isLoading,
  currentPage,
  pageSize = 10,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <Table>
        <TableHeader className="bg-slate-100 border-b-2 border-blue-900">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[50px] font-black text-blue-900 text-center">
              NO.
            </TableHead>
            <TableHead className="w-[125px] font-black text-blue-900 text-center">
              KODE ARSIP
            </TableHead>
            <TableHead className="font-black text-blue-900 text-left min-w-[280px]">
              INFO ARSIP
            </TableHead>
            <TableHead className="font-black text-blue-900 text-left w-[180px]">
              JENIS / KATEGORI
            </TableHead>
            <TableHead className="font-black text-blue-900 text-left w-[110px]">
              LOKASI
            </TableHead>
            <TableHead className="w-[80px] font-black text-blue-900 text-center">
              STOK
            </TableHead>
            <TableHead className="w-[140px] font-black text-blue-900 text-center">
              AKSI
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y-2 divide-blue-900/10">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="font-bold text-slate-500 animate-pulse">
                  [ Memuat Data Arsip... ]
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 font-bold text-slate-500">
                Data tidak ditemukan
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item.id}
                className="hover:bg-slate-50/80 transition-colors border-none group"
              >
                {/* NOMOR URUT */}
                <TableCell className="text-center font-black text-slate-500 text-xs">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>

                {/* KODE ARSIP */}
                <TableCell className="font-mono text-xs font-black text-center">
                  <span className="inline-block bg-amber-300 text-blue-950 px-2.5 py-1 border border-blue-900 shadow-[1.5px_1.5px_0px_#1E3A8A] tracking-wider">
                    {item.archiveCode}
                  </span>
                </TableCell>

                {/* INFO ARSIP (JUDUL & PENULIS) */}
                <TableCell className="max-w-[360px] lg:max-w-[480px]">
                  <div className="flex flex-col pr-2">
                    <button
                      type="button"
                      onClick={() => onDetail(item)}
                      className="text-left block w-full group/title cursor-pointer"
                      title={`Klik untuk melihat detail: "${item.title}"`}
                    >
                      <span className="block font-black text-blue-950 text-base leading-snug line-clamp-2 overflow-hidden text-ellipsis group-hover/title:text-orange-600 transition-colors">
                        {item.title}
                      </span>
                    </button>
                    <span className="font-semibold text-slate-600 mt-1 text-xs tracking-tight">
                      {item.author} •{" "}
                      <span className="text-slate-500">{item.year}</span>
                    </span>
                  </div>
                </TableCell>

                {/* JENIS & KATEGORI */}
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <Badge
                      variant="outline"
                      className="text-xs border-2 border-blue-900 text-blue-900 font-bold bg-white shadow-[1px_1px_0px_#1E3A8A]"
                    >
                      {item.type}
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </TableCell>

                {/* LOKASI */}
                <TableCell className="font-semibold text-slate-700 text-sm">
                  {item.location ? (
                    item.location
                  ) : (
                    <span className="text-slate-400 font-normal italic">-</span>
                  )}
                </TableCell>

                {/* STOK */}
                <TableCell className="text-center">
                  <Badge
                    variant={item.stock > 0 ? "default" : "destructive"}
                    className={`border-2 border-blue-900 font-black uppercase text-xs ${
                      item.stock > 0
                        ? "bg-emerald-400 text-blue-900 hover:bg-emerald-500 shadow-[2px_2px_0px_#1E3A8A]"
                        : "bg-red-500 text-white shadow-[2px_2px_0px_#1E3A8A]"
                    }`}
                  >
                    {item.stock}
                  </Badge>
                </TableCell>

                {/* AKSI */}
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDetail(item)}
                      className="h-8 w-8 border-2 border-blue-900 text-blue-950 bg-amber-200 hover:bg-amber-300 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                      title="Lihat Detail Lengkap"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 border-2 border-blue-900 text-blue-900 bg-white hover:bg-blue-50 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                      title="Edit Data Arsip"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(item)}
                      className="h-8 w-8 border-2 border-blue-900 text-red-600 bg-red-50 hover:bg-red-100 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                      title="Hapus Arsip"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
