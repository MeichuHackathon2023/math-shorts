-- DropForeignKey
ALTER TABLE `FlashcardProgressOnVideos` DROP FOREIGN KEY `FlashcardProgressOnVideos_flashcardProgressUserId_flashcard_fkey`;

-- DropForeignKey
ALTER TABLE `FlashcardProgressOnVideos` DROP FOREIGN KEY `FlashcardProgressOnVideos_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashcardProgressOnVideos` ADD CONSTRAINT `FlashcardProgressOnVideos_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashcardProgressOnVideos` ADD CONSTRAINT `FlashcardProgressOnVideos_flashcardProgressUserId_flashcard_fkey` FOREIGN KEY (`flashcardProgressUserId`, `flashcardProgressPlaylistId`) REFERENCES `FlashcardProgress`(`userId`, `playlistId`) ON DELETE CASCADE ON UPDATE CASCADE;
