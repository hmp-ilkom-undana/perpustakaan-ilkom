# Workflow & Aturan Bisnis: Sistem Peminjaman Arsip & Kebijakan Denda

**Sistem Informasi Perpustakaan ILKOM (Tugas Akhir: Skripsi, Ringkasan, Naskah Publikasi)**

---

## 1. Aturan Bisnis Utama (Core Business Rules)

- **Metode Peminjaman (Hybrid Physical Borrowing):** Pengajuan/pemilihan awal dilakukan secara _online_ atau melalui pemindaian, sedangkan penyerahan dan pemeriksaan kondisi fisik arsip dilakukan secara _offline_ di ruang perpustakaan (HMP ILKOM).
- **Batas Kuota Peminjaman:** Maksimal **2 (dua) skripsi** yang dapat dipinjam secara bersamaan oleh 1 orang mahasiswa.
- **Durasi Peminjaman:** Maksimal **1 (satu) bulan** terhitung sejak tanggal pinjam dikonfirmasi oleh sistem (`return_date = borrow_date + 1 bulan`).
- **Sistem Persetujuan (Self-Service):** Proses peminjaman bersifat _self-service_. **Tidak diperlukan persetujuan manual** dari Ketua HMP, Kabid, atau pihak lain saat scan barcode dan konfirmasi awal transaksi.

---

## 2. Kebijakan Denda Otomatis (Automated Fine System)

Sistem akan menghitung denda secara otomatis saat proses pengembalian berdasarkan kondisi waktu dan fisik arsip:

### A. Denda Keterlambatan (Late Return)

Dihitung berdasarkan selisih tanggal pengembalian aktual (`actual_return_date`) dengan tanggal jatuh tempo (`return_date`):

- **Masa Tenggang:** Keterlambatan 1 s.d 7 hari setelah jatuh tempo **belum dikenakan denda nominal** (namun status berubah menjadi `OVERDUE`).
- **Denda Dasar:** Dikenakan sebesar **Rp50.000** tepat setelah melewati 1 minggu (hari ke-8) dari batas jatuh tempo.
- **Denda Akumulatif Harian:** **Setiap hari** berikutnya setelah melewati batas 1 minggu tersebut, akan dikenakan tambahan denda sebesar **Rp10.000 per hari** hingga skripsi dikembalikan.
- _Rumus Backend:_ `Total Denda Keterlambatan = Rp50.000 + (Jumlah Hari Terlambat Setelah Minggu Pertama * Rp10.000)`

### B. Denda Kondisi Fisik (Condition Fines)

Petugas akan memeriksa fisik arsip saat pengembalian dan menginput nilai pada kolom `status_kondisi`:

- **Kerusakan:** Denda tetap sebesar **Rp75.000** jika `status_kondisi` diinput sebagai **`rusak`**.
- **Kehilangan:** Denda tetap sebesar **Rp100.000** jika `status_kondisi` diinput sebagai **`hilang`** (atau jika arsip sama sekali tidak dikembalikan dalam _timeframe_ ekstrem yang ditetapkan sistem).

---

## 3. Alur Status Transaksi (State Machine)

| Status          | Aktor/Pemicu      | Kondisi Fisik & Logika Denda                                                                                                                                |
| :-------------- | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`REQUESTED`** | Mahasiswa / Scan  | Pengajuan awal tercatat (Self-Service). Fisik belum diserahkan, stok belum berubah, denda = Rp0.                                                            |
| **`BORROWED`**  | Petugas / Sistem  | Fisik diserahkan. Stok berkurang -1. Waktu peminjaman 1 bulan mulai berjalan. Denda = Rp0.                                                                  |
| **`OVERDUE`**   | Sistem (Otomatis) | Melewati batas 1 bulan. Kuota mahasiswa terkunci. Logika hitungan denda (Rp50rb + akumulasi Rp10rb/hari setelah minggu ke-1) mulai aktif di latar belakang. |
| **`RETURNED`**  | Petugas           | Mahasiswa mengembalikan fisik. Petugas input `status_kondisi`. Sistem mengunci total nominal denda final. Stok bertambah +1.                                |
| **`CANCELLED`** | Petugas / Sistem  | Pengajuan dibatalkan sebelum fisik diserahkan. Stok tidak berubah. Denda = Rp0.                                                                             |

---

## 4. Alur Kerja Pengembalian & Kalkulasi Denda (Step-by-Step Return & Fine Workflow)

1. **Pengembalian Fisik:** Mahasiswa membawa kembali skripsi ke ruang baca HMP ILKOM.
2. **Pemeriksaan oleh Petugas:** Petugas membuka dashboard, mencari ID transaksi peminjaman mahasiswa, dan memeriksa fisik skripsi.
3. **Input Kondisi Fisik:** Petugas melakukan konfirmasi pengembalian dengan memilih opsi pada `status_kondisi` (`bagus` / `rusak` / `hilang`).
4. **Kalkulasi Otomatis oleh Backend (`PATCH /api/borrowings/:id/return`):**
   - **Cek Waktu:** Jika hari pengembalian > `return_date` + 7 hari, backend menghitung selisih hari keterlambatan setelah hari ke-7 tersebut dan mengalikan dengan Rp10.000, lalu menambahkannya dengan denda dasar Rp50.000.
   - **Cek Kondisi:** Jika kondisi `rusak`, otomatis tambahkan Rp75.000 ke total denda. Jika kondisi `hilang`, otomatis tambahkan Rp100.000 ke total denda.
   - **Penyimpanan Data:** Nilai denda akhir disimpan ke dalam kolom `total_denda` di database transaksi peminjaman tersebut.
5. **Penyelesaian Transaksi:** Status transaksi berubah menjadi `RETURNED`. Kuota peminjaman mahasiswa terbebas kembali (stok `quantity` skripsi bertambah +1 jika kondisi kembali bagus/rusak). Mahasiswa diarahkan untuk menyelesaikan pembayaran denda jika total denda > Rp0 sesuai prosedur HMP.

---

## 5. Matriks Struktur Data Transaksi (Prisma ORM Reference)

Untuk mendukung aturan bisnis di atas, tabel `Borrowing` setidaknya harus mengelola kolom berikut:

- `borrow_date` (DateTime): Tanggal mulai pinjam.
- `return_date` (DateTime): Batas jatuh tempo (`borrow_date` + 1 Bulan).
- `actual_return_date` (DateTime, nullable): Tanggal riil dikembalikan.
- `status_kondisi` (Enum: BAGUS, RUSAK, HILANG): Kondisi fisik saat kembali.
- `total_denda` (Int, default: 0): Nilai nominal rupiah hasil kalkulasi otomatis sistem.
