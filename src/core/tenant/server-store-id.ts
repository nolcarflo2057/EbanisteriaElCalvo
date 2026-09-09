import { headers } from "next/headers";
import { resolveTenantIdFromHostname } from "@/core/tenant/tenant-resolver";

/**
 * Resuelve el tenantId desde los headers de la request actual (Server Actions, API Routes).
 * Útil cuando no hay acceso al tenant context (AsyncLocalStorage) porque la request
 * no pasó por el root layout (ej. Server Actions, API routes).
 */
export async function getTenantIdFromHeaders(): Promise<string> {
	const headersList = await headers();
	const host = headersList.get("host") || "";
	return resolveTenantIdFromHostname(host);
}

/**
 * Versión sincrónica del storeId desde el tenant context (AsyncLocalStorage).
 * Solo funciona dentro de Server Components que están envueltos por el root layout.
 * Para Server Actions / API Routes, usar getStoreIdFromHeaders().
 */
export { getTenantContext, requireTenantContext, withTenant } from "@/core/tenant/tenant-context";