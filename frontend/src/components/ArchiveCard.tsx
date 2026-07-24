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
  isRequestedByCurrentUser?: boolean;

  onClick: () => void;
}

const getArchiveTypeColor = (type: string) => {
  // Menggunakan toLowerCase() agar pencarian kebal terhadap huruf besar/kecil (case-insensitive)
  switch (type.toLowerCase()) {
    case "skripsi":
      return "bg-blue-600 hover:bg-blue-700 text-white";

    case "ringkasan skripsi":
      return "bg-sky-500 hover:bg-sky-600 text-white";

    case "naskah publikasi":
      return "bg-orange-500 hover:bg-orange-600 text-white";

    default:
      return "bg-slate-600 hover:bg-slate-700 text-white";
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
  isRequestedByCurrentUser,
  onClick,
}: ArchiveCardProps) {
  // 1. Kalkulasi stok aktual
  const availableStock = quantity - reservedQuantity;
  const isRequestedByMe = isRequestedByCurrentUser;

  // 2. Tentukan Teks dan Warna Badge
  let displayStatus = "Tersedia";
  let badgeStyle = "border-green-600 text-green-700 bg-green-50 rounded-sm";

  if (isRequestedByMe) {
    displayStatus = "Sedang Anda Ajukan";
    badgeStyle = "border-blue-500 text-blue-700 bg-blue-50 rounded-sm"; // Warna Biru
  } else if (availableStock <= 0) {
    displayStatus = "Sedang Dipinjam";
    badgeStyle = "border-slate-400 text-slate-500 bg-slate-50 rounded-sm"; // Warna Abu-abu
  }

  return (
    <Card
      onClick={onClick}
      className="flex flex-col h-full bg-white border-x-0 border-t-0 border-b sm:border border-slate-200 rounded-none sm:rounded-xl shadow-none sm:shadow-sm hover:border-orange-500 hover:ring-1 hover:ring-orange-500 hover:shadow-lg hover:shadow-orange-500/15 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Badge
            className={`${getArchiveTypeColor(archiveType)} font-medium shadow-none rounded-sm`}
          >
            {archiveType}
          </Badge>

          <Badge variant="outline" className={badgeStyle}>
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
