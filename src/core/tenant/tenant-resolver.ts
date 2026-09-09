import { db } from "@/db";
import { tenants } from "@/db/schema/core";
import { eq, and } from "drizzle-orm";

const cache = new Map<string, CacheEntry>();
const TTL_MS = 60_000;

interface CacheEntry {
	tenantId: string;
	expiresAt: number;
}

function getCached(hostname: string): string | undefined {
	const entry = cache.get(hostname) as CacheEntry | undefined;
	if (!entry) return undefined;
	if (Date.now() > entry.expiresAt) {
		cache.delete(hostname);
		return undefined;
	}
	return entry.tenantId;
}

function setCache(hostname: string, tenantId: string) {
	cache.set(hostname, { tenantId, expiresAt: Date.now() + TTL_MS });
}

export async function resolveTenantIdFromHostname(hostname: string): Promise<string> {
	if (process.env.NEXT_PUBLIC_SINGLE_TENANT === "true" && process.env.NEXT_PUBLIC_TENANT_SLUG) {
		const singleTenant = await db
			.select({ id: tenants.id })
			.from(tenants)
			.where(eq(tenants.slug, process.env.NEXT_PUBLIC_TENANT_SLUG))
			.limit(1);
		if (singleTenant.length > 0) {
			return singleTenant[0].id;
		}
	}

	const cached = getCached(hostname);
	if (cached) return cached;

	const trimmed = hostname.split(":")[0];

	const byDomain = await db
		.select({ id: tenants.id })
		.from(tenants)
		.where(and(eq(tenants.customDomain, trimmed), eq(tenants.active, true)))
		.limit(1);

	if (byDomain.length > 0) {
		setCache(hostname, byDomain[0].id);
		return byDomain[0].id;
	}

	const subdomain = trimmed.split(".")[0];
	const bySlug = await db
		.select({ id: tenants.id })
		.from(tenants)
		.where(and(eq(tenants.slug, subdomain), eq(tenants.active, true)))
		.limit(1);

	if (bySlug.length > 0) {
		setCache(hostname, bySlug[0].id);
		return bySlug[0].id;
	}

	const first = await db
		.select({ id: tenants.id })
		.from(tenants)
		.where(eq(tenants.active, true))
		.limit(1);

	const fallback = first.length > 0 ? first[0].id : "00000000-0000-0000-0000-000000000000";
	setCache(hostname, fallback);
	return fallback;
}

/**
 * Obtiene el slug de un tenant por su id (usado server-side para los widgets públicos).
 */
export async function getTenantSlugById(tenantId: string): Promise<string | null> {
	if (!tenantId || tenantId === "00000000-0000-0000-0000-000000000000") return null;
	const row = await db
		.select({ slug: tenants.slug })
		.from(tenants)
		.where(eq(tenants.id, tenantId))
		.limit(1);
	return row[0]?.slug ?? null;
}
