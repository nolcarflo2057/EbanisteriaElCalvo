import Script from "next/script";
import { SettingsService } from "../../settings/services/settings.service";
import { hasCookieConsent } from "../../settings/lib/cookie-consent";
import { safeId } from "../../../shared/utils/safeId";

interface Props {
	tenantId: string;
}



/**
 * Inyecta los scripts de conversión (Google Ads) y tracking (Meta Pixel, GTM)
 * configurados en stores.settings.tracking. Es un Server Component: lee la
 * configuración del tenant y renderiza <Script> de next/script.
 *
 * Nota: GA4 se gestiona por separado en AnalyticsInjector (tabla store_integrations).
 */
export async function TrackingScripts({ tenantId }: Props) {
	const consented = await hasCookieConsent();
	if (!consented) return null;

	const tracking = await SettingsService.getTracking(tenantId);
	if (!tracking) return null;

	const googleAdsId = safeId(tracking.googleAdsId);
	const facebookPixelId = safeId(tracking.facebookPixelId);
	const gtmId = safeId(tracking.gtmId);

	const hasAny = googleAdsId || facebookPixelId || gtmId;
	if (!hasAny) return null;

	return (
		<>
			{/* Google Ads (conversión) */}
			{googleAdsId && (
				<>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
						strategy="afterInteractive"
					/>
					<Script
						id="google-ads-init"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsId}');
`,
						}}
					/>
				</>
			)}

			{/* Meta Pixel */}
			{facebookPixelId && (
				<Script
					id="meta-pixel"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${facebookPixelId}');
fbq('track', 'PageView');
`,
					}}
				/>
			)}

			{/* Google Tag Manager */}
			{gtmId && (
				<>
					<Script
						id="gtm"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');
`,
						}}
					/>
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
							height="0"
							width="0"
							style={{ display: "none", visibility: "hidden" }}
						/>
					</noscript>
				</>
			)}
		</>
	);
}


