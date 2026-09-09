CREATE TYPE "public"."chat_sender" AS ENUM('user', 'agent');--> statement-breakpoint
CREATE TABLE "white_label_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"slug" varchar(100) NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"hours" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"address" text NOT NULL,
	"extra_info" text,
	"logo" text,
	"primary_color" varchar(7),
	"secondary_color" varchar(7),
	"font_family" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "white_label_config_tenant_id_unique" UNIQUE("tenant_id"),
	CONSTRAINT "white_label_config_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sender" "chat_sender" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "white_label_config" ADD CONSTRAINT "white_label_config_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;