/*
  Warnings:

  - You are about to drop the column `userId` on the `Token` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropIndex
DROP INDEX "Token_userId_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "userId";
