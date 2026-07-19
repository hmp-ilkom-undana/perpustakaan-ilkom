import { Request, Response } from "express";
import { prisma } from "../auth.js";

interface AuthRequest extends Request {
  user?: any;
}

export const createBorrowingRequest = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { archiveId } = req.body;
    const userId = req.user?.id;

    // 1. Validasi Sesi: Memastikan user sudah login
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Anda harus login." });
    }

    // 2. Cek eksistensi arsip di database
    const archive = await prisma.archive.findUnique({
      where: { id: archiveId },
    });

    if (!archive) {
      return res.status(404).json({ error: "Arsip tidak ditemukan." });
    }

    // 3. Hitung transaksi aktif mahasiswa untuk TIPE arsip
    // Status aktif: REQUESTED, BORROWED, OVERDUE
    const activeBorrowingsCount = await prisma.borrowing.count({
      where: {
        userId: userId,
        archive: {
          archiveType: archive.archiveType, // Hanya hitung tipe arsip yang sama
        },
        status: {
          in: ["REQUESTED","WAITING_PICKUP", "BORROWED", "OVERDUE"],
        },
      },
    });

    // 4. Validasi Kuota berdasarkan tipe arsip
    let maxAllowed = 0;
    const currentArchiveType = archive.archiveType.toUpperCase();

    // Aturan Jumlah Peminjaman Maksimal
    if (currentArchiveType === "SKRIPSI") {
      maxAllowed = 2;
    } else if (currentArchiveType === "RINGKASAN") {
      maxAllowed = 1;
    } else if (currentArchiveType === "NASKAH_PUBLIKASI") {
      maxAllowed = 1;
    }

    if (activeBorrowingsCount >= maxAllowed) {
      return res.status(400).json({
        error: `Kuota peminjaman penuh. Anda hanya diperbolehkan meminjam maksimal ${maxAllowed} arsip tipe ${archive.archiveType} secara bersamaan.`,
      });
    }

    // 5. Validasi Ketersediaan (Status & Stok)
    const availableStock = archive.quantity - archive.reservedQuantity;

    if (archive.status !== "TERSEDIA" || availableStock <= 0) {
      return res.status(400).json({
        error:
          "Arsip sedang diantre atau tidak tersedia untuk dipinjam saat ini.",
      });
    }

    // 6A. Generate Pickup Code 4-Digit Angka (Contoh: REQ-8192)
    const generatePickupCode = () => {
      // Menghasilkan angka acak dari 1000 hingga 9999
      const randomNumbers = Math.floor(1000 + Math.random() * 9000);
      return `REQ-${randomNumbers}`;
    };

    const pickupCode = generatePickupCode();

    // 6B. Buat Record Peminjaman
    const newBorrowing = await prisma.borrowing.create({
      data: {
        userId: userId,
        archiveId: archiveId,
        status: "REQUESTED",
        pickupCode: pickupCode,
      },
      include: {
        archive: true,
      },
    });

    // 7. Update reservedQuantity
    await prisma.archive.update({
      where: { id: archiveId },
      data: {
        reservedQuantity: {
          increment: 1, // Tambah 1 ke daftar antrean
        },
      },
    });

    res.status(201).json({
      message: "Pengajuan peminjaman berhasil dibuat.",
      data: newBorrowing,
    });
  } catch (error) {
    console.error("Error createBorrowingRequest:", error);
    res.status(500).json({ error: "Terjadi kesalahan internal server." });
  }
};

export const getMyBorrowingHistory = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Anda harus login." });
    }

    // Ambil data peminjaman milik user ini, urutkan dari yang terbaru
    const history = await prisma.borrowing.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        borrowDate: "desc", // Yang paling baru di atas
      },
      include: {
        archive: true, // Ambil juga detail arsip yang dipinjam (judul, tahun, dll)
      },
    });

    res.status(200).json(history);
  } catch (error) {
    console.error("Error getMyBorrowingHistory:", error);
    res.status(500).json({ error: "Terjadi kesalahan internal server." });
  }
};

