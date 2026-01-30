/*
  Warnings:

  - You are about to drop the column `createdBy` on the `EPaper` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `EPaper` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EPaper" DROP CONSTRAINT "EPaper_createdBy_fkey";

-- AlterTable
ALTER TABLE "EPaper" DROP COLUMN "createdBy",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EPaper" ADD CONSTRAINT "EPaper_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
