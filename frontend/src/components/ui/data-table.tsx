import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue = any> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyText?: string;
  headerClassName?: string;
}

export function DataTable<TData, TValue = any>({
  columns,
  data,
  isLoading = false,
  emptyText = "Data tidak ditemukan",
  headerClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader className={headerClassName || "bg-slate-100 border-b-2 border-blue-900"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
              {headerGroup.headers.map((header) => {
                const size = header.column.columnDef.size;
                return (
                  <TableHead
                    key={header.id}
                    className="font-black text-blue-900"
                    style={
                      size
                        ? {
                            width: `${size}px`,
                            minWidth: `${size}px`,
                            maxWidth: `${size}px`,
                          }
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="divide-y-2 divide-blue-900/10">
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 font-bold text-slate-500 animate-pulse"
              >
                [ Memuat Data... ]
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-slate-50/80 transition-colors border-none group"
              >
                {row.getVisibleCells().map((cell) => {
                  const size = cell.column.columnDef.size;
                  return (
                    <TableCell
                      key={cell.id}
                      style={
                        size
                          ? {
                              width: `${size}px`,
                              minWidth: `${size}px`,
                              maxWidth: `${size}px`,
                            }
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 font-bold text-slate-500"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
