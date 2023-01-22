/*
  Warnings:

  - You are about to drop the column `tag` on the `User` table. All the data in the column will be lost.
  - Added the required column `modifiedAt` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashtag` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Profile] ADD [modifiedAt] DATETIME2 NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [tag];
ALTER TABLE [dbo].[User] ADD [hashtag] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
