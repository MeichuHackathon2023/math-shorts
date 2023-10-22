-- CreateIndex
CREATE FULLTEXT INDEX `Video_name_description_idx` ON `Video`(`name`, `description`);
