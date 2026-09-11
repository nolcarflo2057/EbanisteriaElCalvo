import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { inter, outfit, titleFonts } from "@/config/fonts";

import { ThemeProvider } from "@/features/settings/components/ThemeProvider";
import { tenantStorage } from "@/core/tenant/tenant-context";
import { resolveTenantIdFromHostname } from "@/core/tenant/tenant-resolver";
import { SettingsService } from "@/features/settings/services/settings.service";
import { getStoreConfig } from "@/features/stores/services/store-config.service";
import { siteConfig } from "@/config/site";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://carvin-ecommerce.vercel.app";

const siteDescription = siteConfig.description.slice(0, 155);

export async function generateMetadata(): Promise<Metadata> {
	const host = (await headers()).get("host") || "";

	let storeName = "Mi Tienda";
	let storeDescription = siteDescription;
	let seo = null;
	let social = null;
	let faviconUrl: string | null = null;
	try {
		const tenantId = await resolveTenantIdFromHostname(host);
		const settings = await SettingsService.getSettings(tenantId);
		if (settings?.name) {
			storeName = settings.name;
		}
		const config = await getStoreConfig(tenantId);
		if (config?.name) {
			storeName = config.name;
		}
		const appearance = await SettingsService.getAppearance(tenantId);
		faviconUrl = appearance?.faviconUrl || appearance?.logoUrl || null;
		seo = await SettingsService.getSeo(tenantId);
		social = await SettingsService.getSocial(tenantId);
		storeDescription = seo?.description
			? seo.description
			: `${storeName} — ${siteDescription}`.slice(0, 155);
	} catch (e) {
		// DB no disponible: usar metadata por defecto
	}

	const socialOgImage = social?.ogImage
		? social.ogImage.startsWith("http")
			? social.ogImage
			: `${baseUrl}${social.ogImage}`
		: siteConfig.defaultOgImage;

	const ogImage = [
		{
			url: socialOgImage,
			width: 1200,
			height: 630,
			alt: storeName,
		},
	];

	const ogTitle = social?.ogTitle || seo?.title || storeName;
	const ogDescription = social?.ogDescription || storeDescription;

	const keywords = seo?.keywords
		? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
		: siteConfig.keywords;

	const [robotsIndex, robotsFollow] = (seo?.robots || "index,follow").split(",");

	return {
		metadataBase: new URL(baseUrl),
		title: {
			default: seo?.title || storeName,
			template: `%s | ${seo?.title || storeName}`,
		},
		description: storeDescription,
		keywords,
		alternates: {
			canonical: seo?.canonicalUrl || undefined,
		},
		icons: faviconUrl
			? {
					icon: faviconUrl.startsWith("http")
						? faviconUrl
						: `${baseUrl}${faviconUrl}`,
					shortcut: faviconUrl.startsWith("http")
						? faviconUrl
						: `${baseUrl}${faviconUrl}`,
				}
			: undefined,
		openGraph: {
			type: "website",
			locale: "es_CO",
			url: baseUrl,
			siteName: storeName,
			title: ogTitle,
			description: ogDescription,
			images: ogImage,
		},
		twitter: {
			card: (social?.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
			title: ogTitle,
			description: ogDescription,
			images: ogImage.map((img) => img.url),
		},
		robots: {
			index: robotsIndex !== "noindex",
			follow: robotsFollow !== "nofollow",
			googleBot: {
				index: robotsIndex !== "noindex",
				follow: robotsFollow !== "nofollow",
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}

const FALLBACK_TENANT_ID = "00000000-0000-0000-0000-000000000000";

export default async function ShopLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const host = (await headers()).get("host") || "";

	let tenantId = FALLBACK_TENANT_ID;
	let storeName = "Mi Tienda";
	let seoJsonLd: string | null = null;
	try {
		tenantId = await resolveTenantIdFromHostname(host);
		const config = await getStoreConfig(tenantId);
		if (config?.name) {
			storeName = config.name;
		}
		const seo = await SettingsService.getSeo(tenantId);
		if (seo?.jsonLd) {
			// Sanitizar: parsear y stringificar para escapar HTML en valores de cadenas
			// (la validación Zod ya asegura que es JSON válido)
			seoJsonLd = JSON.stringify(JSON.parse(seo.jsonLd));
		}
	} catch (e) {
		// DB no disponible: usar fallbacks para rutas estáticas / preview
	}

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: storeName,
		url: baseUrl,
		description: siteDescription,
	};

	return tenantStorage.run({ tenantId }, () => (
		<html
			lang="es"
			className={`${outfit.variable} ${inter.variable} ${titleFonts.variable} h-full bg-background antialiased`}
			suppressHydrationWarning
		>
			<head suppressHydrationWarning>
				<ThemeProvider />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Domine:wght@400;600;700&amp;family=Work+Sans:wght@400;500;600&amp;display=swap"
					rel="stylesheet"
				/>
				{/* eslint-disable-next-line @next/next/no-page-custom-font */}
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
					rel="stylesheet"
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				{seoJsonLd ? (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: seoJsonLd }}
					/>
				) : null}
			</head>
			<body
				className="min-h-full flex flex-col font-sans"
				suppressHydrationWarning
			>
				{children}
				<Toaster position="top-right" toastOptions={{ duration: 4000 }} />
			</body>
		</html>
	));
}


