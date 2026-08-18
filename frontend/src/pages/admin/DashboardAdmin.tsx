import { useState } from "react";
import { 
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis 
} from "recharts";
import { 
  Library, RefreshCcw, BadgeDollarSign, AlertTriangle, 
  FileText, ArrowRight, CircleAlert, Activity, CheckCircle2
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- DUMMY DATA ---
const trendData = [
  { date: "10 Jul", pengajuan: 8, pengembalian: 5 },
  { date: "11 Jul", pengajuan: 12, pengembalian: 8 },
  { date: "12 Jul", pengajuan: 15, pengembalian: 10 },
  { date: "13 Jul", pengajuan: 9, pengembalian: 12 },
  { date: "14 Jul", pengajuan: 20, pengembalian: 15 },
  { date: "15 Jul", pengajuan: 18, pengembalian: 18 },
  { date: "16 Jul", pengajuan: 25, pengembalian: 22 },
];

const topCategories = [
  { name: "Machine Learning", percentage: 42, color: "bg-orange-500" },
  { name: "Web & Cloud", percentage: 28, color: "bg-blue-600" },
  { name: "Kriptografi & Security", percentage: 18, color: "bg-amber-500" },
  { name: "Sistem Pendukung Keputusan", percentage: 12, color: "bg-slate-400" },
];

const alerts = [
  { id: 1, title: "Pengajuan Menunggak ACC (> 2 Hari)", detail: "3 Transaksi", desc: "Petugas lambat mengecek rak.", type: "danger" },
  { id: 2, title: "Keterlambatan Parah (> 14 Hari)", detail: "2 Mahasiswa", desc: "Memicu tindakan kontak langsung.", type: "warning" },
  { id: 3, title: "Stok Habis dengan Antrean Tinggi", detail: "1 Judul Skripsi", desc: "Perlu penambahan eksemplar.", type: "info" },
];

const auditLogs = [
  { id: 1, time: "14:20", user: "NIM 2201020005 (Budi)", action: "ACC Pengajuan #PK-8192" },
  { id: 2, time: "13:05", user: "NIM 2201020001 (Siti)", action: "Verifikasi Serah Terima + Foto S3 #PK-8188" },
  { id: 3, time: "10:15", user: "NIM 2201020005 (Budi)", action: "Mencatat Denda Tunai Rp 50.000 #PK-8170" },
  { id: 4, time: "09:30", user: "NIM 2201020010 (Andi)", action: "Verifikasi Pengembalian #PK-8100" },
  { id: 5, time: "08:45", user: "NIM 2201020042 (Rina)", action: "Registrasi Anggota Baru HMP" },
];

export default function DashboardAdmin() {
  const [timeFilter, setTimeFilter] = useState("bulan_ini");

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* BARIS 0: Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Admin</h1>
          <p className="text-slate-500 mt-1">Ringkasan aktivitas, arus kas denda, dan tren akademik.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeFilter} onValueChange={(val) => { if (val) setTimeFilter(val); }}>
            <SelectTrigger className="w-[160px] sm:w-[180px] bg-white border-slate-200">
              <SelectValue placeholder="Pilih Rentang Waktu">
                {timeFilter === "hari_ini" && "Hari Ini"}
                {timeFilter === "bulan_ini" && "Bulan Ini"}
                {timeFilter === "semester_ini" && "Semester Ini"}
                {timeFilter === "tahun_ini" && "Tahun Akademik"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hari_ini">Hari Ini</SelectItem>
              <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
              <SelectItem value="semester_ini">Semester Ini</SelectItem>
              <SelectItem value="tahun_ini">Tahun Akademik</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Unduh Laporan LPJ
          </Button>
        </div>
      </div>

      {/* BARIS 1: Hero Stat Cards (Grid 4 Kolom) */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Koleksi Arsip</CardTitle>
            <Library className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 tracking-tight">1.240</div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              <span className="text-blue-600 font-semibold">1.180 Tersedia</span> • 60 Sedang Dipinjam
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Sirkulasi Aktif</CardTitle>
            <RefreshCcw className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 tracking-tight">42</div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              <span className="text-orange-600 font-semibold">8 Antrean Ambil</span> • 34 Membawa Fisik
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">Kas Denda Terkumpul</CardTitle>
            <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 tracking-tight">Rp 650.000</div>
            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              100% Tercatat Manual di Loket
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-red-100 shadow-sm bg-red-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-red-800">Tunggakan Denda Aktif</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-700 tracking-tight">Rp 175.000</div>
            <p className="text-xs font-medium text-red-600/80 mt-1 flex items-center gap-1">
              <CircleAlert className="w-3 h-3 text-red-500" />
              4 Mahasiswa Terkunci/Terblokir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* BARIS 2: Zona Visualisasi Utama (70% : 30%) */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-10">
        
        {/* Kolom Kiri (70%) - Grafik Tren */}
        <Card className="lg:col-span-7 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Grafik Tren Peminjaman</CardTitle>
            <CardDescription>Aktivitas pengajuan & pengembalian dalam periode terpilih</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPengajuan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPengembalian" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
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
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    name="Pengembalian"
                    dataKey="pengembalian"
                    stroke="#64748b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPengembalian)"
                  />
                  <Area
                    type="monotone"
                    name="Pengajuan"
                    dataKey="pengajuan"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPengajuan)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan (30%) - Top Kategori */}
        <Card className="lg:col-span-3 bg-white border-slate-200 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Kategori Terfavorit</CardTitle>
            <CardDescription>Topik riset paling banyak dipinjam</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center space-y-6">
            {topCategories.map(cat => (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <span className="font-bold text-slate-900">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${cat.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* BARIS 3: Operations & Audit Control (50% : 50%) */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        
        {/* Kolom Kiri - Actionable Alerts */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg">Perhatian Operasional</CardTitle>
            </div>
            <CardDescription>Bottleneck atau masalah yang perlu segera ditindaklanjuti</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center p-4 sm:p-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex-shrink-0 mr-4">
                    {alert.type === 'danger' && <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>}
                    {alert.type === 'warning' && <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-orange-600" /></div>}
                    {alert.type === 'info' && <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><CircleAlert className="w-5 h-5 text-blue-600" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{alert.title}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {alert.detail}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">{alert.desc}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan - Recent Audit Log */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Log Aktivitas Petugas</CardTitle>
            <CardDescription>Riwayat transaksi dan aksi terbaru di meja layanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Garis vertikal timeline */}
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-200"></div>
              
              <div className="space-y-6">
                {auditLogs.map((log, index) => (
                  <div key={log.id} className="relative pl-8 flex flex-col gap-0.5">
                    {/* Dot timeline */}
                    <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{log.time}</span>
                      <span className="text-xs font-semibold text-slate-500">•</span>
                      <span className="text-xs font-semibold text-blue-600 truncate">{log.user}</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">{log.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
