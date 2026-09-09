ALTER TABLE "white_label_config" ADD COLUMN "ai_provider" text;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "ai_model" text;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "ai_system_prompt" text;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "ai_temperature" varchar(5);