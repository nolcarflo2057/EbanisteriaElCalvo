export interface LandingHeroProps {
	title: string;
	subtitle: string;
	ctaLabel: string;
	ctaHref: string;
	bgImage: string;
	bgAlt?: string;
	badge?: string;
	/** Forma del botón CTA resuelta desde TenantThemeConfig */
	buttonStyle?: "rounded" | "pill" | "sharp";
}
