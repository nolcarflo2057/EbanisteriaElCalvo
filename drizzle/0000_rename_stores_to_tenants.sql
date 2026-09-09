CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"active_tenant_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"uploaded_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text,
	"customer_phone" text,
	"date" timestamp NOT NULL,
	"time_slot" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image_url" text,
	"parent_id" uuid,
	"attributes" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_tenantId_slug_unique" UNIQUE("tenant_id","slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_appearance" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"logo_url" text,
	"logo_dark_url" text,
	"favicon_url" text,
	"primary_color" text DEFAULT '#F97316' NOT NULL,
	"secondary_color" text DEFAULT '#F4F4F5' NOT NULL,
	"accent_color" text DEFAULT '#EA580C' NOT NULL,
	"border_radius" text DEFAULT '0.375rem' NOT NULL,
	"shadow_style" text DEFAULT 'shadow-xs' NOT NULL,
	"font_settings" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "tenant_integrations" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"ga4_enabled" boolean DEFAULT false NOT NULL,
	"ga4_measurement_id" text,
	"meta_pixel_enabled" boolean DEFAULT false NOT NULL,
	"meta_pixel_id" text,
	"gtm_enabled" boolean DEFAULT false NOT NULL,
	"gtm_container_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_page_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"page_key" text DEFAULT 'home' NOT NULL,
	"block_type" text NOT NULL,
	"label" text,
	"props" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_settings" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"locale" text DEFAULT 'en-US' NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"tax_rate" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"shipping_cost" integer DEFAULT 0 NOT NULL,
	"contact_email" text,
	"contact_phone" text
);
--> statement-breakpoint
CREATE TABLE "tenant_verticals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"vertical_key" text NOT NULL,
	"name" text NOT NULL,
	"category_tree" jsonb NOT NULL,
	"landing" jsonb DEFAULT 'null'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_verticals_tenantId_key_unique" UNIQUE("tenant_id","vertical_key")
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"custom_domain" text,
	"description" text,
	"logo" text,
	"settings" jsonb DEFAULT '{"sellerModules":[]}'::jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"block_schemas" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE ("slug"),
	CONSTRAINT "tenants_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
CREATE TABLE "global_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'text' NOT NULL,
	"allowed_values" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_appearance" ADD CONSTRAINT "tenant_appearance_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_integrations" ADD CONSTRAINT "tenant_integrations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_members" ADD CONSTRAINT "tenant_members_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_members" ADD CONSTRAINT "tenant_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_page_blocks" ADD CONSTRAINT "tenant_page_blocks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_verticals" ADD CONSTRAINT "tenant_verticals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "global_attributes" ADD CONSTRAINT "global_attributes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "appointments_tenantId_idx" ON "appointments" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "categories_tenantId_idx" ON "categories" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "leads_tenantId_idx" ON "leads" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_members_tenantId_idx" ON "tenant_members" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_members_userId_idx" ON "tenant_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tenant_page_blocks_tenantId_pageKey_idx" ON "tenant_page_blocks" USING btree ("tenant_id","page_key");--> statement-breakpoint
CREATE INDEX "global_attributes_tenantId_idx" ON "global_attributes" USING btree ("tenant_id");