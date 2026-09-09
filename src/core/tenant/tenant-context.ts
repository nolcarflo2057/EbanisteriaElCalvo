import { AsyncLocalStorage } from "node:async_hooks";

export interface TenantContextData {
	tenantId: string;
	customDomain?: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantContextData>();

export const getTenantContext = (): TenantContextData | undefined => {
	return tenantStorage.getStore();
};

export const getTenantId = (): string | undefined => {
	return tenantStorage.getStore()?.tenantId;
};

export const requireTenantContext = (): TenantContextData => {
	const context = getTenantContext();
	if (!context) {
		throw new Error("Se requiere un contexto de tenant (tenantId) para esta operación, pero no se encontró ninguno.");
	}
	return context;
};

/**
 * Ejecuta una función dentro del contexto de un tenant específico.
 */
export function withTenant<T>(tenantData: TenantContextData, fn: () => T): T {
	return tenantStorage.run(tenantData, fn);
}
