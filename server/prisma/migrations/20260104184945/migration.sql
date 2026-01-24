/*
  Warnings:

  - The values [IN_REVIEW] on the enum `StoryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StoryStatus_new" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'UNPUBLISHED', 'REJECTED');
ALTER TABLE "Story" ALTER COLUMN "status" TYPE "StoryStatus_new" USING ("status"::text::"StoryStatus_new");
ALTER TYPE "StoryStatus" RENAME TO "StoryStatus_old";
ALTER TYPE "StoryStatus_new" RENAME TO "StoryStatus";
DROP TYPE "public"."StoryStatus_old";
COMMIT;
