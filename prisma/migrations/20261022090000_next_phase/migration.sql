-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Digest" ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "summary" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "ingestedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastFetchError" TEXT,
ADD COLUMN     "lastFetchStatus" TEXT NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'vi',
    "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "Article_language_publishedAt_idx" ON "Article"("language", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Source_lastFetchStatus_lastFetchedAt_idx" ON "Source"("lastFetchStatus", "lastFetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
