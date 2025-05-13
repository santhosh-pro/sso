/*
  Warnings:

  - You are about to drop the `origin_urls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `origin_urls` DROP FOREIGN KEY `origin_urls_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `permission_roles` DROP FOREIGN KEY `permission_roles_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `permission_roles` DROP FOREIGN KEY `permission_roles_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_userId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('MEMBER', 'MODRATOR', 'DEV', 'SUPER_ADMIN') NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE `origin_urls`;

-- DropTable
DROP TABLE `permission_roles`;

-- DropTable
DROP TABLE `permissions`;

-- DropTable
DROP TABLE `roles`;

-- DropTable
DROP TABLE `user_roles`;
