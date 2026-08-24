import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart2, LineChart as LineChartIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CirculationTrendChartProps {
  data: Array<{
    label: string;
    pengajuan: number;
    pengembalian: number;
  }>;
}

export function CirculationTrendChart({ data }: CirculationTrendChartProps) {
  const [chartType, setChartType] = useState<"bar" | "area">("bar");

  const totalPengajuan = data.reduce((sum, item) => sum + item.pengajuan, 0);
  const totalPengembalian = data.reduce((sum, item) => sum + item.pengembalian, 0);

  return (
    <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-lg bg-white overflow-hidden">
      <CardHeader className="border-b-2 border-blue-900 bg-slate-50/50 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-900 text-white flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-black text-blue-950">
                Grafik Tren Sirkulasi
              </CardTitle>
            </div>
            <CardDescription className="text-xs font-semibold text-slate-500 mt-1">
              Perbandingan aktivitas pengajuan masuk vs pengembalian berkas fisik
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Chart Type Toggle */}
            <div className="flex items-center bg-white border-2 border-blue-900 rounded-md shadow-[2px_2px_0px_#1E3A8A] p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setChartType("bar")}
                className={`h-7 px-2.5 text-xs font-bold rounded ${
                  chartType === "bar"
                    ? "bg-blue-900 text-white shadow-none"
                    : "text-slate-600 hover:text-blue-950"
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 mr-1" />
                Batang
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setChartType("area")}
                className={`h-7 px-2.5 text-xs font-bold rounded ${
                  chartType === "area"
                    ? "bg-blue-900 text-white shadow-none"
                    : "text-slate-600 hover:text-blue-950"
                }`}
              >
                <LineChartIcon className="w-3.5 h-3.5 mr-1" />
                Area
              </Button>
            </div>
          </div>
        </div>

        {/* Aggregate Mini Badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-blue-900">
            <span className="w-3 h-3 rounded-sm bg-blue-900" />
            <span>Total Pengajuan: {totalPengajuan} Transaksi</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-3 rounded-sm bg-orange-500" />
            <span>Total Pengembalian: {totalPengembalian} Berkas</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[280px] sm:h-[320px] w-full">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
              Belum ada riwayat transaksi sirkulasi pada rentang waktu ini.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="label"
                    stroke="#64748B"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={{ stroke: "#CBD5E1" }}
                    dy={8}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #1E3A8A",
                      borderRadius: "6px",
                      boxShadow: "3px 3px 0px #1E3A8A",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    labelStyle={{ color: "#0F172A", marginBottom: "4px" }}
                  />
                  <Bar
                    dataKey="pengajuan"
                    name="Pengajuan Masuk"
                    fill="#1E3A8A"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pengembalian"
                    name="Pengembalian Selesai"
                    fill="#F97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPengajuanNeo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPengembalianNeo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="label"
                    stroke="#64748B"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={{ stroke: "#CBD5E1" }}
                    dy={8}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #1E3A8A",
                      borderRadius: "6px",
                      boxShadow: "3px 3px 0px #1E3A8A",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    labelStyle={{ color: "#0F172A", marginBottom: "4px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pengajuan"
                    name="Pengajuan Masuk"
                    stroke="#1E3A8A"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPengajuanNeo)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pengembalian"
                    name="Pengembalian Selesai"
                    stroke="#F97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPengembalianNeo)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
