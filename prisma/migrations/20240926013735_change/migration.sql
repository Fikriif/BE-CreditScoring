/*
  Warnings:

  - You are about to drop the column `img_ktp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `img_selfie` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "img_ktp",
DROP COLUMN "img_selfie",
ADD COLUMN     "ktpPhoto" TEXT,
ADD COLUMN     "selfiePhoto" TEXT;
