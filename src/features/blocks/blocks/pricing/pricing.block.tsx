import type { BlockDefinition } from "../../types/schema";
import { LandingPricing } from "@/features/landing/components/landing-pricing";
import { pricingSchema, pricingDefaultProps, type PricingBlockProps } from "./pricing.schema";
import { usePricing } from "./usePricing";

export const pricingBlock: BlockDefinition<PricingBlockProps> = {
	schema: pricingSchema,
	Component: ({ props }) => {
		 
		const {} = usePricing();
		return (
			<LandingPricing
				title={props.title}
				subtitle={props.subtitle}
				plans={(props.plans ?? []).map((p) => ({
					name: p.name,
					price: p.price,
					period: p.period,
					description: p.description,
					features: (p.features ?? []).map((f) => f.feature),
					highlighted: Boolean(p.highlighted),
					ctaLabel: p.ctaLabel ?? "Elegir plan",
					ctaHref: p.ctaHref ?? "#",
				}))}
			/>
		);
	},
	defaultProps: pricingDefaultProps,
};


