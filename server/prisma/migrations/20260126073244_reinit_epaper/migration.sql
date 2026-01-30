/*
  Warnings:

  - You are about to drop the column `editionDate` on the `EPaper` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_category_name_trgm";

-- DropIndex
DROP INDEX "idx_poll_question_trgm";

-- DropIndex
DROP INDEX "idx_section_name_trgm";

-- DropIndex
DROP INDEX "idx_story_excerpt_trgm";

-- DropIndex
DROP INDEX "idx_story_title_trgm";

-- DropIndex
DROP INDEX "idx_user_email_trgm";

-- DropIndex
DROP INDEX "idx_user_name_trgm";

-- AlterTable
ALTER TABLE "EPaper" DROP COLUMN "editionDate";

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "epaperId" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_epaperId_fkey" FOREIGN KEY ("epaperId") REFERENCES "EPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
