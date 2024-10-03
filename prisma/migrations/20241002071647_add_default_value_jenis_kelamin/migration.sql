/*
  Warnings:

  - You are about to drop the column `img_profile` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "img_profile",
ADD COLUMN     "jenis_kelamin" TEXT NOT NULL DEFAULT 'unknown';
