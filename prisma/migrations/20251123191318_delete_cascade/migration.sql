-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
