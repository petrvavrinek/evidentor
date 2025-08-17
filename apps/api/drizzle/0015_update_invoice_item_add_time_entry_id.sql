ALTER TABLE "invoice_item" DROP CONSTRAINT "invoice_item_project_task_id_project_task_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_client_id_client_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_item" ADD COLUMN "time_entry_id" integer;--> statement-breakpoint
ALTER TABLE "time_entry" ADD COLUMN "invoice_id" integer;--> statement-breakpoint
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_time_entry_id_time_entry_id_fk" FOREIGN KEY ("time_entry_id") REFERENCES "public"."time_entry"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_item" DROP COLUMN "project_task_id";--> statement-breakpoint
ALTER TABLE "invoice" DROP COLUMN "client_id";--> statement-breakpoint
ALTER TABLE "invoice" DROP COLUMN "project_id";