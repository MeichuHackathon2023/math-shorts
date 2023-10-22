/*
  Warnings:

  - You are about to drop the column `secondElapsed` on the `PlayProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `PlayProgress` DROP COLUMN `secondElapsed`,
    ADD COLUMN `percentageElapsed` DOUBLE NOT NULL DEFAULT 0;
