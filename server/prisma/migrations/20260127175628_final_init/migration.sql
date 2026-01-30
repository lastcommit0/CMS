/*
  Warnings:

  - You are about to drop the column `coverImage` on the `EPaper` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `EPaper` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `StoryAsset` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `StoryAsset` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `StoryAsset` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `StoryAsset` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `StoryAsset` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `StoryAsset` table. All the data in the column will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pdfMediaId]` on the table `EPaper` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `StoryAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `StoryAsset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_epaperId_fkey";

-- AlterTable
ALTER TABLE "EPaper" DROP COLUMN "coverImage",
DROP COLUMN "pdfUrl",
ADD COLUMN     "pdfMediaId" TEXT;

-- AlterTable
ALTER TABLE "StoryAsset" DROP COLUMN "fileUrl",
DROP COLUMN "metadata",
DROP COLUMN "mimeType",
DROP COLUMN "publicId",
DROP COLUMN "size",
DROP COLUMN "type",
ADD COLUMN     "isCover" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mediaId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Page";

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "metadata" JSONB,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageAsset" (
    "id" TEXT NOT NULL,
    "epaperId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PageAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageAsset_epaperId_order_key" ON "PageAsset"("epaperId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "EPaper_pdfMediaId_key" ON "EPaper"("pdfMediaId");

-- CreateIndex
CREATE INDEX "StoryAsset_storyId_order_idx" ON "StoryAsset"("storyId", "order");

-- AddForeignKey
ALTER TABLE "StoryAsset" ADD CONSTRAINT "StoryAsset_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EPaper" ADD CONSTRAINT "EPaper_pdfMediaId_fkey" FOREIGN KEY ("pdfMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageAsset" ADD CONSTRAINT "PageAsset_epaperId_fkey" FOREIGN KEY ("epaperId") REFERENCES "EPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageAsset" ADD CONSTRAINT "PageAsset_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
