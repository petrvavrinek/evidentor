ALTER TABLE "invoice" DROP CONSTRAINT "invoice_textId_unique";--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_userId_textId_unique" UNIQUE("user_id","text_id");