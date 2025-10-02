/*
  Warnings:

  - Added the required column `rawPayload` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "rawPayload" JSONB NOT NULL;
