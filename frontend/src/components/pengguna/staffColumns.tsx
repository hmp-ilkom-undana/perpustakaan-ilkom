import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import type { UserItem } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Mail, 
  UserCheck, 
  UserX, 
  KeyRound, 
  Edit3, 
  Trash2, 
  ShieldCheck 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columnHelper = createColumnHelper<UserItem>();

export interface StaffColumnActions {
  onEdit: (staff: UserItem) => void;
  onToggleStatus: (staff: UserItem) => void;
  onResetPassword: (staff: UserItem) => void;
  onDelete: (staff: UserItem) => void;
}

export function getStaffColumns({
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: StaffColumnActions): ColumnDef<UserItem, any>[] {
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
      header: "Nama Petugas",
      cell: ({ row }) => {
        const staff = row.original;
        const initials = staff.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-orange-100 text-orange-950 border-2 border-blue-900 flex items-center justify-center font-black text-xs shrink-0 [box-shadow:2px_2px_0px_#1E3A8A]">
              {initials}
            </div>
            <div>
              <p className="font-bold text-blue-950 text-sm">{staff.name}</p>
              <p className="text-xs text-slate-500 font-medium md:hidden">
                {staff.email || staff.identifier}
              </p>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.email || row.identifier, {
      id: "email",
      header: "Email / Akun",
      size: 240,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <Mail className="w-3.5 h-3.5 text-blue-900 shrink-0" />
          <span className="truncate max-w-[200px]">{getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: () => <div className="text-center w-full">Hak Akses</div>,
      size: 130,
      cell: () => (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-900 border-2 border-blue-900 font-bold px-2.5 py-0.5 rounded text-xs [box-shadow:2px_2px_0px_#1E3A8A] flex items-center gap-1 w-fit"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
            Petugas
          </Badge>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => <div className="text-center w-full">Terdaftar</div>,
      size: 140,
      cell: ({ getValue }) => (
        <div className="text-center text-xs font-semibold text-slate-600">
          {getValue() || "Agustus 2026"}
        </div>
      ),
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
              className={`border-2 border-blue-900 font-bold px-2.5 py-0.5 rounded text-xs [box-shadow:2px_2px_0px_#1E3A8A] ${
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
        const staff = row.original;
        const isActive = staff.status === "Aktif";

        return (
          <div className="flex justify-center items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-8 w-8 text-blue-900 hover:bg-slate-200 border-2 border-transparent hover:border-blue-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-900 transition-all cursor-pointer">
                <span className="sr-only">Buka menu</span>
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[210px] border-2 border-blue-900 [box-shadow:4px_4px_0px_#1E3A8A] rounded-md font-medium bg-white p-1">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-blue-900 font-bold text-xs uppercase tracking-wider">
                    Aksi Petugas
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-blue-900/20" />
                  
                  <DropdownMenuItem
                    onClick={() => onEdit(staff)}
                    className="cursor-pointer flex items-center gap-2 text-slate-800 hover:bg-slate-100 font-semibold"
                  >
                    <Edit3 className="w-4 h-4 text-blue-800" />
                    Edit Data Petugas
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onToggleStatus(staff)}
                    className="cursor-pointer flex items-center gap-2 text-slate-800 hover:bg-slate-100 font-semibold"
                  >
                    {isActive ? (
                      <>
                        <UserX className="w-4 h-4 text-amber-600" />
                        Nonaktifkan Akses
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        Aktifkan Akses
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onResetPassword(staff)}
                    className="cursor-pointer flex items-center gap-2 text-slate-800 hover:bg-slate-100 font-semibold"
                  >
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    Reset Sandi
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-blue-900/20" />

                  <DropdownMenuItem
                    onClick={() => onDelete(staff)}
                    className="text-red-600 hover:bg-red-50 focus:text-red-700 cursor-pointer flex items-center gap-2 font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cabut / Hapus Akun
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];
}
