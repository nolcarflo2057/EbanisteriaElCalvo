ALTER TABLE "white_label_config" ADD COLUMN "whatsapp_number" text;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "whatsapp_message" text;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "show_whatsapp" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "show_chatbot" boolean DEFAULT true NOT NULL;