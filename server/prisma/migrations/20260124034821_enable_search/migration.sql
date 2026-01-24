/*
  Warnings:

  - The values [EDITOR,WRITER,CONTRIBUTOR] on the enum `Designation` will be removed. If these variants are still used in the database, this will fail.
  - The values [PUBLISHER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `accountLockedUntil` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Designation_new" AS ENUM ('OPERATIONS_MANAGER', 'COMMUNITY_MODERATOR', 'COMPLIANCE_OFFICER', 'EDITOR_IN_CHIEF', 'MANAGING_EDITOR', 'SENIOR_EDITOR', 'COPY_EDITOR', 'SEO_EDITOR');
ALTER TABLE "UserProfile" ALTER COLUMN "designation" TYPE "Designation_new" USING ("designation"::text::"Designation_new");
ALTER TYPE "Designation" RENAME TO "Designation_old";
ALTER TYPE "Designation_new" RENAME TO "Designation";
DROP TYPE "public"."Designation_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'SUB_ADMIN', 'EDITOR');
ALTER TABLE "RoleModel" ALTER COLUMN "name" TYPE "Role_new" USING ("name"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountLockedUntil";

-- CreateIndex
CREATE INDEX "Story_priority_idx" ON "Story"("priority");

-- CreateIndex
CREATE INDEX "StorySection_priority_idx" ON "StorySection"("priority");

-- CreateIndex
CREATE INDEX "StorySection_sectionId_idx" ON "StorySection"("sectionId");


-- PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Custom Text Search Configuration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_ts_config WHERE cfgname = 'english_unaccent'
  ) THEN
    CREATE TEXT SEARCH CONFIGURATION english_unaccent (COPY = english);
    ALTER TEXT SEARCH CONFIGURATION english_unaccent
      ALTER MAPPING FOR hword, hword_part, word
      WITH unaccent, english_stem;
  END IF;
END$$;

-- Full-Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_story_fts
ON "Story"
USING gin(
  to_tsvector('english_unaccent', title || ' ' || COALESCE(excerpt, ''))
);

CREATE INDEX IF NOT EXISTS idx_user_fts
ON "User"
USING gin(
  to_tsvector('english_unaccent', name || ' ' || email)
);

CREATE INDEX IF NOT EXISTS idx_section_fts
ON "Section"
USING gin(
  to_tsvector('english_unaccent', name)
);

CREATE INDEX IF NOT EXISTS idx_category_fts
ON "Category"
USING gin(
  to_tsvector('english_unaccent', name)
);

CREATE INDEX IF NOT EXISTS idx_poll_fts
ON "Poll"
USING gin(
  to_tsvector('english_unaccent', question)
);

-- Trigram Indexes
CREATE INDEX IF NOT EXISTS idx_story_title_trgm
ON "Story" USING gin(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_story_excerpt_trgm
ON "Story" USING gin(excerpt gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_user_name_trgm
ON "User" USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_user_email_trgm
ON "User" USING gin(email gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_section_name_trgm
ON "Section" USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_category_name_trgm
ON "Category" USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_poll_question_trgm
ON "Poll" USING gin(question gin_trgm_ops);