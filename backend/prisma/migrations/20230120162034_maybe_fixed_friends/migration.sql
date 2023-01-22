/*
  Warnings:

  - Added the required column `contents` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Message] ADD [contents] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Friend] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    CONSTRAINT [Friend_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Friend] ADD CONSTRAINT [Friend_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
