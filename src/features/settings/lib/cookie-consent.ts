import { cookies } from "next/headers";
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_ACCEPTED } from "@/features/settings/components/CookieConsentBanner";

/**
 * Lee la decisión de consentimiento de cookies del lado del servidor.
 * Solo si el usuario aceptó se habilitan los scripts de tracking/analytics.
 */
export async function hasCookieConsent(): Promise<boolean> {
	try {
		const store = await cookies();
		return store.get(COOKIE_CONSENT_KEY)?.value === COOKIE_CONSENT_ACCEPTED;
	} catch {
		// Sin cookies disponibles (build/prerender) → no cargar scripts.
		return false;
	}
}
