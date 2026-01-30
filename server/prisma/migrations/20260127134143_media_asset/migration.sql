/*
  Warnings:

  - Added the required column `mimeType` to the `StoryAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `StoryAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `StoryAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoryAsset" ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
