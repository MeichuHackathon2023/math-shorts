/*
  Warnings:

  - The values [FIRST,SECOND,THIRD,FOURTH] on the enum `User_grade` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `grade` ENUM('FRESHMAN', 'SOPHOMORE', 'SENIOR_THREE') NOT NULL;
