export interface PricingPlan {
	name: string;
	price: string;
	period: string;
	description: string;
	features: string[];
	highlighted: boolean;
	ctaLabel: string;
	ctaHref: string;
}

export interface LandingPricingProps {
	title: string;
	subtitle: string;
	plans: PricingPlan[];
}
