/**
 * Tipos de contenido de landing asociado a una vertical de tienda (store_verticals.landing).
 *
 * Reemplazan los mocks hardcodeados de ropa para que cada tienda/vertical
 * defina su propio hero, secciones, CTA, footer y categorías destacadas.
 */

export interface LandingHero {
	title: string;
	subtitle: string;
	badge?: string;
	cta: string;
	ctaHref: string;
	bgImage?: string;
}

export interface LandingFeature {
	icon: string;
	title: string;
	desc: string;
}

export interface LandingStep {
	step: string;
	title: string;
	desc: string;
}

export interface LandingCta {
	title: string;
	subtitle: string;
	cta: string;
	ctaHref: string;
	bgImage?: string;
}

export interface LandingFooterLink {
	label: string;
	href: string;
}

export interface LandingFooterLinkGroup {
	title: string;
	links: LandingFooterLink[];
}

export interface LandingFooter {
	brand: string;
	tagline: string;
	linkGroups: LandingFooterLinkGroup[];
	social: LandingFooterLink[];
	copyright: string;
}

export interface LandingCategoryCard {
	name: string;
	desc: string;
	image: string;
	href: string;
}

export interface VerticalLanding {
	hero: LandingHero;
	features: LandingFeature[];
	steps: LandingStep[];
	cta: LandingCta;
	footer: LandingFooter;
	// Categorías destacadas de la home. Si vienen vacías, se derivan del árbol de la vertical.
	categories?: LandingCategoryCard[];
}
