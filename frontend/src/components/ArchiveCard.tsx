import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  status: string; // Add status prop
  isRequestedByCurrentUser?: boolean;

  onClick: () => void;
}

const getArchiveTypeColor = (type: string) => {
  // Menggunakan toLowerCase() agar pencarian kebal terhadap huruf besar/kecil (case-insensitive)
  switch (type.toLowerCase()) {
    case "skripsi":
      return "bg-blue-600";

    case "ringkasan skripsi":
      return "bg-sky-400 text-blue-900";

    case "naskah publikasi":
      return "bg-orange-500";

    default:
      return "bg-slate-600";
  }
};

export function ArchiveCard({
  title,
  author,
  year,
  archiveType,
  category,
  quantity,
  reservedQuantity,
  status,
  isRequestedByCurrentUser,
  onClick,
}: ArchiveCardProps) {
  // 1. Kalkulasi stok aktual
  const availableStock = quantity - reservedQuantity;
  const isRequestedByMe = isRequestedByCurrentUser;

  // 2. Tentukan Teks dan Warna Badge
  let displayStatus = "Tersedia";
  let badgeStyle = "bg-green-300";

  if (isRequestedByMe) {
    displayStatus = "Sedang Anda Ajukan";
    badgeStyle = "bg-amber-400";
  } else if (availableStock <= 0 || status === "DIPINJAM") {
    displayStatus = "Sedang Dipinjam";
    badgeStyle = "bg-slate-300";
  }

  return (
    <Card
      onClick={onClick}
      className="flex flex-col h-full bg-white border border-blue-900/30 rounded-xl shadow-[2px_2px_0px_#1E3A8A] hover:-translate-y-0.5 hover:border-orange-500 hover:shadow-[4px_4px_0px_#F97316] transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Badge
            className={`${getArchiveTypeColor(archiveType)} border border-blue-900/30 shadow-[1px_1px_0px_#1E3A8A]`}
          >
            {archiveType}
          </Badge>

          <Badge variant="outline" className={`${badgeStyle} border border-blue-900/30 shadow-[1px_1px_0px_#1E3A8A]`}>
            {displayStatus}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold text-blue-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight line-clamp-2 mt-1">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow pt-4">
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-yellow-600" />
            <span className="font-semibold text-slate-800 line-clamp-1">
              {author}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-yellow-600" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-yellow-600" />
            <span className="truncate">{category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
