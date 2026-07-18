/*
  Warnings:

  - You are about to drop the column `bookId` on the `Borrowing` table. All the data in the column will be lost.
  - The `kondisiKembali` column on the `Borrowing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `kondisiPinjam` column on the `Borrowing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `archiveId` to the `Borrowing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArchiveStatus" AS ENUM ('TERSEDIA', 'DIPINJAM');

-- CreateEnum
CREATE TYPE "KondisiArsip" AS ENUM ('BAIK', 'RUSAK', 'HILANG');

-- DropForeignKey
ALTER TABLE "Borrowing" DROP CONSTRAINT "Borrowing_bookId_fkey";

-- AlterTable
ALTER TABLE "Borrowing" DROP COLUMN "bookId",
ADD COLUMN     "archiveId" TEXT NOT NULL,
DROP COLUMN "kondisiKembali",
ADD COLUMN     "kondisiKembali" "KondisiArsip",
DROP COLUMN "kondisiPinjam",
ADD COLUMN     "kondisiPinjam" "KondisiArsip";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayUsername" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "Book";

-- DropEnum
DROP TYPE "BookStatus";

-- DropEnum
DROP TYPE "KondisiBuku";

-- CreateTable
CREATE TABLE "Archive" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "status" "ArchiveStatus" NOT NULL DEFAULT 'TERSEDIA',
    "archiveType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "shelfLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Archive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Borrowing" ADD CONSTRAINT "Borrowing_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
