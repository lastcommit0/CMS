/*
  Warnings:

  - Added the required column `shortTitle` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "district" TEXT,
ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "mandal" TEXT,
ADD COLUMN     "photoCaption" TEXT,
ADD COLUMN     "photoCredit" TEXT,
ADD COLUMN     "place" TEXT,
ADD COLUMN     "shortTitle" TEXT NOT NULL;
