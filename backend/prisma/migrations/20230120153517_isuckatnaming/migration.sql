/*
  Warnings:

  - You are about to drop the column `hashtag` on the `User` table. All the data in the column will be lost.
  - Added the required column `tag` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [hashtag];
ALTER TABLE [dbo].[User] ADD [tag] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
