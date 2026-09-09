import { pgTable, text, timestamp, uuid, boolean, jsonb, index, unique, numeric, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { VerticalLanding } from "@/features/landing/types/landing.types";
import type { TenantThemeConfig } from "@/core/tenant/tenant-theme.types";
import { users } from "./auth";

export type BlockSchema = Record<string, unknown>;

export interface AttributeDefinition {
	key: string;
	name: string;
	type: "select" | "multiselect" | "text" | "number" | "boolean" | "checkbox" | "color";
	allowedValues?: string[];
	isGlobal?: boolean;
	required?: boolean;
	defaultValue?: unknown;
}

export interface CatalogCategoryTree {
	name: string;
	slug: string;
	attributes?: AttributeDefinition[];
	children?: CatalogCategoryTree[];
}

export const tenants = pgTable("tenants", {
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		customDomain: text("custom_domain").unique(),
		description: text("description"),
		logo: text("logo"),
		settings: jsonb("settings").$type<{
			currency?: string;
			locale?: string;
			theme?: Record<string, string>;
			paymentGateways?: string[];
			emailConfig?: Record<string, any>;
			sellerModules?: string[];
			seo?: {
				title?: string;
				description?: string;
				keywords?: string;
				canonicalUrl?: string;
				robots?: "index,follow" | "noindex,follow" | "index,nofollow" | "noindex,nofollow";
				jsonLd?: string;
			};
			social?: {
				ogTitle?: string;
				ogDescription?: string;
				ogImage?: string;
				twitterCard?: "summary" | "summary_large_image";
			};
			tracking?: {
				googleAdsId?: string;
				facebookPixelId?: string;
				gtmId?: string;
			};
			legales?: {
				privacyMarkdown?: string;
				termsMarkdown?: string;
				legalNoticeMarkdown?: string;
			};
		}>().default({ sellerModules: [] }),
		active: boolean("active").default(true).notNull(),
		blockSchemas: jsonb("block_schemas").$type<BlockSchema[]>().default([]),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	});

export const tenantMembers = pgTable(
	"tenant_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		tenantId: uuid("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: text("role").default("member").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("tenant_members_tenantId_idx").on(table.tenantId),
		index("tenant_members_userId_idx").on(table.userId),
	]
);

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		tenantId: uuid("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		description: text("description"),
		imageUrl: text("image_url"),
		parentId: uuid("parent_id"),
		attributes: jsonb("attributes").$type<AttributeDefinition[]>().default([]),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("categories_tenantId_idx").on(table.tenantId),
		unique("categories_tenantId_slug_unique").on(table.tenantId, table.slug),
	]
);

export const tenantSettings = pgTable("tenant_settings", {
	tenantId: uuid("tenant_id")
		.primaryKey()
		.references(() => tenants.id, { onDelete: "cascade" }),
	currency: text("currency").default("USD").notNull(),
	locale: text("locale").default("en-US").notNull(),
	timezone: text("timezone").default("UTC").notNull(),
	taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0.00").notNull(),
	shippingCost: integer("shipping_cost").default(0).notNull(),
	contactEmail: text("contact_email"),
	contactPhone: text("contact_phone"),
});

export const tenantAppearance = pgTable("tenant_appearance", {
	tenantId: uuid("tenant_id")
		.primaryKey()
		.references(() => tenants.id, { onDelete: "cascade" }),
	logoUrl: text("logo_url"),
	logoDarkUrl: text("logo_dark_url"),
	faviconUrl: text("favicon_url"),
	primaryColor: text("primary_color").default("#F97316").notNull(),
	secondaryColor: text("secondary_color").default("#F4F4F5").notNull(),
	accentColor: text("accent_color").default("#EA580C").notNull(),
	borderRadius: text("border_radius").default("0.375rem").notNull(),
	shadowStyle: text("shadow_style").default("shadow-xs").notNull(),
	fontSettings: jsonb("font_settings").$type<{
		sans?: string;
		serif?: string;
		mono?: string;
	}>().default({}),
	themeConfig: jsonb("theme_config").$type<TenantThemeConfig>().default({
		buttonStyle: "rounded",
		navbarStyle: "glass",
		widgetShape: "circle",
		colorScheme: {
			primary: "#F97316",
			secondary: "#F4F4F5",
			accent: "#EA580C",
		},
	}),
});

export const tenantVerticals = pgTable("tenant_verticals", {
		id: uuid("id").primaryKey().defaultRandom(),
		tenantId: uuid("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "cascade" }),
		verticalKey: text("vertical_key").notNull(),
		name: text("name").notNull(),
		categoryTree: jsonb("category_tree").$type<CatalogCategoryTree[]>().notNull(),
		landing: jsonb("landing").$type<VerticalLanding | null>().default(null),
		isActive: boolean("is_active").default(true).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	}, (table) => [
		unique("tenant_verticals_tenantId_key_unique").on(table.tenantId, table.verticalKey),
	]);

export const tenantPageBlocks = pgTable(
	"tenant_page_blocks",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		tenantId: uuid("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "cascade" }),
		pageKey: text("page_key").notNull().default("home"),
		blockType: text("block_type").notNull(),
		label: text("label"),
		props: jsonb("props").$type<Record<string, unknown>>().notNull().default({}),
		visible: boolean("visible").default(true).notNull(),
		order: integer("order").notNull().default(0),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("tenant_page_blocks_tenantId_pageKey_idx").on(table.tenantId, table.pageKey),
	]
);

export const tenantIntegrations = pgTable("tenant_integrations", {
	tenantId: uuid("tenant_id")
		.primaryKey()
		.references(() => tenants.id, { onDelete: "cascade" }),
	ga4Enabled: boolean("ga4_enabled").default(false).notNull(),
	ga4MeasurementId: text("ga4_measurement_id"),
	metaPixelEnabled: boolean("meta_pixel_enabled").default(false).notNull(),
	metaPixelId: text("meta_pixel_id"),
	gtmEnabled: boolean("gtm_enabled").default(false).notNull(),
	gtmContainerId: text("gtm_container_id"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const leads = pgTable(
	"leads",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		tenantId: uuid("tenant_id")
			.notNull()
			.references(() => tenants.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		email: text("email"),
		phone: text("phone"),
		message: text("message").notNull(),
		status: text("status").default("new").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("leads_tenantId_idx").on(table.tenantId),
	]
);

export const appointments = pgTable("appointments", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenant_id")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	customerName: text("customer_name").notNull(),
	customerEmail: text("customer_email"),
	customerPhone: text("customer_phone"),
	date: timestamp("date").notNull(),
	timeSlot: text("time_slot").notNull(),
	status: text("status").default("pending").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
}, (table) => [
	index("appointments_tenantId_idx").on(table.tenantId),
]);

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
	members: many(tenantMembers),
	categories: many(categories),
	settings: one(tenantSettings),
	appearance: one(tenantAppearance),
	verticals: many(tenantVerticals),
	pageBlocks: many(tenantPageBlocks),
	integrations: one(tenantIntegrations),
	leads: many(leads),
	appointments: many(appointments),
}));

export const tenantMembersRelations = relations(tenantMembers, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tenantMembers.tenantId],
		references: [tenants.id],
	}),
	user: one(users, {
		fields: [tenantMembers.userId],
		references: [users.id],
	}),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	tenant: one(tenants, {
		fields: [categories.tenantId],
		references: [tenants.id],
	}),
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
	}),
}));

export const tenantSettingsRelations = relations(tenantSettings, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tenantSettings.tenantId],
		references: [tenants.id],
	}),
}));

export const tenantAppearanceRelations = relations(tenantAppearance, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tenantAppearance.tenantId],
		references: [tenants.id],
	}),
}));

export const tenantVerticalsRelations = relations(tenantVerticals, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tenantVerticals.tenantId],
		references: [tenants.id],
	}),
}));

export const tenantPageBlocksRelations = relations(tenantPageBlocks, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tenantPageBlocks.tenantId],
		references: [tenants.id],
	}),
}));

export const tenantIntegrationsRelations = relations(tenantIntegrations, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tenantIntegrations.tenantId],
		references: [tenants.id],
	}),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
	tenant: one(tenants, {
		fields: [leads.tenantId],
		references: [tenants.id],
	}),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
	tenant: one(tenants, {
		fields: [appointments.tenantId],
		references: [tenants.id],
	}),
}));