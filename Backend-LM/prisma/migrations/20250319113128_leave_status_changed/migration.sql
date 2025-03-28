/*
  Warnings:

  - The values [PENDING,APPROVED,REJECTED,ON_HOLD] on the enum `LeaveStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeaveStatus_new" AS ENUM ('All', 'Pending', 'Approved', 'Rejected', 'On_Hold');
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" TYPE "LeaveStatus_new" USING ("status"::text::"LeaveStatus_new");
ALTER TABLE "LeaveHistory" ALTER COLUMN "status" TYPE "LeaveStatus_new" USING ("status"::text::"LeaveStatus_new");
ALTER TYPE "LeaveStatus" RENAME TO "LeaveStatus_old";
ALTER TYPE "LeaveStatus_new" RENAME TO "LeaveStatus";
DROP TYPE "LeaveStatus_old";
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" SET DEFAULT 'Pending';
