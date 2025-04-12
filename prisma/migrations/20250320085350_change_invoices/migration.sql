/*
  Warnings:

  - You are about to drop the `Invoice_items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice_items" DROP CONSTRAINT "Invoice_items_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice_items" DROP CONSTRAINT "Invoice_items_productId_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "invoiceDescription" TEXT;

-- DropTable
DROP TABLE "Invoice_items";

-- CreateTable
CREATE TABLE "InvoiceItems" (
    "invoiceLineId" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "InvoiceItems_pkey" PRIMARY KEY ("invoiceLineId")
);

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItems" ADD CONSTRAINT "InvoiceItems_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItems" ADD CONSTRAINT "InvoiceItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
