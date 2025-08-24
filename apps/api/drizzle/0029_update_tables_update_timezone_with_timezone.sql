ALTER TABLE "invoice" ALTER COLUMN "due_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "sent_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "paid_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "issued_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "issued_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project_task" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project_task" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "calendar_event" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "calendar_event" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "calendar_event" ALTER COLUMN "start_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "calendar_event" ALTER COLUMN "end_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ALTER COLUMN "next_run_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ALTER COLUMN "last_run_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoice_automation_rules" ALTER COLUMN "created_at" SET DEFAULT now();