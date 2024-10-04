/*
  Warnings:

  - The values [L,P] on the enum `JenisKelamin` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JenisKelamin_new" AS ENUM ('male', 'female');
ALTER TABLE "User" ALTER COLUMN "jenis_kelamin" TYPE "JenisKelamin_new" USING ("jenis_kelamin"::text::"JenisKelamin_new");
ALTER TYPE "JenisKelamin" RENAME TO "JenisKelamin_old";
ALTER TYPE "JenisKelamin_new" RENAME TO "JenisKelamin";
DROP TYPE "JenisKelamin_old";
COMMIT;
