/*
  Warnings:

  - You are about to drop the column `codeChallenge` on the `authorization_codes` table. All the data in the column will be lost.
  - You are about to drop the column `codeChallengeMethod` on the `authorization_codes` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `authorization_codes` table. All the data in the column will be lost.
  - You are about to drop the column `redirectUri` on the `authorization_codes` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `authorization_codes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `redirect_uri` to the `authorization_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `authorization_codes` DROP COLUMN `codeChallenge`,
    DROP COLUMN `codeChallengeMethod`,
    DROP COLUMN `expiresAt`,
    DROP COLUMN `redirectUri`,
    ADD COLUMN `code_challenge` VARCHAR(191) NULL,
    ADD COLUMN `code_challenge_method` VARCHAR(191) NULL,
    ADD COLUMN `expires_at` DATETIME(3) NOT NULL,
    ADD COLUMN `is_used` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `redirect_uri` VARCHAR(191) NOT NULL;
