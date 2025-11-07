/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "shopifyLastSyncAt" TIMESTAMP(3),
ADD COLUMN     "shopifySyncStatus" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "syncedWithShopify" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."Product";
