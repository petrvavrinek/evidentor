ALTER TABLE "client" ADD COLUMN "company_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "contact_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "name";