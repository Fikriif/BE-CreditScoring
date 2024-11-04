/*
  Warnings:

  - You are about to drop the column `url_image_imb` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_nib` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_npwp` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_sim` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_situ` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_siup` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_skdp` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_tdp` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "url_image_imb",
DROP COLUMN "url_image_nib",
DROP COLUMN "url_image_npwp",
DROP COLUMN "url_image_sim",
DROP COLUMN "url_image_situ",
DROP COLUMN "url_image_siup",
DROP COLUMN "url_image_skdp",
DROP COLUMN "url_image_tdp";

-- CreateTable
CREATE TABLE "Automation" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "url_image_nib" TEXT,
    "url_image_siup" TEXT,
    "url_image_tdp" TEXT,
    "url_image_skdp" TEXT,
    "url_image_npwp" TEXT,
    "url_image_situ" TEXT,
    "url_image_imb" TEXT,
    "url_image_sim" TEXT,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);
