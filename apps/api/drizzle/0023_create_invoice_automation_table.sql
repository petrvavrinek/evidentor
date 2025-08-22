CREATE TYPE "public"."recurrence_type" AS ENUM('monthly', 'weekly', 'daily');--> statement-breakpoint
CREATE TABLE "invoice_automation_rule_project_tasks" (
	"rule_id" integer NOT NULL,
	"project_task_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_automation_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"project_id" integer NOT NULL,
	"all_tasks" boolean NOT NULL,
	"recurrence_type" "recurrence_type" NOT NULL,
	"interval" integer DEFAULT 1 NOT NULL,
	"day_of_month" integer,
	"language" "language" NOT NULL,
	"due_days" integer DEFAULT 30 NOT NULL,
	"currency" "currency" NOT NULL,
	"next_run_date" timestamp NOT NULL,
	"last_run_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "due_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_automation_rule_project_tasks" ADD CONSTRAINT "invoice_automation_rule_project_tasks_rule_id_invoice_automation_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."invoice_automation_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_automation_rule_project_tasks" ADD CONSTRAINT "invoice_automation_rule_project_tasks_project_task_id_project_task_id_fk" FOREIGN KEY ("project_task_id") REFERENCES "public"."project_task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ADD CONSTRAINT "invoice_automation_rules_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ADD CONSTRAINT "invoice_automation_rules_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
