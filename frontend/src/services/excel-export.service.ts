import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { DashboardStatsResponse } from "./dashboard.service";

const BRAND_BLUE   = "FF1E3A8A";
const BRAND_ORANGE = "FFF97316";
const BRAND_YELLOW = "FFFBBF24";
const WHITE        = "FFFFFFFF";
const LIGHT_BLUE   = "FFDBEAFE";
const LIGHT_ORANGE = "FFFFEDD5";
const LIGHT_GREEN  = "FFD1FAE5";
const LIGHT_RED    = "FFFEE2E2";
const GRAY_50      = "FFF8FAFC";
const GRAY_200     = "FFE2E8F0";
const RED_600      = "FFDC2626";
const GREEN_600    = "FF16A34A";
const PURPLE_700   = "FF6D28D9";
const SILVER       = "FFC0C0C0";
const BRONZE       = "FFCD7F32";

function cellBorder(color = GRAY_200): Partial<ExcelJS.Borders> {
  const s: ExcelJS.BorderStyle = "hair";
  const c = { argb: color };
  return { top: { style: s, color: c }, bottom: { style: s, color: c }, left: { style: s, color: c }, right: { style: s, color: c } };
}

function applyHeaderStyle(cell: ExcelJS.Cell, bgColor = BRAND_BLUE) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
  cell.font = { bold: true, color: { argb: WHITE }, size: 10, name: "Calibri" };
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  cell.border = cellBorder(WHITE);
}

function applyDataCell(cell: ExcelJS.Cell, bgColor = WHITE, centered = false) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
  cell.font = { size: 10, color: { argb: "FF1E293B" }, name: "Calibri" };
  cell.alignment = { vertical: "middle", horizontal: centered ? "center" : "left", wrapText: true };
  cell.border = cellBorder();
}

function addSectionTitle(ws: ExcelJS.Worksheet, label: string, colSpan = 4) {
  const row = ws.addRow([label]);
  row.height = 26;
  const cell = row.getCell(1);
  cell.value = label;
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_BLUE } };
  cell.font = { bold: true, color: { argb: WHITE }, size: 11, name: "Calibri" };
  cell.alignment = { vertical: "middle", horizontal: "left" };
  ws.mergeCells(`A${row.number}:D${row.number}`);
  return row;
}

const PERIOD_LABEL: Record<string, string> = {
  hari_ini:     "Hari Ini",
  "7_hari":     "7 Hari Terakhir",
  bulan_ini:    "Bulan Ini",
  semester_ini: "Semester Ini",
  tahun_ini:    "Tahun Akademik",
};

export async function exportDashboardToExcel(data: DashboardStatsResponse) {
  const { period, stats, topCategories } = data;
  const periodLabel = PERIOD_LABEL[period] ?? period;
  const generatedAt = new Date().toLocaleString("id-ID", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const wb = new ExcelJS.Workbook();
  wb.creator  = "Sistem Perpustakaan ILKOM";
  wb.created  = new Date();
  wb.modified = new Date();

  const ws = wb.addWorksheet("Ringkasan Eksekutif", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1 },
  });

  ws.columns = [
    { key: "a", width: 38 },
    { key: "b", width: 22 },
    { key: "c", width: 18 },
    { key: "d", width: 28 },
  ];

  // ── COVER HEADER ─────────────────────────────────────────────
  ws.addRow([]);

  const titleRow = ws.addRow(["LAPORAN EKSEKUTIF PERPUSTAKAAN ILKOM"]);
  titleRow.height = 38;
  titleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_BLUE } };
  titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: WHITE }, name: "Calibri" };
  titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
  ws.mergeCells(`A2:D2`);

  const subRow = ws.addRow([`Program Studi Ilmu Komputer  ·  Periode: ${periodLabel}`]);
  subRow.height = 22;
  subRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_ORANGE } };
  subRow.getCell(1).font = { bold: true, size: 11, color: { argb: WHITE }, name: "Calibri" };
  subRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
  ws.mergeCells(`A3:D3`);

  const genRow = ws.addRow([`Tanggal Generate: ${generatedAt}`]);
  genRow.height = 18;
  genRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_BLUE } };
  genRow.getCell(1).font = { italic: true, size: 9, color: { argb: BRAND_BLUE }, name: "Calibri" };
  genRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
  ws.mergeCells(`A4:D4`);

  ws.addRow([]);

  // ── SECTION 1: KOLEKSI ARSIP ──────────────────────────────────
  addSectionTitle(ws, "1.  RINGKASAN KOLEKSI ARSIP");

  const kHead = ws.addRow(["Keterangan", "Jumlah", "Satuan", "Catatan"]);
  kHead.height = 22;
  ["A", "B", "C", "D"].forEach((c) => applyHeaderStyle(kHead.getCell(c), BRAND_BLUE));

  const kRows: (string | number)[][] = [
    ["Total Koleksi Arsip",         stats.koleksi.total,            "Eksemplar", "Keseluruhan arsip terdaftar"],
    ["Tersedia di Rak",             stats.koleksi.tersedia,         "Eksemplar", "Fisik ada & siap dipinjam"],
    ["Sedang Dipinjam",             stats.koleksi.dipinjam,         "Eksemplar", "Fisik sedang di tangan mahasiswa"],
    ["— Skripsi",                   stats.koleksi.byType.skripsi,   "Judul",     ""],
    ["— Ringkasan Skripsi (RKS)",   stats.koleksi.byType.ringkasan, "Judul",     ""],
    ["— Naskah Publikasi (NPB)",    stats.koleksi.byType.naskah,    "Judul",     ""],
  ];
  kRows.forEach((r, i) => {
    const row = ws.addRow(r);
    row.height = 20;
    const bg = i % 2 === 0 ? WHITE : GRAY_50;
    applyDataCell(row.getCell("A"), bg);
    applyDataCell(row.getCell("B"), bg, true);
    applyDataCell(row.getCell("C"), bg, true);
    applyDataCell(row.getCell("D"), bg);
    if (r[0] === "Tersedia di Rak")  row.getCell("B").font = { bold: true, color: { argb: GREEN_600 }, size: 10, name: "Calibri" };
    if (r[0] === "Sedang Dipinjam")  row.getCell("B").font = { bold: true, color: { argb: RED_600   }, size: 10, name: "Calibri" };
  });

  ws.addRow([]);

  // ── SECTION 2: SIRKULASI ─────────────────────────────────────
  addSectionTitle(ws, "2.  STATUS SIRKULASI AKTIF");

  const sHead = ws.addRow(["Status Transaksi", "Jumlah", "% dari Total", "Deskripsi"]);
  sHead.height = 22;
  ["A", "B", "C", "D"].forEach((c) => applyHeaderStyle(sHead.getCell(c), BRAND_ORANGE));

  const total = Math.max(stats.sirkulasi.totalAktif, 1);
  const sRows: (string | number)[][] = [
    ["Menunggu Persetujuan ACC",  stats.sirkulasi.waitingAcc,    `${((stats.sirkulasi.waitingAcc    / total) * 100).toFixed(1)}%`, "Pengajuan baru belum diproses"],
    ["Siap Diambil di Loket",    stats.sirkulasi.waitingPickup, `${((stats.sirkulasi.waitingPickup  / total) * 100).toFixed(1)}%`, "Sudah di-ACC, menunggu serah terima"],
    ["Membawa Fisik (Aktif)",    stats.sirkulasi.borrowed,      `${((stats.sirkulasi.borrowed       / total) * 100).toFixed(1)}%`, "Fisik ada di tangan mahasiswa"],
    ["Telat / Overdue",          stats.sirkulasi.overdue,       `${((stats.sirkulasi.overdue        / total) * 100).toFixed(1)}%`, "Melewati batas waktu pengembalian"],
    ["TOTAL AKTIF",              stats.sirkulasi.totalAktif,    "100%",                                                           ""],
  ];
  sRows.forEach((r, i) => {
    const row = ws.addRow(r);
    row.height = 20;
    const isTotal = r[0] === "TOTAL AKTIF";
    const bg = isTotal ? LIGHT_ORANGE : i % 2 === 0 ? WHITE : GRAY_50;
    applyDataCell(row.getCell("A"), bg);
    applyDataCell(row.getCell("B"), bg, true);
    applyDataCell(row.getCell("C"), bg, true);
    applyDataCell(row.getCell("D"), bg);
    if (isTotal) {
      row.getCell("A").font = { bold: true, size: 10, name: "Calibri" };
      row.getCell("B").font = { bold: true, size: 10, name: "Calibri" };
    }
    if (r[0] === "Telat / Overdue" && (r[1] as number) > 0)
      row.getCell("B").font = { bold: true, color: { argb: RED_600 }, size: 10, name: "Calibri" };
  });

  ws.addRow([]);

  // ── SECTION 3: KEUANGAN ──────────────────────────────────────
  addSectionTitle(ws, "3.  PERFORMA KEUANGAN & DENDA");

  const fHead = ws.addRow(["Komponen Keuangan", "Nilai (Rupiah)", "Status", "Keterangan"]);
  fHead.height = 22;
  ["A", "B", "C", "D"].forEach((c) => applyHeaderStyle(fHead.getCell(c), GREEN_600));

  const fRows: (string | number)[][] = [
    ["Kas Denda Terkumpul (Lunas)", `Rp ${stats.keuangan.totalKasTerkumpul.toLocaleString("id-ID")}`, "✅ Tercatat",    "Sudah dibayar ke kas loket"],
    ["Tunggakan Denda Aktif",       `Rp ${stats.keuangan.totalTunggakan.toLocaleString("id-ID")}`,    "⚠️ Belum Lunas", "Perlu ditagih ke mahasiswa"],
    ["Mahasiswa Terblokir",         `${stats.keuangan.mahasiswaTerblokir} orang`,                     "🔒 Diblokir",    "Tidak dapat meminjam baru"],
  ];
  const fBgs = [LIGHT_GREEN, LIGHT_RED, GRAY_50];
  fRows.forEach((r, i) => {
    const row = ws.addRow(r);
    row.height = 20;
    applyDataCell(row.getCell("A"), fBgs[i]);
    applyDataCell(row.getCell("B"), fBgs[i], true);
    applyDataCell(row.getCell("C"), fBgs[i], true);
    applyDataCell(row.getCell("D"), fBgs[i]);
  });

  ws.addRow([]);

  // ── SECTION 4: KEANGGOTAAN ───────────────────────────────────
  addSectionTitle(ws, "4.  DATA KEANGGOTAAN");

  const mHead = ws.addRow(["Kategori Anggota", "Jumlah", "Satuan", "Keterangan"]);
  mHead.height = 22;
  ["A", "B", "C", "D"].forEach((c) => applyHeaderStyle(mHead.getCell(c), PURPLE_700));

  const mRows: (string | number)[][] = [
    ["Total Mahasiswa Terdaftar",  stats.pengguna.totalMahasiswa,          "Orang", "Seluruh anggota aktif sistem"],
    ["Mahasiswa Aktif Meminjam",   stats.pengguna.mahasiswaAktifMeminjam,  "Orang", "Saat ini punya sirkulasi aktif"],
    ["Total Petugas",              stats.pengguna.totalPetugas,            "Orang", "Staf administrator perpustakaan"],
  ];
  mRows.forEach((r, i) => {
    const row = ws.addRow(r);
    row.height = 20;
    const bg = i % 2 === 0 ? WHITE : GRAY_50;
    applyDataCell(row.getCell("A"), bg);
    applyDataCell(row.getCell("B"), bg, true);
    applyDataCell(row.getCell("C"), bg, true);
    applyDataCell(row.getCell("D"), bg);
  });

  ws.addRow([]);

  // ── SECTION 5: KATEGORI RISET ────────────────────────────────
  addSectionTitle(ws, "5.  KATEGORI RISET TERPOPULER");

  const cHead = ws.addRow(["Peringkat", "Topik / Kategori Riset", "Jumlah Judul", "Persentase"]);
  cHead.height = 22;
  ["A", "B", "C", "D"].forEach((c) => applyHeaderStyle(cHead.getCell(c), BRAND_BLUE));

  const medalColors = [BRAND_YELLOW, SILVER, BRONZE];
  topCategories.forEach((cat, i) => {
    const rank = i < 3 ? ["🥇 #1", "🥈 #2", "🥉 #3"][i] : `#${i + 1}`;
    const row = ws.addRow([rank, cat.name, cat.count, `${cat.percentage}%`]);
    row.height = 20;
    const bg = i < 3 ? LIGHT_BLUE : i % 2 === 0 ? WHITE : GRAY_50;
    applyDataCell(row.getCell("A"), bg, true);
    applyDataCell(row.getCell("B"), bg);
    applyDataCell(row.getCell("C"), bg, true);
    applyDataCell(row.getCell("D"), bg, true);
    if (i < 3) row.getCell("A").font = { bold: true, size: 11, color: { argb: medalColors[i] }, name: "Calibri" };
  });

  ws.addRow([]);

  // ── FOOTER ───────────────────────────────────────────────────
  const footerRow = ws.addRow(["© Sistem Perpustakaan ILKOM — Dokumen ini digenerate otomatis oleh sistem. Tidak perlu tanda tangan digital."]);
  footerRow.height = 18;
  footerRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: GRAY_200 } };
  footerRow.getCell(1).font = { italic: true, size: 8, color: { argb: "FF64748B" }, name: "Calibri" };
  footerRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
  ws.mergeCells(`A${footerRow.number}:D${footerRow.number}`);

  ws.views = [{ state: "frozen", xSplit: 0, ySplit: 5 }];

  // ── DOWNLOAD ─────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const fileName = `Laporan_Eksekutif_Perpus_ILKOM_${periodLabel.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(blob, fileName);
}
