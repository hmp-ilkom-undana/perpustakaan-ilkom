import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Data dummy (sementara sebelum kita ambil dari backend)
const DUMMY_BOOKS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  judul: `Buku Pemrograman Web ${i + 1}`,
  penulis: "Budi Santoso",
  kategori: "Teknologi",
  status: i % 3 === 0 ? "Dipinjam" : "Tersedia", // Sebagian dipinjam, sebagian tersedia
}));

export default function Katalog() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Katalog Buku</h2>
        <p className="text-slate-500">Cari dan ajukan peminjaman buku yang Anda butuhkan.</p>
      </div>

      {/* Grid Layout untuk Card Buku */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {DUMMY_BOOKS.map((buku) => (
          <Card key={buku.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={buku.status === "Tersedia" ? "default" : "destructive"}>
                  {buku.status}
                </Badge>
                <span className="text-xs text-slate-400 font-medium">{buku.kategori}</span>
              </div>
              <CardTitle className="line-clamp-2 text-lg leading-tight">{buku.judul}</CardTitle>
              <p className="text-sm text-slate-500 mt-1">{buku.penulis}</p>
            </CardHeader>
            <CardContent>
              {/* Gambar cover buku (placeholder) */}
              <div className="w-full h-40 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 border border-dashed">
                Cover Buku
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={buku.status !== "Tersedia"}
                variant={buku.status === "Tersedia" ? "default" : "secondary"}
              >
                {buku.status === "Tersedia" ? "Ajukan Peminjaman" : "Tidak Tersedia"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
