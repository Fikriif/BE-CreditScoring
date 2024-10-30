-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_owner_fkey";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "owner" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
