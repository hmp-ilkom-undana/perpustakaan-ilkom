import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import type { UserItem } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  UserCheck, 
  UserX, 
  KeyRound, 
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const columnHelper = createColumnHelper<UserItem>();

export interface StaffColumnActions {
  onToggleStatus: (staff: UserItem) => void;
  onResetPassword: (staff: UserItem) => void;
}

export function getStaffColumns({
  onToggleStatus,
  onResetPassword,
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
      header: "Nama Petugas / Administrator",
      size: 240,
      cell: ({ row }) => {
        const staff = row.original;
        const isAdmin = staff.role === "ADMIN";
        const initials = (staff.name || "User")
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-md border-2 border-blue-900 flex items-center justify-center font-black text-xs shrink-0 [box-shadow:2px_2px_0px_#1E3A8A] ${
                isAdmin
                  ? "bg-purple-200 text-purple-950"
                  : "bg-orange-100 text-orange-950"
              }`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-blue-950 text-sm truncate">
                {staff.name}
              </p>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.email || row.identifier, {
      id: "email",
      header: "Email",
      size: 240,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <Mail className="w-3.5 h-3.5 text-blue-900 shrink-0" />
          <span className="truncate max-w-[210px]">{getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: () => <div className="text-center w-full">Hak Akses</div>,
      size: 140,
      cell: ({ getValue }) => {
        const role = getValue();
        const isAdmin = role === "ADMIN";

        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`border-2 border-blue-900 font-bold px-2.5 py-0.5 rounded text-xs [box-shadow:2px_2px_0px_#1E3A8A] flex items-center gap-1.5 w-fit ${
                isAdmin
                  ? "bg-purple-100 text-purple-950 border-blue-900"
                  : "bg-blue-50 text-blue-900 border-blue-900"
              }`}
            >
              {isAdmin ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                  Administrator
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                  Petugas
                </>
              )}
            </Badge>
          </div>
        );
      },
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
      size: 110,
      cell: ({ row }) => {
        const staff = row.original;
        const isActive = staff.status === "Aktif";
        const isAdmin = staff.role === "ADMIN";

        return (
          <div className="flex justify-center items-center gap-1.5">
            {/* Action 1: Toggle Status (Nonaktifkan / Aktifkan) */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isAdmin}
                    onClick={() => onToggleStatus(staff)}
                    className={`h-8 w-8 border-2 border-blue-900 rounded-md transition-all [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:[box-shadow:0px_0px_0px_#1E3A8A] ${
                      isAdmin
                        ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400"
                        : isActive
                        ? "bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer"
                        : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 cursor-pointer"
                    }`}
                  />
                }
              >
                {isActive ? (
                  <UserX className="h-4 w-4" />
                ) : (
                  <UserCheck className="h-4 w-4" />
                )}
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {isAdmin
                  ? "Akun Administrator Utama tidak dapat dinonaktifkan"
                  : isActive
                  ? "Nonaktifkan Akses Petugas"
                  : "Aktifkan Akses Petugas"}
              </TooltipContent>
            </Tooltip>

            {/* Action 2: Reset Sandi */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onResetPassword(staff)}
                    className="h-8 w-8 border-2 border-blue-900 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-md transition-all cursor-pointer [box-shadow:2px_2px_0px_#1E3A8A] active:translate-x-[1px] active:translate-y-[1px] active:[box-shadow:0px_0px_0px_#1E3A8A]"
                  />
                }
              >
                <KeyRound className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent side="top" align="end">
                {isAdmin ? "Reset Sandi Administrator" : "Reset Kata Sandi Petugas"}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    }),
  ];
}
