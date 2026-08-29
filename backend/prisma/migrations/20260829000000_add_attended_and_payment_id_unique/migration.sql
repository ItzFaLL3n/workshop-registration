-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "attended" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_razorpayPaymentId_key" ON "Registration"("razorpayPaymentId");
