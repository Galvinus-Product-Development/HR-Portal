/*
  Warnings:

  - Changed the type of `policyCategory` on the `LeavePolicy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LeavePolicy" DROP COLUMN "policyCategory",
ADD COLUMN     "policyCategory" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PolicyCategory";
