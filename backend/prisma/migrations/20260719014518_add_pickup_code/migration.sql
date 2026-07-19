/*
  Warnings:

  - A unique constraint covering the columns `[pickupCode]` on the table `Borrowing` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Borrowing" ADD COLUMN     "pickupCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Borrowing_pickupCode_key" ON "Borrowing"("pickupCode");
