CREATE TYPE "public"."language" AS ENUM('cs', 'en');--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "language" "language" NULL;
UPDATE "invoice" SET "language" = 'cs'::"language" WHERE "language" IS NULL;
ALTER TABLE "invoice" ALTER COLUMN "language" SET NOT NULL;