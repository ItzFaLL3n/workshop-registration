-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('RAZORPAY', 'CASH');

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'RAZORPAY';
