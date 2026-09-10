import "dotenv/config";
import { db } from "./index";
import { users } from "./schema/auth";
import { tenants, categories, tenantSettings, tenantAppearance, tenantVerticals, tenantPageBlocks, tenantMembers } from "./schema/core";
import { whiteLabelConfig } from "./schema/white_label_config";
import { globalAttributes } from "./schema/global-attributes";
import { auth } from "@/lib/auth/auth";
import { eq, and, sql } from "drizzle-orm";
import { defaultLanding } from "@/features/landing/constants/mock-cms";
import { buildNicheLandingBlocks } from "@/features/blocks/templates/niche-landing";
import type { CatalogCategory } from "@/config/catalog/categories.config";
import type { VerticalLanding } from "@/features/landing/types/landing.types";
import type { CatalogCategoryTree } from "@/db/schema/core";
import fs from "fs";
import path from "path";

interface SeedStoreConfig {
	name: string;
	slug: string;
	currency: string;
	locale: string;
	taxRate: number;
	shippingCost: number;
	niche?: string;
	department?: string;
	address?: string;
	mapEmbedUrl?: string;
	directionsUrl?: string;
	appearance?: {
		primaryColor?: string;
		secondaryColor?: string;
		accentColor?: string;
		borderRadius?: string;
		shadowStyle?: string;
	};
}

interface SeedFileConfig {
  store?: SeedStoreConfig;
  categories?: CatalogCategory[];
  /** Optional array of global attribute definitions */
  globalAttributes?: GlobalAttributeConfig[];
  /** Optional vertical configuration */
  vertical?: {
    /** Name of the vertical (e.g., "hardware") */
    name?: string;
    /** Landing page configuration, defaults to defaultLanding if omitted */
    landing?: VerticalLanding;
  };
}

/** Definition for a global attribute that can be seeded */
interface GlobalAttributeConfig {
  key: string;
  name: string;
  type: string; // e.g., "select", "multiselect", "text" etc.
  allowedValues?: string[];
}

function loadSeedConfig(): SeedFileConfig | null {
	try {
		const configPath = path.resolve(process.cwd(), "seed.config.json");
		if (!fs.existsSync(configPath)) return null;
		const raw = fs.readFileSync(configPath, "utf-8");
		return JSON.parse(raw) as SeedFileConfig;
	} catch (error) {
		console.warn("⚠️ seed.config.json no pudo cargarse, usando configuración por defecto:", error);
		return null;
	}
}

let categoryCount = 0;

async function syncCategoriesFromTree(
	tenantId: string,
	cats: CatalogCategory[],
	parentId?: string | null,
): Promise<void> {
	for (const cat of cats) {
		// Ensure allowedValues is always an array for AttributeDefinition compatibility
		const attributes = (cat.attributes ?? []).map((attr) => ({
			...attr,
			allowedValues: attr.allowedValues ?? [],
		}));

		const [row] = await db
			.insert(categories)
			.values({
				tenantId,
				name: cat.name,
				slug: cat.slug,
				parentId: parentId ?? null,
				attributes,
			})
			.onConflictDoUpdate({
				target: [categories.tenantId, categories.slug],
				set: {
					name: cat.name,
					parentId: parentId ?? null,
					attributes,
				},
			})
			.returning();

		const id = row?.id;

		if (id) {
			categoryCount++;
			if (cat.children?.length) {
				await syncCategoriesFromTree(tenantId, cat.children, id);
			}
		}
	}
}

async function seed() {
	console.log("🌱 Starting database seeding...");

	try {
		// Testing / client-onboarding mode: wipe the public schema clean so no
		// pre-existing (possibly corrupt or leftover) data bleeds into the new store.
		// "Eliminar nodo lo que tenga la base de datos" before seeding structure.
		console.log("Clearing existing data before seed...");
		await resetPublicSchema();
		console.log("Database cleared.");

		const seedConfig = loadSeedConfig();
		const storeConfig = seedConfig?.store;
		// Testing / new-client branch: do NOT default to a specific vertical
		// (e.g. ropa). If no seed.config.json is provided, the category tree is
		// left empty so the store starts generic and is populated only once the
		// real client seed.config.json is injected.
		const treeConfig: CatalogCategory[] = seedConfig?.categories?.length
			? seedConfig.categories
			: [];

		// 1. Create admin user
		const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@admin.com";
		const adminPassword = process.env.SEED_ADMIN_PASSWORD || "12345678";

		const existingUser = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

		let userId: string;

		if (existingUser.length === 0) {
			console.log("Creating admin user...");
			const response = await auth.api.signUpEmail({
				body: {
					email: adminEmail,
					password: adminPassword,
					name: "Administrator",
				},
			});
			if (response && response.user) {
				userId = response.user.id;
			} else {
				throw new Error("Could not create admin user");
			}
		} else {
			console.log("Admin user already exists.");
			userId = existingUser[0].id;
		}

		// 2. Assign admin role
		console.log("Assigning admin role...");
		await db.update(users).set({ role: "admin", emailVerified: true }).where(eq(users.email, adminEmail));

		// 3. Create or reuse default tenant (idempotent)
		console.log("Creating default tenant...");

		const existingTenants = await db.select().from(tenants).limit(1);
		let tenantId: string;

		if (existingTenants.length > 0) {
			tenantId = existingTenants[0].id;
			console.log(`Reusing existing tenant: ${existingTenants[0].name} (${existingTenants[0].slug})`);
		} else {
			const tenantName = storeConfig?.name || process.env.SEED_STORE_NAME || "My Store";
			const tenantSlug = storeConfig?.slug || process.env.SEED_STORE_SLUG || "my-store";
			const storeCurrency = storeConfig?.currency || "USD";
			const storeLocale = storeConfig?.locale || "en-US";

			const [tenant] = await db
				.insert(tenants)
				.values({
					name: tenantName,
					slug: tenantSlug,
					description: `Default ${tenantName} tenant`,
					settings: { currency: storeCurrency, locale: storeLocale, sellerModules: [] },
				})
				.returning();
			tenantId = tenant.id;
			console.log(`Created tenant: ${tenantName} (${tenantSlug})`);
		}

		// Seed tenant_settings and tenant_appearance
		console.log("Creating default settings and appearance configurations...");
		const storeCurrency = storeConfig?.currency || "USD";
		const storeLocale = storeConfig?.locale || "en-US";
		const storeTaxRate = String(storeConfig?.taxRate ?? 0);
		const storeShippingCost = storeConfig?.shippingCost ?? 0;

		await db
			.insert(tenantSettings)
			.values({
				tenantId,
				currency: storeCurrency,
				locale: storeLocale,
				timezone: "UTC",
				taxRate: storeTaxRate,
				shippingCost: storeShippingCost,
			})
			.onConflictDoUpdate({
				target: tenantSettings.tenantId,
				set: {
					currency: storeCurrency,
					locale: storeLocale,
					taxRate: storeTaxRate,
					shippingCost: storeShippingCost,
				},
			});

		await db
			.insert(tenantAppearance)
			.values({
				tenantId,
				primaryColor: storeConfig?.appearance?.primaryColor || "#F97316",
				secondaryColor: storeConfig?.appearance?.secondaryColor || "#F4F4F5",
				accentColor: storeConfig?.appearance?.accentColor || "#EA580C",
				borderRadius: storeConfig?.appearance?.borderRadius || "0.375rem",
				shadowStyle: storeConfig?.appearance?.shadowStyle || "shadow-xs",
			})
			.onConflictDoUpdate({
				target: tenantAppearance.tenantId,
				set: {
					primaryColor: storeConfig?.appearance?.primaryColor || "#F97316",
					secondaryColor: storeConfig?.appearance?.secondaryColor || "#F4F4F5",
					accentColor: storeConfig?.appearance?.accentColor || "#EA580C",
					borderRadius: storeConfig?.appearance?.borderRadius || "0.375rem",
					shadowStyle: storeConfig?.appearance?.shadowStyle || "shadow-xs",
				},
			});

		await db.update(users).set({ activeTenantId: tenantId }).where(eq(users.email, adminEmail));

		// Link admin as tenant member so lead notifications reach the owner.
		await db
			.insert(tenantMembers)
			.values({ tenantId, userId, role: "admin" })
			.onConflictDoNothing();

		// Seed whiteLabelConfig
		await db
			.insert(whiteLabelConfig)
			.values({
				tenantId,
				slug: storeConfig?.slug || "my-store",
				businessName: storeConfig?.name || "Ebanistería El Calvo",
				hours: "Lunes a Viernes: 9:00 - 18:00",
				phone: "+34 600 000 000",
				address: storeConfig?.address || "Ebanistería El Calvo, Pereira, Risaralda",
				extraInfo: "Maestría en Madera",
				whatsappNumber: "34600000000",
				whatsappMessage: "Hola, me interesaría solicitar un presupuesto o cotización para sus servicios.",
				showWhatsapp: true,
				showChatbot: true,
			})
			.onConflictDoUpdate({
				target: whiteLabelConfig.tenantId,
				set: {
					slug: storeConfig?.slug || "my-store",
					businessName: storeConfig?.name || "Ebanistería El Calvo",
					hours: "Lunes a Viernes: 9:00 - 18:00",
					phone: "+34 600 000 000",
					address: storeConfig?.address || "Ebanistería El Calvo, Pereira, Risaralda",
					extraInfo: "Maestría en Madera",
					whatsappNumber: "34600000000",
					whatsappMessage: "Hola, me interesaría solicitar un presupuesto o cotización para sus servicios.",
					showWhatsapp: true,
					showChatbot: true,
					updatedAt: new Date(),
				}
			});



		if (seedConfig?.vertical) {
			const verticalName = seedConfig.vertical.name || "Default";
			await db
				.insert(tenantVerticals)
				.values({
					tenantId,
					verticalKey: "default",
					name: verticalName,
					categoryTree: treeConfig as unknown as CatalogCategoryTree[],
					landing: seedConfig.vertical.landing ?? defaultLanding,
				})
            .onConflictDoUpdate({
              target: [tenantVerticals.tenantId, tenantVerticals.verticalKey],
              set: {
                name: verticalName,
                categoryTree: treeConfig as unknown as CatalogCategoryTree[],
                landing: seedConfig.vertical.landing ?? defaultLanding,
                updatedAt: new Date(),
              },
            });
          console.log("Vertical config saved.");
        } else {
          console.log("No vertical config provided; skipping tenant_verticals seeding.");
        }

		// 4a. Sync categories from vertical config (populates categories table)
		console.log("Syncing categories from vertical config...");
		categoryCount = 0;
		await syncCategoriesFromTree(tenantId, treeConfig);
		console.log(`Synced ${categoryCount} categories from vertical config.`);

		// 4b. Clean up obsolete categories
		console.log("Cleaning up obsolete categories...");
		const allDbCategories = await db
			.select()
			.from(categories)
			.where(eq(categories.tenantId, tenantId));

		// Get all slugs from config
		const configSlugs = new Set<string>();
		const traverseConfig = (items: CatalogCategory[]) => {
			for (const item of items) {
				configSlugs.add(item.slug);
				if (item.children) {
					traverseConfig(item.children);
				}
			}
		};
		traverseConfig(treeConfig);

		// Find obsolete categories
		const obsoleteCats = allDbCategories.filter((c) => !configSlugs.has(c.slug));

		if (obsoleteCats.length > 0) {
			console.log(`Found ${obsoleteCats.length} obsolete categories. Cleaning up...`);

			for (const obCat of obsoleteCats) {
				await db.delete(categories).where(eq(categories.id, obCat.id));
				console.log(`Deleted obsolete category: "${obCat.name}" (slug: "${obCat.slug}")`);
			}
		} else {
			console.log("No obsolete categories found.");
		}

		// 4c. Seed global attributes
		console.log("Seeding global attributes...");
		const globalDefs = seedConfig?.globalAttributes ?? [];
      for (const def of globalDefs) {
			const existing = await db
				.select()
				.from(globalAttributes)
				.where(and(eq(globalAttributes.tenantId, tenantId), eq(globalAttributes.key, def.key)))
				.limit(1);
			if (existing.length === 0) {
				await db.insert(globalAttributes).values({ tenantId, ...def });
				console.log(`  Created global attribute: ${def.name}`);
			}
		}



		

		// 6. Block seeding has been removed per user request.
		// The landing page now uses the static mock directly.


		console.log(`✅ Seeding process completed successfully.`);
	} catch (error) {
		console.error("❌ Error during seed:", error);
		process.exit(1);
	}
}

seed().then(() => process.exit(0));

// ─── Schema Reset ──────────────────────────────────────────────────────────

/**
 * Trunca todas las tablas de `public` (excepto las tablas de migración de Drizzle)
 * reiniciando identities y cascada para respetar FKs. Se usa en modo
 * testing / onboarding de nueva tienda para que la BD quede limpia antes de
 * sembrar la estructura. "Eliminar nodo lo que tenga la base de datos".
 */
async function resetPublicSchema(): Promise<void> {
	const res = await db.execute(sql`
		SELECT tablename
		FROM pg_tables
		WHERE schemaname = 'public'
		  AND tablename NOT LIKE '_drizzle%'
		  AND tablename != '__drizzle_migrations'
	`);
	const tables = (res.rows as Array<{ tablename: string }>).map((r) => `"${r.tablename}"`);
	if (tables.length === 0) return;
	await db.execute(
		sql.raw(`TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE`)
	);
}


