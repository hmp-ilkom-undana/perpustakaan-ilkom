export const BORROWING_STEPS = [
  {
    title: "Cari Arsip",
    description: "Telusuri katalog untuk menemukan skripsi, naskah publikasi, atau ringkasan skripsi yang dibutuhkan.",
  },
  {
    title: "Lihat Detail & Lokasi",
    description: "Buka halaman detail arsip untuk melihat status ketersediaan, informasi arsip, dan lokasi rak.",
  },
  {
    title: "Ajukan Peminjaman",
    description: "Klik tombol ajukan peminjaman pada arsip yang tersedia untuk membuat permintaan peminjaman.",
  },
  {
    title: "Verifikasi & Ambil Fisik",
    description: "Datang ke perpustakaan untuk verifikasi dan pengambilan arsip fisik sesuai prosedur layanan.",
  }
];

export const BORROWING_RULES = [
  {
    label: "Batas Peminjaman",
    value: "5 Arsip",
    description: "Jumlah maksimal arsip akademik yang dapat dipinjam dalam satu waktu.",
  },
  {
    label: "Masa Pinjam",
    value: "7 Hari",
    description: "Durasi awal peminjaman arsip sesuai ketentuan layanan perpustakaan.",
  },
  {
    label: "Perpanjangan",
    value: "1 Kali",
    description: "Perpanjangan dapat dilakukan jika arsip belum dipesan pengguna lain dan disetujui petugas.",
  },
  {
    label: "Arsip Tertentu",
    value: "Baca di Tempat",
    description: "Beberapa arsip akademik tertentu hanya dapat diakses di area perpustakaan sesuai kebijakan layanan.",
  }
];

export const LATE_POLICIES = [
  {
    category: "Keterlambatan Pengembalian",
    penalty: "Mengikuti kebijakan perpustakaan",
    description: "Dihitung setelah melewati batas masa pinjam arsip.",
  },
  {
    category: "Kerusakan Ringan",
    penalty: "Perbaikan atau penggantian sesuai kondisi",
    description: "Berlaku untuk kerusakan seperti coretan, lipatan, atau sobekan kecil.",
  },
  {
    category: "Kerusakan Berat / Hilang",
    penalty: "Penggantian arsip",
    description: "Pengguna wajib mengganti arsip dengan judul yang sama atau setara.",
  },
  {
    category: "Pelanggaran Prosedur",
    penalty: "Pembatasan layanan sementara",
    description: "Diberlakukan jika pengguna tidak mengikuti prosedur layanan.",
  }
];

export const FAQ_ITEMS = [
  {
    question: "Bagaimana cara mengajukan peminjaman arsip?",
    answer: "Buka halaman katalog, pilih arsip yang tersedia, lalu klik tombol ajukan peminjaman pada halaman detail.",
  },
  {
    question: "Apakah semua arsip dapat dipinjam?",
    answer: "Tidak. Beberapa arsip akademik tertentu hanya dapat dibaca di tempat sesuai kebijakan perpustakaan.",
  },
  {
    question: "Bagaimana cara mengetahui lokasi arsip?",
    answer: "Lokasi rak dapat dilihat pada halaman detail arsip.",
  },
  {
    question: "Apa yang harus dibawa saat mengambil arsip fisik?",
    answer: "Bawa identitas mahasiswa atau kartu yang digunakan untuk verifikasi layanan.",
  },
  {
    question: "Bagaimana jika arsip sedang dipinjam?",
    answer: "Pengguna dapat menunggu hingga arsip tersedia kembali atau menghubungi petugas perpustakaan.",
  }
];
