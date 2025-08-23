ALTER TABLE "invoice" ADD COLUMN "text_id" text NULL;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_textId_unique" UNIQUE("text_id");
UPDATE "invoice" SET "text_id" = gen_random_uuid();
ALTER TABLE "invoice" ALTER COLUMN "text_id" SET NOT NULL;
