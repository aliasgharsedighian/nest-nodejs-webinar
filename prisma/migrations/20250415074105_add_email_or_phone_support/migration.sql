/*
  Warnings:

  - You are about to drop the column `mobileNumber` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "deliveryTarget" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "mobileNumber";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
