import type { Metadata } from "next";
import { LandingFooter } from "@/features/landing/components";
import { StoreConfigProvider } from "@/features/stores/components/StoreConfigProvider";
import { getStoreConfig } from "@/features/stores/services/store-config.service";
import { AnalyticsInjector } from "@/features/analytics/components/AnalyticsInjector";
import { TrackingScripts } from "@/features/analytics/components/TrackingScripts";
import { CookieConsentBanner } from "@/features/settings/components/CookieConsentBanner";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { getTenantSlugById } from "@/core/tenant/tenant-resolver";
import { BlockService } from "@/features/blocks/services/block.service";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { SettingsRepository } from "@/features/settings/repositories/settings.repository";

function getBaseUrl(): string {
	return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function buildJsonLd(args: {
	name?: string | null;
	slug?: string | null;
	baseUrl: string;
	seo?: {
		jsonLd?: string | null;
	} | null;
	contactEmail?: string | null;
	contactPhone?: string | null;
}): string {
	// Si el cliente configuró un JSON-LD propio, re-serializamos para garantizar JSON válido.
	if (args.seo?.jsonLd) {
		try {
			return JSON.stringify(JSON.parse(args.seo.jsonLd));
		} catch {
			// JSON inválido: caemos al LocalBusiness por defecto.
		}
	}
	const url = `${args.baseUrl}/${args.slug ?? ""}`;
	const localBusiness: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: args.name || "Negocio",
		url,
	};
	if (args.contactPhone) localBusiness.telephone = args.contactPhone;
	if (args.contactEmail) localBusiness.email = args.contactEmail;
	return JSON.stringify(localBusiness);
}

export async function generateMetadata(): Promise<Metadata> {
	try {
		const tenantId = await getTenantIdFromHeaders();
		const baseUrl = getBaseUrl();

		const [seo, social, settings, slug] = await Promise.all([
			SettingsRepository.getSeo(tenantId),
			SettingsRepository.getSocial(tenantId),
			SettingsRepository.getSettings(tenantId),
			getTenantSlugById(tenantId),
		]);

		const name = settings?.name || "Landing";
		const title = seo?.title || name;
		const description = seo?.description || "";
		const canonical = seo?.canonicalUrl || `${baseUrl}/${slug ?? ""}`;
		const keywords = seo?.keywords
			? seo.keywords
					.split(",")
					.map((k: string) => k.trim())
					.filter(Boolean)
			: undefined;

		return {
			title,
			description,
			keywords,
			robots: (seo?.robots as Metadata["robots"]) || "index,follow",
			alternates: { canonical },
			openGraph: {
				title: social?.ogTitle || title,
				description: social?.ogDescription || description,
				url: canonical,
				siteName: name,
				type: "website",
				...(social?.ogImage ? { images: [{ url: social.ogImage }] } : {}),
			},
			twitter: {
				card: (social?.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
				title: social?.ogTitle || title,
				description: social?.ogDescription || description,
				...(social?.ogImage ? { images: [social.ogImage] } : {}),
			},
		};
	} catch {
		return {
			title: "Landing",
			robots: "index,follow",
		};
	}
}

export default async function StoreLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const tenantId = await getTenantIdFromHeaders();
	const storeConfig = await getStoreConfig(tenantId);
	const tenantSlug = await getTenantSlugById(tenantId);

	// Check if store has any visible blocks configured
	const blocks = await BlockService.getPageBlocks(tenantId, "home");
	const hasBlocks = blocks.some((b) => b.visible);

	const [seo, social, settings] = await Promise.all([
		SettingsRepository.getSeo(tenantId),
		SettingsRepository.getSocial(tenantId),
		SettingsRepository.getSettings(tenantId),
	]);
	const jsonLd = buildJsonLd({
		name: settings?.name,
		slug: tenantSlug,
		baseUrl: getBaseUrl(),
		seo,
		contactEmail: settings?.contactEmail,
		contactPhone: settings?.contactPhone,
	});

	return (
		<StoreConfigProvider initialConfig={storeConfig}>
			<AnalyticsInjector tenantId={tenantId} />
			<TrackingScripts tenantId={tenantId} />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: jsonLd }}
			/>
			<div className="min-h-screen flex flex-col bg-background">
				<main className="flex-1 w-full">{children}</main>
				{!hasBlocks && <LandingFooter />}
			</div>
			<CookieConsentBanner />
			{tenantSlug && <FloatingWidgets slug={tenantSlug} />}
		</StoreConfigProvider>
	);
}
