import { getTenantIntegrations } from "../../settings/services/integrations.service";
import { hasCookieConsent } from "../../settings/lib/cookie-consent";
import { safeId } from "../../../shared/utils/safeId";

interface Props {
	tenantId: string;
}



export async function AnalyticsInjector({ tenantId }: Props) {
	const consented = await hasCookieConsent();
	if (!consented) return null;

	const integrations = await getTenantIntegrations(tenantId);
	const gtmContainerId = safeId(integrations.gtmContainerId);
	const ga4MeasurementId = safeId(integrations.ga4MeasurementId);
	const metaPixelId = safeId(integrations.metaPixelId);

	return (
		<>
			{/* Google Tag Manager */}
			{integrations.gtmEnabled && gtmContainerId && (
				// eslint-disable-next-line @next/next/next-script-for-ga -- IDs dinámicos por tienda (multi-tenant); @next/third-parties no aplica
				<script
					dangerouslySetInnerHTML={{
						__html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmContainerId}');
`,
					}}
				/>
			)}

			{/* Google Analytics 4 */}
			{integrations.ga4Enabled && ga4MeasurementId && (
				<>
					<script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga4MeasurementId}');
`,
						}}
					/>
				</>
			)}

			{/* Meta Pixel */}
			{integrations.metaPixelEnabled && metaPixelId && (
				<script
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
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');
`,
					}}
				/>
			)}
		</>
	);
}

export function AnalyticsNoscript({ tenantId }: Props) {
	return <noscript data-analytics-tenant={tenantId} />;
}


