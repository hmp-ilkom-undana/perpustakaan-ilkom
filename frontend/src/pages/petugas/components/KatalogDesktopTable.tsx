import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { CatalogItem } from "@/types/katalog";

interface Props {
  data: CatalogItem[];
  isLoading: boolean;
  onEdit: (item: CatalogItem) => void;
  onDelete: (id: string) => void;
}

export function KatalogDesktopTable({ data, isLoading, onEdit, onDelete }: Props) {
  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <Table>
        <TableHeader className="bg-slate-100 border-b-2 border-blue-900">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[100px] font-black text-blue-900">ID</TableHead>
            <TableHead className="font-black text-blue-900">INFO ARSIP</TableHead>
            <TableHead className="font-black text-blue-900">JENIS / KATEGORI</TableHead>
            <TableHead className="font-black text-blue-900">LOKASI</TableHead>
            <TableHead className="font-black text-blue-900 text-center">STOK</TableHead>
            <TableHead className="font-black text-blue-900 text-right">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y-2 divide-blue-900/10">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="font-bold text-slate-500 animate-pulse">[ Memuat Data Arsip... ]</div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 font-bold text-slate-500">
                Data tidak ditemukan
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50 border-none">
                <TableCell className="font-bold text-slate-600 text-xs uppercase">
                  {item.archiveCode}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-blue-900 text-base line-clamp-1">
                      {item.title}
                    </span>
                    <span className="font-medium text-slate-600 mt-1">
                      {item.author} • {item.year}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <Badge variant="outline" className="text-xs border-2 border-blue-900 text-blue-900 font-bold bg-white">
                      {item.type}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                      {item.category}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {item.location}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={item.stock > 0 ? "default" : "destructive"}
                    className={`border-2 border-blue-900 font-black uppercase ${
                      item.stock > 0
                        ? "bg-emerald-400 text-blue-900 hover:bg-emerald-500 [box-shadow:2px_2px_0px_#1E3A8A]"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {item.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline" size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 border-2 border-blue-900 text-blue-900 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline" size="icon"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 border-2 border-blue-900 text-red-600 bg-red-50 hover:bg-red-100 [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
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
