"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TenantThemeConfig } from "./tenant-theme.types";
import { DEFAULT_THEME_CONFIG } from "./tenant-theme.types";

const TenantThemeContext = createContext<TenantThemeConfig | null>(null);

export function TenantThemeProvider({
	children,
	config,
}: {
	children: ReactNode;
	config: TenantThemeConfig;
}) {
	return (
		<TenantThemeContext.Provider value={config}>
			{children}
		</TenantThemeContext.Provider>
	);
}

/**
 * Read theme config from context (static/mock mode) or return null (live mode).
 * Used by useTenantTheme to avoid API calls in static renders.
 */
export function useTenantThemeContext(): TenantThemeConfig | null {
	return useContext(TenantThemeContext);
}
