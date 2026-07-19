import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/authMiddleware.js";
import {
  createBorrowingRequest,
  getMyBorrowingHistory,
} from "../controllers/borrowingController.js";

const router = Router();

// Endpoint: POST /api/borrowings
// Hanya Mahasiswa yang boleh meminjam
router.post(
  "/",
  requireAuth,
  requireRoles(["MAHASISWA"]),
  createBorrowingRequest,
);

// Endpoint: GET /api/borrowings/history
// Mengambil riwayat peminjaman milik mahasiswa yang sedang login
router.get(
  "/history",
  requireAuth,
  requireRoles(["MAHASISWA"]),
  getMyBorrowingHistory,
);

export default router;
