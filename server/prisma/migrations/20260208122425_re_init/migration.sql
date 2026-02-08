-- AlterTable
ALTER TABLE "MetaTag" ADD COLUMN     "excludeIA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleBot" TEXT;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "topicTags" TEXT[];
