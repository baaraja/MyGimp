-- DropForeignKey
ALTER TABLE "Layer" DROP CONSTRAINT "Layer_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Layer" ADD CONSTRAINT "Layer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
