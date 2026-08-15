import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import type { UserItem } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Mail, Phone, Eye, KeyRound, UserX, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<UserItem>();

export interface StudentColumnActions {
  onViewDetail: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
  onToggleStatus: (user: UserItem) => void;
}

export function getStudentColumns({
  onViewDetail,
  onResetPassword,
  onToggleStatus,
}: StudentColumnActions): ColumnDef<UserItem, any>[] {
  return [
    columnHelper.display({
      id: "index",
      header: () => <div className="text-center w-10">No.</div>,
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
            <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-900 border-2 border-blue-900 flex items-center justify-center font-black text-xs shrink-0 [box-shadow:2px_2px_0px_#1E3A8A]">
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
      header: "NIM",
      cell: ({ getValue }) => (
        <span className="inline-block px-2.5 py-1 text-xs font-mono font-black text-blue-900 bg-amber-100 border-2 border-blue-900 rounded [box-shadow:2px_2px_0px_#1E3A8A]">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "contact",
      header: "Kontak",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Mail className="w-3.5 h-3.5 text-blue-900 shrink-0" />
              <span className="truncate max-w-[180px]">{user.email || user.identifier}</span>
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
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const isActive = status === "Aktif";

        return (
          <Badge
            variant="outline"
            className={`border-2 border-blue-900 font-bold px-2.5 py-0.5 rounded text-xs [box-shadow:2px_2px_0px_#1E3A8A] ${
              isActive
                ? "bg-emerald-100 text-emerald-900"
                : "bg-rose-100 text-rose-900"
            }`}
          >
            {status}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const user = row.original;
        const isActive = user.status === "Aktif";

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-8 w-8 text-blue-900 hover:bg-slate-200 border-2 border-transparent hover:border-blue-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-900 transition-all cursor-pointer">
                <span className="sr-only">Buka menu</span>
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] rounded-md font-medium bg-white p-1">
                <DropdownMenuLabel className="text-blue-900 font-bold text-xs uppercase tracking-wider">
                  Aksi Mahasiswa
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-900/20" />
                <DropdownMenuItem
                  onClick={() => onViewDetail(user)}
                  className="cursor-pointer flex items-center gap-2 text-slate-800 hover:bg-slate-100 font-semibold"
                >
                  <Eye className="w-4 h-4 text-blue-800" />
                  Lihat Detail Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleStatus(user)}
                  className="cursor-pointer flex items-center gap-2 text-slate-800 hover:bg-slate-100 font-semibold"
                >
                  {isActive ? (
                    <>
                      <UserX className="w-4 h-4 text-amber-600" />
                      Nonaktifkan Akun
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      Aktifkan Akun
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-blue-900/20" />
                <DropdownMenuItem
                  onClick={() => onResetPassword(user)}
                  className="text-red-600 hover:bg-red-50 focus:text-red-700 cursor-pointer flex items-center gap-2 font-bold"
                >
                  <KeyRound className="w-4 h-4" />
                  Reset Sandi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];
}
