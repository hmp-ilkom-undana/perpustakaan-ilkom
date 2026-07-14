import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/authMiddleware.js";
import { createBorrowingRequest } from "../controllers/borrowingController.js"; // ingat pakai .js ya!

const router = Router();

// Endpoint: POST /api/borrowings
// Hanya Mahasiswa yang boleh meminjam
router.post(
  "/",
  requireAuth,
  requireRoles(["MAHASISWA"]),
  createBorrowingRequest,
);

export default router;
