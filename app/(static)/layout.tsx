import type { Metadata } from "next";
import { BRAND } from "@/features/blocks/templates/mock-ebanisteria";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: {
		default: BRAND,
		template: `%s | ${BRAND}`,
	},
	description: "Restauración de muebles, ebanistería y fabricación de cocinas integrales y clósets a medida en Pereira, Risaralda.",
	keywords: ["restauración de muebles Pereira", "ebanistería Pereira Risaralda", "cocinas integrales a medida Pereira", "clósets a medida Pereira", "reparación de muebles Cuba Pereira", "carpintería"],
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "es_CO",
		url: "/",
		title: BRAND,
		description: "Restauración de muebles, ebanistería y fabricación de cocinas integrales a medida en Pereira.",
		siteName: BRAND,
		images: [
			{
				url: `/api/og?title=${encodeURIComponent(BRAND)}&subtitle=${encodeURIComponent("Restauración y Ebanistería en Pereira")}`,
				width: 1200,
				height: 630,
				alt: `${BRAND} - Restauración de Muebles`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: BRAND,
		description: "Restauración de muebles y ebanistería en Pereira.",
		images: [`/api/og?title=${encodeURIComponent(BRAND)}&subtitle=${encodeURIComponent("Restauración y Ebanistería en Pereira")}`],
	},
};

export default function StaticLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `
:root {
	--primary: #B45309;
	--on-primary: #ffffff;
	--primary-container: #5d4037;
	--on-primary-container: #ffddc8;
	--secondary: #7e5700;
	--on-secondary: #ffffff;
	--secondary-container: #feb300;
	--on-secondary-container: #271900;
	--accent: #EA580C;
	--background: #fbf9f5;
	--on-background: #1c1b18;
	--surface: #fbf9f5;
	--on-surface: #1c1b18;
	--surface-variant: #eee1d0;
	--on-surface-variant: #4d4639;
	--surface-dim: #ddd9d0;
	--surface-bright: #fbf9f5;
	--surface-container-lowest: #ffffff;
	--surface-container-low: #f8f3eb;
	--surface-container: #f2ede5;
	--surface-container-high: #ece8df;
	--surface-container-highest: #e6e2da;
	--outline: #7e7667;
	--outline-variant: #d0c5b4;
	--destructive: #dc2626;
	--ring: #B45309;
	--radius: 0.375rem;
	--shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	--font-sans: var(--font-outfit), var(--font-inter), system-ui, sans-serif;
	--font-serif: "Domine", "Georgia", serif;
	--font-mono: ui-monospace, monospace;
}
					`,
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "LocalBusiness",
						"name": BRAND,
						"image": siteConfig.defaultOgImage,
						"@id": "",
						"url": "https://ebanisteria-el-calvo.com",
						"telephone": "+573127609748",
						"address": {
							"@type": "PostalAddress",
							"streetAddress": "Manzana D Casa 142 esquina, Barrio Atenas - Sector Perla del Sur",
							"addressLocality": "Pereira",
							"addressRegion": "Risaralda",
							"addressCountry": "CO"
						},
						"geo": {
							"@type": "GeoCoordinates",
							"latitude": 4.7963364,
							"longitude": -75.7275094
						},
						"openingHoursSpecification": {
							"@type": "OpeningHoursSpecification",
							"dayOfWeek": [
								"Monday",
								"Tuesday",
								"Wednesday",
								"Thursday",
								"Friday"
							],
							"opens": "08:00",
							"closes": "18:00"
						},
						"sameAs": []
					}),
				}}
			/>
			{children}
		</>
	);
}


