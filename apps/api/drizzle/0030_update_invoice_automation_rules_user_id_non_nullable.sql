ALTER TABLE "invoice_automation_rules" DROP CONSTRAINT "invoice_automation_rules_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ADD CONSTRAINT "invoice_automation_rules_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;