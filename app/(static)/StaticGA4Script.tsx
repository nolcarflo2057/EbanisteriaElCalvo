"use client";

import Script from "next/script";

const GA4_MEASUREMENT_ID = "G-NGNN9QHY2T";

/**
 * Inyecta Google Analytics 4 en la landing estática.
 * Carga siempre para contar visitas (pageviews), sin depender del consentimiento de cookies.
 */
export function StaticGA4Script() {
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
