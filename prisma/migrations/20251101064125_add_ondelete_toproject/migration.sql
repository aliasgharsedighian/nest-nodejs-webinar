-- DropForeignKey
ALTER TABLE "ProjectCategory" DROP CONSTRAINT "ProjectCategory_imageId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectCategory" ADD CONSTRAINT "ProjectCategory_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "UploadFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
