/*
  Warnings:

  - You are about to drop the column `address` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "address";

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
