/*
  Warnings:

  - You are about to drop the column `flashcardProgressPlaylistId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `flashcardProgressUserId` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_flashcardProgressUserId_flashcardProgressPlaylistId_fkey`;

-- AlterTable
ALTER TABLE `Video` DROP COLUMN `flashcardProgressPlaylistId`,
    DROP COLUMN `flashcardProgressUserId`;

-- CreateTable
CREATE TABLE `FlashcardProgressOnVideos` (
    `videoId` INTEGER NOT NULL,
    `flashcardProgressUserId` INTEGER NOT NULL,
    `flashcardProgressPlaylistId` INTEGER NOT NULL,

    PRIMARY KEY (`videoId`, `flashcardProgressUserId`, `flashcardProgressPlaylistId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FlashcardProgressOnVideos` ADD CONSTRAINT `FlashcardProgressOnVideos_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashcardProgressOnVideos` ADD CONSTRAINT `FlashcardProgressOnVideos_flashcardProgressUserId_flashcard_fkey` FOREIGN KEY (`flashcardProgressUserId`, `flashcardProgressPlaylistId`) REFERENCES `FlashcardProgress`(`userId`, `playlistId`) ON DELETE RESTRICT ON UPDATE CASCADE;
