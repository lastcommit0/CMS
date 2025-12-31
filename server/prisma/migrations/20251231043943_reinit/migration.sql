/*
  Warnings:

  - The values [NEWS,MAGAZINE,BLOG,VIDEO,PDF] on the enum `StoryStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,REVIEW,PUBLISHED,SCHEDULED] on the enum `StoryType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `Story` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StoryStatus_new" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED');
ALTER TABLE "Story" ALTER COLUMN "status" TYPE "StoryStatus_new" USING ("status"::text::"StoryStatus_new");
ALTER TYPE "StoryStatus" RENAME TO "StoryStatus_old";
ALTER TYPE "StoryStatus_new" RENAME TO "StoryStatus";
DROP TYPE "public"."StoryStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StoryType_new" AS ENUM ('NEWS', 'MAGAZINE', 'BLOG', 'VIDEO');
ALTER TABLE "Story" ALTER COLUMN "storyType" TYPE "StoryType_new" USING ("storyType"::text::"StoryType_new");
ALTER TYPE "StoryType" RENAME TO "StoryType_old";
ALTER TYPE "StoryType_new" RENAME TO "StoryType";
DROP TYPE "public"."StoryType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "createdAt",
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "StoryVersion" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "editedBy" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoryVersion_storyId_idx" ON "StoryVersion"("storyId");

-- AddForeignKey
ALTER TABLE "StoryVersion" ADD CONSTRAINT "StoryVersion_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryVersion" ADD CONSTRAINT "StoryVersion_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
