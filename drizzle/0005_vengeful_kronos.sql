CREATE TABLE "cms_menus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "white_label_config" ADD COLUMN "chatbot_mode" text DEFAULT 'advanced' NOT NULL;--> statement-breakpoint
ALTER TABLE "cms_menus" ADD CONSTRAINT "cms_menus_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cms_menus_tenantId_idx" ON "cms_menus" USING btree ("tenant_id");