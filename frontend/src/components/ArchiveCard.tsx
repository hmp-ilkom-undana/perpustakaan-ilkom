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
  status: string;
}

export function ArchiveCard({
  title,
  author,
  year,
  archiveType,
  category,
  status,
}: ArchiveCardProps) {
  const isAvailable = status.toUpperCase() === "TERSEDIA";

  return (
    <Card className="flex flex-col h-full bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Badge className="bg-blue-900 hover:bg-blue-800 text-white font-medium shadow-none rounded-sm">
            {archiveType}
          </Badge>

          <Badge
            variant="outline"
            className={
              isAvailable
                ? "border-green-600 text-green-700 bg-green-50 rounded-sm"
                : "border-slate-400 text-slate-500 bg-slate-50 rounded-sm"
            }
          >
            {status}
          </Badge>
        </div>

        <CardTitle className="text-lg font-bold text-blue-900 leading-tight line-clamp-2 mt-1">
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

      <CardFooter className="pt-0 pb-5 px-6">
        <Button
          className={`w-full font-bold shadow-none rounded-md transition-colors ${
            isAvailable
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
          disabled={!isAvailable}
        >
          {isAvailable ? "Ajukan Peminjaman" : "Tidak Tersedia"}
        </Button>
      </CardFooter>
    </Card>
  );
}
