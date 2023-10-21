/*
  Warnings:

  - You are about to drop the column `kkFileId` on the `Video` table. All the data in the column will be lost.
  - Added the required column `kkVodId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Video` DROP COLUMN `kkFileId`,
    ADD COLUMN `kkVodId` VARCHAR(191) NOT NULL;
