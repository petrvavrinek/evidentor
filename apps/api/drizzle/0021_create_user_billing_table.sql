CREATE TABLE "user_billing" (
	"user_id" text PRIMARY KEY NOT NULL,
	"address_id" integer NOT NULL,
	"bank_account" text NOT NULL,
	"company_name" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "client_billing" CASCADE;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "company_id" text;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "vat_number" text;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "vat_payer" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_billing" ADD CONSTRAINT "user_billing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_billing" ADD CONSTRAINT "user_billing_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;
