import type { BlockDefinition } from "../../types/schema";
import { LandingCta } from "@/features/landing/components/landing-cta";
import { ctaSchema, ctaDefaultProps, type CtaBlockProps } from "./cta.schema";
import { useCta } from "./useCta";

export const ctaBlock: BlockDefinition<CtaBlockProps> = {
	schema: ctaSchema,
	Component: ({ props }) => {
		 
		const {} = useCta();
		return (
			<LandingCta
				title={props.title}
				subtitle={props.subtitle}
				bgImage={props.bgImage}
				cta={props.cta?.label ?? "Comenzar ahora"}
				ctaHref={props.cta?.href ?? "/products"}
			/>
		);
	},
	defaultProps: ctaDefaultProps,
};
