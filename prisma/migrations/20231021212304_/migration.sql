/*
  Warnings:

  - A unique constraint covering the columns `[kkVodId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Video_kkVodId_key` ON `Video`(`kkVodId`);
