/*
  Warnings:

  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Friend] DROP CONSTRAINT [Friend_userId_fkey];

-- DropTable
DROP TABLE [dbo].[Friend];

-- CreateTable
CREATE TABLE [dbo].[_friends] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_friends_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_friends_B_index] ON [dbo].[_friends]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_friends] ADD CONSTRAINT [_friends_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[_friends] ADD CONSTRAINT [_friends_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
