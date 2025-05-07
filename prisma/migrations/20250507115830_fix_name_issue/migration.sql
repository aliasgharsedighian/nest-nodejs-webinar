/*
  Warnings:

  - You are about to drop the column `articleId` on the `ProjectImage` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `ProjectImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectComment" DROP CONSTRAINT "ProjectComment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectImage" DROP CONSTRAINT "ProjectImage_articleId_fkey";

-- AlterTable
ALTER TABLE "ProjectImage" DROP COLUMN "articleId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ProjectComment_projectId_idx" ON "ProjectComment"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComment" ADD CONSTRAINT "ProjectComment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
