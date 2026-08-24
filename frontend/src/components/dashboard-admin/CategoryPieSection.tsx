import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface CategoryPieSectionProps {
  categories: CategoryItem[];
}

export function CategoryPieSection({ categories }: CategoryPieSectionProps) {
  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.count || 1,
    color: cat.color,
    percentage: cat.percentage,
  }));

  return (
    <Card className="border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-lg bg-white overflow-hidden flex flex-col justify-between">
      <CardHeader className="border-b-2 border-blue-900 bg-slate-50/50 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-orange-500 text-white flex items-center justify-center shadow-[1px_1px_0px_#1E3A8A]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-black text-blue-950">
              Kategori Riset Terfavorit
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-500">
              Distribusi topik skripsi & penelitian terbanyak
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 flex-1 flex flex-col justify-between space-y-6">
        {categories.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">
            Belum ada data kategori arsip.
          </div>
        ) : (
          <>
            {/* Donut Chart Visual */}
            <div className="h-[140px] sm:h-[160px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #1E3A8A",
                      borderRadius: "6px",
                      boxShadow: "3px 3px 0px #1E3A8A",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#1E3A8A"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total
                </span>
                <span className="text-sm font-black text-blue-950">
                  {categories.reduce((s, c) => s + c.count, 0)} Judul
                </span>
              </div>
            </div>

            {/* Category Breakdown Progress Bars */}
            <div className="space-y-3.5 pt-2">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-800 truncate max-w-[170px] sm:max-w-[200px]">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {cat.count} Berkas
                      </span>
                      <Badge
                        className="font-black text-[10px] px-1.5 py-0 border border-blue-900 shadow-[1px_1px_0px_#1E3A8A]"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        {cat.percentage}%
                      </Badge>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 border border-slate-300 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
