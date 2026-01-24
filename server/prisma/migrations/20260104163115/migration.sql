/*
  Warnings:

  - The values [DOCUMENT] on the enum `AssetType` will be removed. If these variants are still used in the database, this will fail.
  - The values [REVIEW] on the enum `StoryStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `idToken` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `sessionState` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PollVote` table. All the data in the column will be lost.
  - You are about to drop the column `filterUrl` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `RoleModel` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `RoleModel` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `StoryAsset` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `StorySection` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storyId]` on the table `MetaTag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endsAt` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EPaperType" AS ENUM ('E_PAPER', 'MAGAZINE');

-- CreateEnum
CREATE TYPE "EPaperStatus" AS ENUM ('PUBLISHED', 'ARCHIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "AssetType_new" AS ENUM ('IMAGE', 'VIDEO', 'PDF', 'AUDIO');
ALTER TABLE "StoryAsset" ALTER COLUMN "type" TYPE "AssetType_new" USING ("type"::text::"AssetType_new");
ALTER TYPE "AssetType" RENAME TO "AssetType_old";
ALTER TYPE "AssetType_new" RENAME TO "AssetType";
DROP TYPE "public"."AssetType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PUBLISHER';

-- AlterEnum
BEGIN;
CREATE TYPE "StoryStatus_new" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'UNPUBLISHED', 'REJECTED');
ALTER TABLE "Story" ALTER COLUMN "status" TYPE "StoryStatus_new" USING ("status"::text::"StoryStatus_new");
ALTER TYPE "StoryStatus" RENAME TO "StoryStatus_old";
ALTER TYPE "StoryStatus_new" RENAME TO "StoryStatus";
DROP TYPE "public"."StoryStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "AuditLog_createdAt_idx";

-- DropIndex
DROP INDEX "AuditLog_userId_idx";

-- DropIndex
DROP INDEX "Category_parentId_idx";

-- DropIndex
DROP INDEX "Category_slug_idx";

-- DropIndex
DROP INDEX "MetaTag_storyId_idx";

-- DropIndex
DROP INDEX "OAuthAccount_userId_idx";

-- DropIndex
DROP INDEX "Poll_createdBy_idx";

-- DropIndex
DROP INDEX "Poll_status_idx";

-- DropIndex
DROP INDEX "PollOption_pollId_idx";

-- DropIndex
DROP INDEX "PollVote_pollId_idx";

-- DropIndex
DROP INDEX "PriorityLog_changedAt_idx";

-- DropIndex
DROP INDEX "PriorityLog_storyId_idx";

-- DropIndex
DROP INDEX "Report_createdAt_idx";

-- DropIndex
DROP INDEX "Report_generatedBy_idx";

-- DropIndex
DROP INDEX "Section_slug_idx";

-- DropIndex
DROP INDEX "Session_expiresAt_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- DropIndex
DROP INDEX "Story_published_idx";

-- DropIndex
DROP INDEX "Story_slug_idx";

-- DropIndex
DROP INDEX "StoryAsset_storyId_idx";

-- DropIndex
DROP INDEX "StorySection_priority_idx";

-- DropIndex
DROP INDEX "StorySection_sectionId_idx";

-- DropIndex
DROP INDEX "StoryVersion_storyId_idx";

-- DropIndex
DROP INDEX "User_phone_idx";

-- DropIndex
DROP INDEX "UserRole_userId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "OAuthAccount" DROP COLUMN "accessToken",
DROP COLUMN "expiresAt",
DROP COLUMN "idToken",
DROP COLUMN "refreshToken",
DROP COLUMN "scope",
DROP COLUMN "sessionState",
DROP COLUMN "tokenType";

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'INACTIVE';

-- AlterTable
ALTER TABLE "PollVote" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "filterUrl";

-- AlterTable
ALTER TABLE "RoleModel" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "createdAt",
DROP COLUMN "device",
DROP COLUMN "ipAddress",
DROP COLUMN "lastUsedAt";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "published",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "publishedAt" DROP NOT NULL,
ALTER COLUMN "publishedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StoryAsset" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "StorySection" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EPaper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "EPaperType" NOT NULL,
    "editionDate" TIMESTAMP(3) NOT NULL,
    "coverImage" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "status" "EPaperStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaTag_storyId_key" ON "MetaTag"("storyId");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityLog" ADD CONSTRAINT "PriorityLog_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityLog" ADD CONSTRAINT "PriorityLog_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityLog" ADD CONSTRAINT "PriorityLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EPaper" ADD CONSTRAINT "EPaper_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
