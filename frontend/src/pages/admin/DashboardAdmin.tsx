import { useState } from "react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { 
  BookCopy, 
  RefreshCw, 
  Banknote, 
  AlertTriangle 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Sen", peminjaman: 12 },
  { name: "Sel", peminjaman: 19 },
  { name: "Rab", peminjaman: 15 },
  { name: "Kam", peminjaman: 25 },
  { name: "Jum", peminjaman: 22 },
  { name: "Sab", peminjaman: 30 },
  { name: "Min", peminjaman: 10 },
];

const anomaliData = [
  { id: 1, message: "5 Mahasiswa Terlambat > 14 Hari", type: "warning", time: "2 jam yang lalu" },
  { id: 2, message: "3 Arsip Dinyatakan Hilang", type: "destructive", time: "5 jam yang lalu" },
  { id: 3, message: "Lonjakan Peminjaman Kategori 'Skripsi' (+45%)", type: "info", time: "1 hari yang lalu" },
];

export default function DashboardAdmin() {
  const [timeFilter, setTimeFilter] = useState("bulan_ini");

  return (
    <div className="space-y-6">
      {/* Header & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Eksekutif</h1>
          <p className="text-slate-500">Ringkasan aktivitas dan kesehatan perpustakaan.</p>
        </div>
        <Select value={timeFilter} onValueChange={(val) => { if (val) setTimeFilter(val); }}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Pilih Rentang Waktu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minggu_ini">Minggu Ini</SelectItem>
            <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
            <SelectItem value="semester_ini">Semester Ini</SelectItem>
            <SelectItem value="tahun_ini">Tahun Ini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total Koleksi</CardTitle>
            <BookCopy className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,245</div>
            <p className="text-xs text-slate-500 mt-1">Arsip fisik di rak</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Sirkulasi Aktif</CardTitle>
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">42</div>
            <p className="text-xs text-slate-500 mt-1">Status peminjaman berjalan</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Kas Denda (Bulan Ini)</CardTitle>
            <Banknote className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Rp 450.000</div>
            <p className="text-xs text-slate-500 mt-1">Status PAID</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total Menunggak</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp 120.000</div>
            <p className="text-xs text-slate-500 mt-1">Belum dibayar</p>
          </CardContent>
        </Card>
      </div>

      {/* Zona Visualisasi (Grafik & Anomali) */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Tren Peminjaman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPeminjaman" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E293B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1E293B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="peminjaman"
                    stroke="#1E293B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPeminjaman)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Alerts (Anomali)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100">
                  <TableHead>Pesan</TableHead>
                  <TableHead className="text-right">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anomaliData.map((anomali) => (
                  <TableRow key={anomali.id} className="border-slate-100 hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {anomali.type === 'destructive' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {anomali.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {anomali.type === 'info' && <AlertTriangle className="w-4 h-4 text-blue-500" />}
                        <span className="font-medium text-slate-700">{anomali.message}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500">
                      {anomali.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
