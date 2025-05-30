ALTER TABLE "project" ADD COLUMN "ownerId" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;