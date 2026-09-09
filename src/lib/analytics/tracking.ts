"use client";

import { useEffect, useState } from "react";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { SettingsService } from "@/features/settings/services/settings.service";

declare global {
	interface Window {
		dataLayer: any[];
		fbAsyncInit: () => void;
	}
	const FB: any;
}

/**
 * Hook para inyectar scripts de analíticas condicionalmente por tenant.
 * Solo se ejecuta en el navegador (client-side).
 * 
 * Returns true cuando los scripts han sido inyectados o el tenant no tiene tracking configurado.
 */
export function useTenantTracking(): boolean {
	const [injected, setInjected] = useState(false);

	useEffect(() => {
		// Solo en el cliente
		if (typeof window === "undefined") return;

		// Obtener ID del tenant desde headers (funciona en app router)
		const init = async () => {
			try {
				const tenantId = await getTenantIdFromHeaders();
				if (!tenantId) {
					setInjected(true);
					return;
				}

				// Obtener configuración de tracking del tenant
				const tracking = await SettingsService.getTracking(tenantId);

				// Inyectar GA4 si está configurado
				if (tracking?.googleAdsId) {
					injectScript(
						`https://www.googletagmanager.com/gtag/js?id=${tracking.googleAdsId}`,
						"ga4"
					);
					window.dataLayer = window.dataLayer || [];
					function gtag(...args: any[]) {
						window.dataLayer.push(args);
					}
					gtag("js", new Date());
					gtag("config", tracking.googleAdsId);
				}

				// Inyectar Meta Pixel si está configurado
				if (tracking?.facebookPixelId) {
					injectScript(
						`https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v15.0&appId=${tracking.facebookPixelId}`,
						"meta-pixel"
					);
					// Inicializar FB después de cargar
					window.fbAsyncInit = function () {
						FB.init({
							appId: tracking.facebookPixelId,
							autoLogAppEvents: true,
							xfbml: true,
							version: "v15.0",
						});
					};
				}

				setInjected(true);
			} catch (error) {
				console.error("Error injecting tenant tracking:", error);
				setInjected(true);
			}
		};

		init();
	}, []);

	return injected;
}

/**
 * Helper para inyectar un script en el head condicionalmente
 */
function injectScript(src: string, id: string) {
	// Si ya existe, no lo volvemos a inyectar
	if (document.getElementById(id)) return;

	const script = document.createElement("script");
	script.src = src;
	script.async = true;
	script.id = id;
	document.head.appendChild(script);
}