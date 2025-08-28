UPDATE "address" SET "postal_code"='' WHERE "postal_code" IS NULL;
ALTER TABLE "address" ALTER COLUMN "postal_code" SET NOT NULL;