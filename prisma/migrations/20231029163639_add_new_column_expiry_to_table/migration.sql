BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[File] ADD [expired] BIT NOT NULL CONSTRAINT [File_expired_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
