-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'TEST_CENTER_ADMIN');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TelegramPostType" AS ENUM ('EXAM_APPROVED', 'NEWS_PUBLISHED');

-- CreateEnum
CREATE TYPE "TelegramPostStatus" AS ENUM ('SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_CREATED', 'USER_UPDATED', 'USER_DEACTIVATED', 'TEST_CENTER_CREATED', 'TEST_CENTER_UPDATED', 'EXAM_SUBMITTED', 'EXAM_APPROVED', 'EXAM_REJECTED', 'EXAM_CANCELLED', 'EXAM_EXPIRED', 'NEWS_CREATED', 'NEWS_UPDATED', 'NEWS_PUBLISHED', 'NEWS_DELETED', 'TELEGRAM_POST_SENT', 'TELEGRAM_POST_FAILED', 'LOGIN_SUCCESS', 'LOGIN_FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TEST_CENTER_ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "testCenterId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCenter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamDate" (
    "id" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3),
    "capacity" INTEGER,
    "price" INTEGER,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "status" "ExamStatus" NOT NULL DEFAULT 'PENDING',
    "rejectReason" TEXT,
    "telegramPostedAt" TIMESTAMP(3),
    "testCenterId" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramPostLog" (
    "id" TEXT NOT NULL,
    "type" "TelegramPostType" NOT NULL,
    "status" "TelegramPostStatus" NOT NULL,
    "chatId" TEXT,
    "messageId" INTEGER,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "examDateId" TEXT,
    "newsId" TEXT,

    CONSTRAINT "TelegramPostLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "detail" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_testCenterId_idx" ON "User"("testCenterId");

-- CreateIndex
CREATE UNIQUE INDEX "TestCenter_slug_key" ON "TestCenter"("slug");

-- CreateIndex
CREATE INDEX "TestCenter_region_idx" ON "TestCenter"("region");

-- CreateIndex
CREATE INDEX "TestCenter_isActive_idx" ON "TestCenter"("isActive");

-- CreateIndex
CREATE INDEX "ExamDate_status_idx" ON "ExamDate"("status");

-- CreateIndex
CREATE INDEX "ExamDate_examDate_idx" ON "ExamDate"("examDate");

-- CreateIndex
CREATE INDEX "ExamDate_testCenterId_idx" ON "ExamDate"("testCenterId");

-- CreateIndex
CREATE INDEX "ExamDate_status_examDate_idx" ON "ExamDate"("status", "examDate");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_published_publishedAt_idx" ON "News"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "News_authorId_idx" ON "News"("authorId");

-- CreateIndex
CREATE INDEX "TelegramPostLog_type_idx" ON "TelegramPostLog"("type");

-- CreateIndex
CREATE INDEX "TelegramPostLog_status_idx" ON "TelegramPostLog"("status");

-- CreateIndex
CREATE INDEX "TelegramPostLog_createdAt_idx" ON "TelegramPostLog"("createdAt");

-- CreateIndex
CREATE INDEX "TelegramPostLog_examDateId_idx" ON "TelegramPostLog"("examDateId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_testCenterId_fkey" FOREIGN KEY ("testCenterId") REFERENCES "TestCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamDate" ADD CONSTRAINT "ExamDate_testCenterId_fkey" FOREIGN KEY ("testCenterId") REFERENCES "TestCenter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamDate" ADD CONSTRAINT "ExamDate_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamDate" ADD CONSTRAINT "ExamDate_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramPostLog" ADD CONSTRAINT "TelegramPostLog_examDateId_fkey" FOREIGN KEY ("examDateId") REFERENCES "ExamDate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramPostLog" ADD CONSTRAINT "TelegramPostLog_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

