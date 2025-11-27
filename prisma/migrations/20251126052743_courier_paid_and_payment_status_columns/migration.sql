-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "courierPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "courierPaymentStatus" TEXT NOT NULL DEFAULT 'Pending';
