"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getCookieConsent, COOKIE_CONSENT_ACCEPTED } from "@/features/settings/components/CookieConsentBanner";

const GA4_MEASUREMENT_ID = "G-NGNN9QHY2T";

/**
 * Inyecta Google Analytics 4 en la landing estática.
 * Solo carga si el usuario aceptó las cookies.
 * Re-evalúa al montar (tras router.refresh() del banner de cookies).
 */
export function StaticGA4Script() {
	const [consented, setConsented] = useState(false);

	useEffect(() => {
		setConsented(getCookieConsent() === COOKIE_CONSENT_ACCEPTED);
	}, []);

	if (!consented) return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
				strategy="afterInteractive"
			/>
			<Script
				id="ga4-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_MEASUREMENT_ID}');
`,
				}}
			/>
		</>
	);
}
