import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import type { UserItem } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columnHelper = createColumnHelper<UserItem>();

export interface UserColumnActions {
  onResetPassword: (user: UserItem) => void;
}

export function getUserColumns({ onResetPassword }: UserColumnActions): ColumnDef<UserItem, any>[] {
  return [
    columnHelper.accessor("name", {
      header: "Nama",
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("identifier", {
      header: "Email / NIM",
      cell: ({ getValue }) => (
        <span className="text-slate-500">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue();
        if (role === "ADMIN") {
          return (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
              Admin
            </Badge>
          );
        }
        if (role === "PETUGAS") {
          return (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              Petugas
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100">
            Mahasiswa
          </Badge>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-slate-100 hover:text-slate-900 h-8 w-8 text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300">
                <span className="sr-only">Buka menu</span>
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Aksi Akun</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "MAHASISWA" && (
                  <DropdownMenuItem className="cursor-pointer">
                    Jadikan Petugas
                  </DropdownMenuItem>
                )}
                {user.role === "PETUGAS" && (
                  <DropdownMenuItem className="cursor-pointer">
                    Turunkan ke Mahasiswa
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onResetPassword(user)}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                >
                  Reset Password
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];
}
