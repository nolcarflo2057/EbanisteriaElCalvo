import type { BlockDefinition } from "../../types/schema";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { heroSchema, heroDefaultProps, type HeroBlockProps } from "./hero.schema";
import { useHero } from "./useHero";

export const heroBlock: BlockDefinition<HeroBlockProps> = {
	schema: heroSchema,
	Component: ({ props }) => {
	 
		const {} = useHero();
		return (
			<LandingHero
				title={props.title}
				subtitle={props.subtitle}
				badge={props.badge}
				bgImage={props.bgImage}
				bgAlt={props.bgAlt}
				ctaLabel={props.ctaLabel}
				ctaHref={props.ctaHref}
			/>
		);
	},
	defaultProps: heroDefaultProps,
};


