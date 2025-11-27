-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "statusesApplied" TEXT[] DEFAULT ARRAY[]::TEXT[];
