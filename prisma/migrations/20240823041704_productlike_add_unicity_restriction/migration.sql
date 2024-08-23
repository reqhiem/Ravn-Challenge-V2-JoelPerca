/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `ProductLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductLike_userId_productId_key" ON "ProductLike"("userId", "productId");
