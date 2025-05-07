/*
  Warnings:

  - You are about to drop the column `coverImageId` on the `ProjectCategory` table. All the data in the column will be lost.
  - Added the required column `ImageId` to the `ProjectCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectCategory" DROP CONSTRAINT "ProjectCategory_coverImageId_fkey";

-- AlterTable
ALTER TABLE "ProjectCategory" DROP COLUMN "coverImageId",
ADD COLUMN     "ImageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "UploadFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCategory" ADD CONSTRAINT "ProjectCategory_ImageId_fkey" FOREIGN KEY ("ImageId") REFERENCES "UploadFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
