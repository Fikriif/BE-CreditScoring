/*
  Warnings:

  - You are about to drop the column `url_image_surat_id` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_iup` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_kdu` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_nan` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_nib` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_npwpPerusahaan` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_npwpPribadi` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_tdp` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "url_image_surat_id",
DROP COLUMN "url_image_surat_iup",
DROP COLUMN "url_image_surat_kdu",
DROP COLUMN "url_image_surat_nan",
DROP COLUMN "url_image_surat_nib",
DROP COLUMN "url_image_surat_npwpPerusahaan",
DROP COLUMN "url_image_surat_npwpPribadi",
DROP COLUMN "url_image_surat_tdp",
ADD COLUMN     "url_image_imb" TEXT,
ADD COLUMN     "url_image_nib" TEXT,
ADD COLUMN     "url_image_npwp" TEXT,
ADD COLUMN     "url_image_sim" TEXT,
ADD COLUMN     "url_image_situ" TEXT,
ADD COLUMN     "url_image_siup" TEXT,
ADD COLUMN     "url_image_skdp" TEXT,
ADD COLUMN     "url_image_tdp" TEXT;
