-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_foldersId_fkey";

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_foldersId_fkey" FOREIGN KEY ("foldersId") REFERENCES "Folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
