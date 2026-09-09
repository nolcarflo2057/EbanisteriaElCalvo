import { VerticalService } from "@/features/stores/services/vertical.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { defaultLanding } from "@/features/landing/constants/mock-cms";
import type { LandingFooterLinkGroup } from "@/features/landing/types/landing.types";
import { LandingFooterUI } from "./landing-footer-ui";
import type { LandingFooterProps } from "./landing-footer.types";

export async function LandingFooter({ brand, tagline, linkGroups, copyright }: LandingFooterProps = {}) {
	let footer = defaultLanding.footer;

	const hasExplicitProps = Boolean(brand || tagline || linkGroups || copyright);

	if (hasExplicitProps) {
		footer = {
			...defaultLanding.footer,
			brand: brand ?? defaultLanding.footer.brand,
			tagline: tagline ?? defaultLanding.footer.tagline,
			linkGroups: linkGroups ?? defaultLanding.footer.linkGroups,
			copyright: copyright ?? defaultLanding.footer.copyright,
		};
	} else {
		try {
			const tenantId = await getTenantIdFromHeaders();

			// Fallback base: vertical activa para textos y estructura general
			const vertical = await VerticalService.getActiveVertical(tenantId);
			if (vertical?.landing?.footer) {
				footer = { ...defaultLanding.footer, ...vertical.landing.footer };
			}
		} catch (error) {
			console.error("[LandingFooter] Error cargando footer:", error);
		}
	}

	const { brand: finalBrand, tagline: finalTagline, linkGroups: finalGroups, copyright: finalCopyright } = footer;

	return (
		<LandingFooterUI
			brand={finalBrand}
			tagline={finalTagline}
			copyright={finalCopyright}
			linkGroups={finalGroups}
		/>
	);
}
