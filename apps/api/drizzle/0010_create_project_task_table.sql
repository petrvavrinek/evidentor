CREATE TABLE "project_task" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_task_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"project_id" integer,
	"description" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "time_entry" ADD COLUMN "project_task_id" integer;--> statement-breakpoint
ALTER TABLE "project_task" ADD CONSTRAINT "project_task_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_project_task_id_project_task_id_fk" FOREIGN KEY ("project_task_id") REFERENCES "public"."project_task"("id") ON DELETE set null ON UPDATE no action;