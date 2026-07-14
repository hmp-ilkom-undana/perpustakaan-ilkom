import { Request, Response } from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

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

    // 3. Hitung transaksi aktif mahasiswa untuk TIPE arsip ini saja
    // Status aktif: REQUESTED, BORROWED, OVERDUE
    const activeBorrowingsCount = await prisma.borrowing.count({
      where: {
        userId: userId,
        archive: {
          archiveType: archive.archiveType, // Hanya hitung tipe arsip yang sama
        },
        status: {
          in: ["REQUESTED", "BORROWED", "OVERDUE"],
        },
      },
    });

    // 4. Validasi Kuota berdasarkan tipe arsip
    let maxAllowed = 0;

    // Aturan Jumlah Peminjaman Maksimal
    if (archive.archiveType === "SKRIPSI") {
      maxAllowed = 2;
    } else if (archive.archiveType === "RINGKASAN") {
      maxAllowed = 1;
    } else if (archive.archiveType === "NASKAH_PUBLIKASI") {
      maxAllowed = 1;
    }

    if (activeBorrowingsCount >= maxAllowed) {
      return res.status(400).json({
        error: `Kuota peminjaman penuh. Anda hanya diperbolehkan meminjam maksimal ${maxAllowed} arsip tipe ${archive.archiveType} secara bersamaan.`,
      });
    }

    // 5. Validasi Ketersediaan (Status & Stok)
    if (archive.status !== "TERSEDIA" || archive.quantity <= 0) {
      return res
        .status(400)
        .json({
          error: "Arsip sedang tidak tersedia untuk dipinjam saat ini.",
        });
    }

    // 6. Buat Record Peminjaman
    const newBorrowing = await prisma.borrowing.create({
      data: {
        userId: userId,
        archiveId: archiveId,
        status: "REQUESTED",
      },
      include: {
        archive: true,
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
