import type { Metadata } from "next";
import { BRAND } from "@/features/blocks/templates/mock-ebanisteria";

import { siteConfig } from "@/config/site";
import { StaticGA4Script } from "./StaticGA4Script";
import { CookieConsentBanner } from "@/features/settings/components/CookieConsentBanner";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ebanisteria-el-calvo.com";

const META_TITLE = "Ebanistería El Calvo | Restauración de Muebles, Cocinas Integrales y Clósets a Medida en Pereira";
const META_DESCRIPTION =
	"Taller de ebanistería en Pereira, Risaralda. Restauramos muebles antiguos, fabricamos cocinas integrales, clósets, puertas y muebles a medida. Más de 15 años de experiencia en el sector de Cuba. Presupuesto sin compromiso. ☎ 312 760 9748.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: META_TITLE,
		template: `%s | ${BRAND}`,
	},
	description: META_DESCRIPTION,
	keywords: [
		// — Servicios principales
		"restauración de muebles Pereira",
		"ebanistería Pereira",
		"cocinas integrales a medida Pereira",
		"clósets a medida Pereira",
		"carpintería Pereira",
		"muebles a medida Pereira",
		"puertas de madera Pereira",
		// — Long-tail geo
		"restauración de muebles antiguos Risaralda",
		"taller de ebanistería Cuba Pereira",
		"reparación de muebles de madera Pereira",
		"fabricación de cocinas integrales Risaralda",
		"muebles de cocina a medida Colombia",
		"closets empotrados Pereira",
		"armarios a medida Pereira Risaralda",
		"restaurar mueble antiguo Pereira",
		// — Intención transaccional
		"presupuesto cocina integral Pereira",
		"cotización muebles a medida Pereira",
		"ebanista cerca de mí Pereira",
		// — Servicios secundarios
		"tapicería de muebles Pereira",
		"pintura de muebles Pereira",
		"lacado de muebles Pereira",
		"reparación de puertas de madera Pereira",
		"muebles de baño a medida Pereira",
		"vestier a medida Pereira",
	],
	alternates: {
		canonical: SITE_URL,
	},
	category: "Ebanistería y Restauración de Muebles",
	other: {
		"geo.region": "CO-RIS",
		"geo.placename": "Pereira, Risaralda",
		"geo.position": "4.7963364;-75.7275094",
		"ICBM": "4.7963364, -75.7275094",
	},
	openGraph: {
		type: "website",
		locale: "es_CO",
		url: SITE_URL,
		title: META_TITLE,
		description: META_DESCRIPTION,
		siteName: BRAND,
		images: [
			{
				url: `/api/og?title=${encodeURIComponent(BRAND)}&subtitle=${encodeURIComponent("Restauración de Muebles y Ebanistería en Pereira, Risaralda")}`,
				width: 1200,
				height: 630,
				alt: `${BRAND} — Taller de ebanistería y restauración de muebles en Pereira`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: META_TITLE,
		description: META_DESCRIPTION,
		images: [`/api/og?title=${encodeURIComponent(BRAND)}&subtitle=${encodeURIComponent("Restauración de Muebles y Ebanistería en Pereira, Risaralda")}`],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
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
			{/* JSON-LD: LocalBusiness (principal) */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FurnitureStore",
						"@id": `${SITE_URL}/#business`,
						"name": BRAND,
						"alternateName": "Ebanistería El Calvo Pereira",
						"description": META_DESCRIPTION,
						"image": siteConfig.defaultOgImage,
						"logo": `${SITE_URL}/logo.png`,
						"url": SITE_URL,
						"telephone": "+573127609748",
						"email": "contacto@ebanisteria-el-calvo.com",
						"priceRange": "$$",
						"currenciesAccepted": "COP",
						"paymentAccepted": "Efectivo, Transferencia bancaria",
						"address": {
							"@type": "PostalAddress",
							"streetAddress": "Manzana D Casa 142 esquina, Barrio Atenas - Sector Perla del Sur",
							"addressLocality": "Pereira",
							"addressRegion": "Risaralda",
							"postalCode": "660006",
							"addressCountry": "CO"
						},
						"geo": {
							"@type": "GeoCoordinates",
							"latitude": 4.7963364,
							"longitude": -75.7275094
						},
						"hasMap": "https://www.google.com/maps?cid=14653104836874347307",
						"openingHoursSpecification": [
							{
								"@type": "OpeningHoursSpecification",
								"dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
								"opens": "08:00",
								"closes": "18:00"
							},
							{
								"@type": "OpeningHoursSpecification",
								"dayOfWeek": "Saturday",
								"opens": "08:00",
								"closes": "14:00"
							}
						],
						"areaServed": [
							{ "@type": "City", "name": "Pereira" },
							{ "@type": "City", "name": "Dosquebradas" },
							{ "@type": "AdministrativeArea", "name": "Risaralda" }
						],
						"knowsAbout": [
							"Restauración de muebles",
							"Ebanistería",
							"Cocinas integrales a medida",
							"Clósets y armarios a medida",
							"Puertas de madera",
							"Carpintería",
							"Tapicería",
							"Lacado y pintura de muebles"
						],
						"hasOfferCatalog": {
							"@type": "OfferCatalog",
							"name": "Servicios de Ebanistería",
							"itemListElement": [
								{
									"@type": "Offer",
									"itemOffered": {
										"@type": "Service",
										"name": "Restauración de Muebles",
										"description": "Restauramos y renovamos muebles antiguos conservando su esencia, recuperando acabados y adaptándolos a nuevos espacios."
									}
								},
								{
									"@type": "Offer",
									"itemOffered": {
										"@type": "Service",
										"name": "Cocinas Integrales a Medida",
										"description": "Fabricamos cocinas a medida pensando en la distribución, el uso diario y el estilo de tu hogar."
									}
								},
								{
									"@type": "Offer",
									"itemOffered": {
										"@type": "Service",
										"name": "Clósets y Armarios a Medida",
										"description": "Diseñamos y fabricamos clósets, vestiers y soluciones de almacenamiento adaptadas a tu espacio."
									}
								},
								{
									"@type": "Offer",
									"itemOffered": {
										"@type": "Service",
										"name": "Puertas de Madera",
										"description": "Reparación, restauración y fabricación de puertas y elementos de madera."
									}
								}
							]
						},
						"aggregateRating": {
							"@type": "AggregateRating",
							"ratingValue": "4.8",
							"reviewCount": "45",
							"bestRating": "5"
						},
						"sameAs": []
					}),
				}}
			/>

			{/* JSON-LD: BreadcrumbList para rich snippets */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						"itemListElement": [
							{
								"@type": "ListItem",
								"position": 1,
								"name": BRAND,
								"item": SITE_URL
							}
						]
					}),
				}}
			/>

			{/* JSON-LD: FAQPage para rich results de preguntas frecuentes */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FAQPage",
						"mainEntity": [
							{
								"@type": "Question",
								"name": "¿Cuánto cuesta restaurar un mueble en Pereira?",
								"acceptedAnswer": {
									"@type": "Answer",
									"text": "El costo depende del estado del mueble, el tipo de restauración y los acabados. En Ebanistería El Calvo ofrecemos presupuesto sin compromiso. Contáctanos al 312 760 9748 para una evaluación gratuita."
								}
							},
							{
								"@type": "Question",
								"name": "¿Fabrican cocinas integrales a medida en Pereira?",
								"acceptedAnswer": {
									"@type": "Answer",
									"text": "Sí, fabricamos cocinas integrales a medida en nuestro taller de Pereira. Diseñamos cada cocina pensando en la distribución de tu espacio, materiales de calidad y el estilo que deseas."
								}
							},
							{
								"@type": "Question",
								"name": "¿Dónde queda Ebanistería El Calvo?",
								"acceptedAnswer": {
									"@type": "Answer",
									"text": "Estamos ubicados en el Barrio Atenas, Sector Perla del Sur, Cuba, Pereira, Risaralda. Manzana D Casa 142 esquina. Atendemos de lunes a viernes de 8:00 a 18:00 y sábados de 8:00 a 14:00."
								}
							},
							{
								"@type": "Question",
								"name": "¿Hacen clósets y armarios a medida?",
								"acceptedAnswer": {
									"@type": "Answer",
									"text": "Sí, diseñamos y fabricamos clósets, vestiers y armarios a medida. Nos adaptamos a tu espacio y necesidades de organización con materiales duraderos y acabados de calidad."
								}
							},
							{
								"@type": "Question",
								"name": "¿Qué servicios de carpintería ofrecen en Pereira?",
								"acceptedAnswer": {
									"@type": "Answer",
									"text": "Ofrecemos restauración de muebles, fabricación de cocinas integrales, clósets, armarios, puertas de madera, tapicería, pintura y lacado de muebles. Todo hecho a medida en nuestro taller de Pereira."
								}
							}
						]
					}),
				}}
			/>

			<StaticGA4Script />
			{children}
			<CookieConsentBanner />
		</>
	);
}


