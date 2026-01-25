-- AlterTable
ALTER TABLE "Product" ADD COLUMN "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate data from imageUrl to images array
UPDATE "Product" SET "images" = ARRAY["imageUrl"]::TEXT[] WHERE "imageUrl" IS NOT NULL;
UPDATE "Product" SET "images" = ARRAY[]::TEXT[] WHERE "imageUrl" IS NULL;

-- Drop old column
ALTER TABLE "Product" DROP COLUMN "imageUrl";
