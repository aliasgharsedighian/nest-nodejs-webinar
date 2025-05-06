-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_coverImageId_fkey";

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "UploadFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
