/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Article` table. All the data in the column will be lost.
  - Added the required column `coverImageId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "coverImage",
ADD COLUMN     "coverImageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "UploadFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
