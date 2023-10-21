/*
  Warnings:

  - Added the required column `grade` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `grade` ENUM('FRESHMAN', 'SOPHOMORE', 'SENIOR_THREE') NOT NULL;
