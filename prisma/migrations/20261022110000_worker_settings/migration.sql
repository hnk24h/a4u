CREATE TABLE "WorkerSetting" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "ingestionEnabled" BOOLEAN NOT NULL DEFAULT true,
  "pollIntervalMinutes" INTEGER NOT NULL DEFAULT 30,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WorkerSetting_pkey" PRIMARY KEY ("id")
);
