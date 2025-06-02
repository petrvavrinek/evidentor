ALTER TABLE "client" DROP CONSTRAINT "client_ownerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_ownerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_clientId_client_id_fk";
--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "client_id" integer;--> statement-breakpoint
ALTER TABLE "time_entry" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "ownerId";--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "ownerId";--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "clientId";