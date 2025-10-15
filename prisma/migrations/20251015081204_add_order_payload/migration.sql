/*
  Warnings:

  - You are about to drop the column `concludedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `rawPayload` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "concludedAt",
DROP COLUMN "rawPayload";

-- CreateTable
CREATE TABLE "public"."OrderPayload" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderPayload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderPayload_orderId_key" ON "public"."OrderPayload"("orderId");

-- AddForeignKey
ALTER TABLE "public"."OrderPayload" ADD CONSTRAINT "OrderPayload_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
