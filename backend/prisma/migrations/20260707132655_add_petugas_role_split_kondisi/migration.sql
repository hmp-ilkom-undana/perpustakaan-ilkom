/*
  Warnings:

  - You are about to drop the column `kondisiAkhir` on the `Borrowing` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PETUGAS';

-- AlterTable
ALTER TABLE "Borrowing" DROP COLUMN "kondisiAkhir",
ADD COLUMN     "catatanKondisiKembali" TEXT,
ADD COLUMN     "catatanKondisiPinjam" TEXT,
ADD COLUMN     "fotoUrlKembali" TEXT,
ADD COLUMN     "fotoUrlPinjam" TEXT,
ADD COLUMN     "kondisiKembali" "KondisiBuku",
ADD COLUMN     "kondisiPinjam" "KondisiBuku";
