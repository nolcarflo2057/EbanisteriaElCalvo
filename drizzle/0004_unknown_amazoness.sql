ALTER TABLE "white_label_config" ADD COLUMN "chatbot_prompt" text;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "chatbot_model" text;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "chatbot_temperature" varchar(5);--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "chatbot_greeting" text;