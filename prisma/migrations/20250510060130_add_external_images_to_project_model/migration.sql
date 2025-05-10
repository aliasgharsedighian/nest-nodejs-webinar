/*
  Warnings:

  - You are about to drop the column `ImageId` on the `ProjectCategory` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `ProjectCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectCategory" DROP CONSTRAINT "ProjectCategory_ImageId_fkey";

-- AlterTable
ALTER TABLE "ProjectCategory" DROP COLUMN "ImageId",
ADD COLUMN     "imageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ExternalImages" (
    "id" SERIAL NOT NULL,
    "before" TEXT,
    "after" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "uploadFileId" INTEGER NOT NULL,
    "type" INTEGER,

    CONSTRAINT "ExternalImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalImagesCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalImagesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalImagesCategory_name_key" ON "ExternalImagesCategory"("name");

-- AddForeignKey
ALTER TABLE "ProjectCategory" ADD CONSTRAINT "ProjectCategory_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "UploadFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalImages" ADD CONSTRAINT "ExternalImages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalImages" ADD CONSTRAINT "ExternalImages_uploadFileId_fkey" FOREIGN KEY ("uploadFileId") REFERENCES "UploadFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalImages" ADD CONSTRAINT "ExternalImages_type_fkey" FOREIGN KEY ("type") REFERENCES "ExternalImagesCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalImagesCategory" ADD CONSTRAINT "ExternalImagesCategory_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "UploadFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
