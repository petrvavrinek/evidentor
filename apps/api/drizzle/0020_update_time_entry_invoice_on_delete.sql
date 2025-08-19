ALTER TABLE "time_entry" DROP CONSTRAINT "time_entry_invoice_id_invoice_id_fk";
--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE set null ON UPDATE no action;