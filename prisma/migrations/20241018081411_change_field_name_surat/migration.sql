/*
  Warnings:

  - You are about to drop the column `url_image_surat_izin_dinas` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_izin_usaha_perdagangan` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_keterangan_domisili_usaha` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_nomor_akta_notaris` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_nomor_induk_berusaha` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_nomor_pokok_wajib_pajak_perusahaan` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_nomor_pokok_wajib_pajak_pribadi` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `url_image_surat_tanda_daftar_perusahaan` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "url_image_surat_izin_dinas",
DROP COLUMN "url_image_surat_izin_usaha_perdagangan",
DROP COLUMN "url_image_surat_keterangan_domisili_usaha",
DROP COLUMN "url_image_surat_nomor_akta_notaris",
DROP COLUMN "url_image_surat_nomor_induk_berusaha",
DROP COLUMN "url_image_surat_nomor_pokok_wajib_pajak_perusahaan",
DROP COLUMN "url_image_surat_nomor_pokok_wajib_pajak_pribadi",
DROP COLUMN "url_image_surat_tanda_daftar_perusahaan",
ADD COLUMN     "url_image_surat_id" TEXT,
ADD COLUMN     "url_image_surat_iup" TEXT,
ADD COLUMN     "url_image_surat_kdu" TEXT,
ADD COLUMN     "url_image_surat_nan" TEXT,
ADD COLUMN     "url_image_surat_nib" TEXT,
ADD COLUMN     "url_image_surat_npwpPerusahaan" TEXT,
ADD COLUMN     "url_image_surat_npwpPribadi" TEXT,
ADD COLUMN     "url_image_surat_tdp" TEXT;
