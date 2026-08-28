-- DropIndex
DROP INDEX "Registration_cfOrderId_key";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "cfOrderId",
DROP COLUMN "cfPaymentId",
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_razorpayOrderId_key" ON "Registration"("razorpayOrderId");
