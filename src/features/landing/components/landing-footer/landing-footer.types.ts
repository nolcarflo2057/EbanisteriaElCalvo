import type { LandingFooterLinkGroup } from "@/features/landing/types/landing.types";

export interface LandingFooterProps {
	brand?: string;
	tagline?: string;
	linkGroups?: LandingFooterLinkGroup[];
	copyright?: string;
}

export interface LandingFooterUIProps {
	brand?: string;
	tagline?: string;
	linkGroups?: LandingFooterLinkGroup[];
	copyright?: string;
}
