/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `UploadFile` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `UploadFile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UploadFile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UploadFile" DROP COLUMN "deletedAt",
DROP COLUMN "type",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "ImageType";
