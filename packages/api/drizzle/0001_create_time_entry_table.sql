CREATE TABLE "time_entry" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "time_entry_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"start_at" timestamp,
	"end_at" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "time_entry" ADD CONSTRAINT "time_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "timer_entry_user_idx" ON "time_entry" USING btree ("user_id");