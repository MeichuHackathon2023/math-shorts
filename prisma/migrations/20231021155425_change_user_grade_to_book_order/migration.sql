/*
  Warnings:

  - The values [FRESHMAN,SOPHOMORE,SENIOR_THREE] on the enum `User_grade` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `grade` ENUM('FIRST', 'SECOND', 'THIRD', 'FOURTH') NOT NULL;
