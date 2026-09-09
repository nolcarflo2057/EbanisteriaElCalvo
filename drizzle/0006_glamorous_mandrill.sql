ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
DROP TABLE "notifications" CASCADE;--> statement-breakpoint
ALTER TABLE "white_label_config" ALTER COLUMN "show_whatsapp" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "white_label_config" ALTER COLUMN "show_chatbot" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "tenant_appearance" ADD COLUMN "theme_config" jsonb DEFAULT '{"buttonStyle":"rounded","navbarStyle":"glass","widgetShape":"circle","colorScheme":{"primary":"#F97316","secondary":"#F4F4F5","accent":"#EA580C"}}'::jsonb;--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "chatbot_tags" jsonb DEFAULT '[]'::jsonb;