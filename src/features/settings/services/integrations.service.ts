import { db } from "@/db";
import { tenantIntegrations } from "@/db/schema/core";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export interface TenantIntegrations {
	ga4Enabled: boolean;
	ga4MeasurementId: string | null;
	metaPixelEnabled: boolean;
	metaPixelId: string | null;
	gtmEnabled: boolean;
	gtmContainerId: string | null;
}

const DEFAULTS: TenantIntegrations = {
	ga4Enabled: false,
	ga4MeasurementId: null,
	metaPixelEnabled: false,
	metaPixelId: null,
	gtmEnabled: false,
	gtmContainerId: null,
};

async function fetchIntegrationsInternal(tenantId: string): Promise<TenantIntegrations> {
	const [result] = await db
		.select({
			ga4Enabled: tenantIntegrations.ga4Enabled,
			ga4MeasurementId: tenantIntegrations.ga4MeasurementId,
			metaPixelEnabled: tenantIntegrations.metaPixelEnabled,
			metaPixelId: tenantIntegrations.metaPixelId,
			gtmEnabled: tenantIntegrations.gtmEnabled,
			gtmContainerId: tenantIntegrations.gtmContainerId,
		})
		.from(tenantIntegrations)
		.where(eq(tenantIntegrations.tenantId, tenantId))
		.limit(1);

	if (!result) return DEFAULTS;

	return {
		ga4Enabled: result.ga4Enabled ?? false,
		ga4MeasurementId: result.ga4MeasurementId ?? null,
		metaPixelEnabled: result.metaPixelEnabled ?? false,
		metaPixelId: result.metaPixelId ?? null,
		gtmEnabled: result.gtmEnabled ?? false,
		gtmContainerId: result.gtmContainerId ?? null,
	};
}

export async function getTenantIntegrations(tenantId: string): Promise<TenantIntegrations> {
	const cachedFetcher = unstable_cache(
		async (id: string) => fetchIntegrationsInternal(id),
		[`tenant-integrations:${tenantId}`],
		{
			tags: [`tenant-integrations:${tenantId}`, `tenant:${tenantId}`],
			revalidate: 60,
		}
	);

	return cachedFetcher(tenantId);
}

export async function upsertTenantIntegrations(tenantId: string, data: TenantIntegrations): Promise<void> {
	await db
		.insert(tenantIntegrations)
		.values({
			tenantId,
			...data,
		})
		.onConflictDoUpdate({
			target: tenantIntegrations.tenantId,
			set: {
				...data,
				updatedAt: new Date(),
			},
		});
}
