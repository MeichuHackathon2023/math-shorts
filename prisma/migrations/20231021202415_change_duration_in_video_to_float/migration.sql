/*
  Warnings:

  - You are about to alter the column `duration` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Video` MODIFY `duration` DOUBLE NOT NULL DEFAULT 0;
