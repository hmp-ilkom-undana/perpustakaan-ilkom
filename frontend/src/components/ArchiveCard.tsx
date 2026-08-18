import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Tag } from "lucide-react";

interface ArchiveCardProps {
  id: string;
  title: string;
  author: string;
  year: number | string;
  archiveType: string;
  category: string;
  quantity: number;
  reservedQuantity: number;
  status: string;
  userBorrowStatus?: string;
  isRequestedByCurrentUser?: boolean;
  onClick: () => void;
}

export function ArchiveCard({
  title,
  author,
  year,
  archiveType,
  category,
  quantity,
  reservedQuantity,
  status,
  userBorrowStatus,
  onClick,
}: ArchiveCardProps) {
  const availableStock = quantity - reservedQuantity;

  // Status mapping
  let displayStatus = "TERSEDIA";
  let statusVariant: "emerald" | "amber" | "secondary" = "emerald";

  if (userBorrowStatus === "REQUESTED") {
    displayStatus = "DIAJUKAN";
    statusVariant = "amber";
  } else if (userBorrowStatus === "WAITING_PICKUP") {
    displayStatus = "SIAP AMBIL";
    statusVariant = "amber";
  } else if (
    userBorrowStatus === "BORROWED" ||
    userBorrowStatus === "OVERDUE" ||
    availableStock <= 0 ||
    status === "DIPINJAM"
  ) {
    displayStatus = "DIPINJAM";
    statusVariant = "secondary";
  }

  // Tipe badge mapping
  let typeVariant: "orange" | "sky" | "navy" | "secondary" = "orange";
  const typeLower = archiveType.toLowerCase();
  if (typeLower.includes("ringkasan")) {
    typeVariant = "sky";
  } else if (typeLower.includes("naskah") || typeLower.includes("publikasi")) {
    typeVariant = "navy";
  } else if (typeLower.includes("skripsi")) {
    typeVariant = "orange";
  }

  return (
    <Card
      variant="interactive"
      onClick={onClick}
      className="flex flex-col h-full overflow-hidden group"
    >
      <CardHeader className="p-4 sm:p-5 pb-3 border-b-2 border-blue-900 bg-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
          <Badge variant={typeVariant} className="text-[10px] px-2 py-0.5 tracking-wider">
            {archiveType}
          </Badge>

          <Badge
            variant={statusVariant}
            className="text-[10px] px-2 py-0.5 tracking-wider font-black shrink-0"
          >
            {displayStatus}
          </Badge>
        </div>

        <CardTitle className="text-base font-black text-blue-950 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2 mt-1">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex-grow pt-3.5">
        <div className="space-y-2.5 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-slate-800 line-clamp-1">{author}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Tahun {year}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="truncate">{category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
