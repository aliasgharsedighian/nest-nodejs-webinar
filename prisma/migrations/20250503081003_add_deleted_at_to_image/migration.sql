-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('ORIGINAL', 'THUMBNAIL');

-- AlterTable
ALTER TABLE "UploadFile" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "type" "ImageType",
ADD COLUMN     "updatedAt" TIMESTAMP(3);
