-- AlterTable
ALTER TABLE `polls` ADD COLUMN `createdById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `polls` ADD CONSTRAINT `polls_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
