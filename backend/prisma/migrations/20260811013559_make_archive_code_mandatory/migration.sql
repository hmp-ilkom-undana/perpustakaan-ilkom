/*
  Warnings:

  - Made the column `archiveCode` on table `Archive` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Archive" ALTER COLUMN "archiveCode" SET NOT NULL;
