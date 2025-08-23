ALTER TABLE "invoice" RENAME COLUMN "owner_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_owner_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;