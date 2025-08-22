ALTER TABLE "user_billing" ADD COLUMN "company_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_billing" ADD COLUMN "vat_number" text;--> statement-breakpoint
ALTER TABLE "user_billing" ADD COLUMN "vat_payer" boolean DEFAULT false;