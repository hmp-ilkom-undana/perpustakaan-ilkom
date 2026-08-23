import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import type { UserItem } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Eye } from "lucide-react";

const columnHelper = createColumnHelper<UserItem>();

export interface StudentColumnActions {
  onViewDetail: (user: UserItem) => void;
}

export function getStudentColumns({
  onViewDetail,
}: StudentColumnActions): ColumnDef<UserItem, any>[] {
  return [
    columnHelper.display({
      id: "index",
      header: () => <div className="text-center w-full">No.</div>,
      cell: ({ row }) => (
        <div className="text-center font-bold text-slate-600">
          {row.index + 1}
        </div>
      ),
      size: 60,
    }),
    columnHelper.accessor("name", {
      header: "Nama Mahasiswa",
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-900 border-2 border-blue-900 flex items-center justify-center font-black text-xs shrink-0 shadow-[2px_2px_0px_#1E3A8A]">
              {initials}
            </div>
            <div>
              <p className="font-bold text-blue-950 text-sm">{user.name}</p>
              <p className="text-xs text-slate-500 font-medium md:hidden font-mono">
                {user.nim || user.identifier}
              </p>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.nim || row.identifier, {
      id: "nim",
      header: () => <div className="text-center w-full">NIM</div>,
      size: 150,
      cell: ({ getValue }) => (
        <div className="text-center">
          <span className="inline-block px-2.5 py-1 text-xs font-mono font-black text-blue-900 bg-amber-100 border-2 border-blue-900 rounded shadow-[2px_2px_0px_#1E3A8A]">
            {getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "contact",
      header: "Kontak",
      size: 260,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Mail className="w-3.5 h-3.5 text-blue-900 shrink-0" />
              <span className="truncate max-w-[200px]">
                {user.email || user.identifier}
              </span>
            </div>
            {user.wa_number && (
              <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{user.wa_number}</span>
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: () => <div className="text-center w-full">Status</div>,
      size: 120,
      cell: ({ getValue }) => {
        const status = getValue();
        const isActive = status === "Aktif";

        return (
          <div className="flex justify-center items-center">
            <Badge
              variant="outline"
              className={`border-2 border-blue-900 font-bold px-2.5 py-0.5 rounded text-xs shadow-[2px_2px_0px_#1E3A8A] ${
                isActive
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-rose-100 text-rose-900"
              }`}
            >
              {status}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-center w-full">Aksi</div>,
      size: 80,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex justify-center items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onViewDetail(user)}
              className="h-8 w-8 border-2 border-blue-900 text-blue-950 bg-amber-200 hover:bg-amber-300 shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-md cursor-pointer"
              title="Lihat Detail Profil Mahasiswa"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];
}
