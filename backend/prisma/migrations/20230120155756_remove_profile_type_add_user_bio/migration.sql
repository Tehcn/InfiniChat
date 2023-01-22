/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Profile] DROP CONSTRAINT [Profile_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[User] ADD [bio] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[Profile];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
