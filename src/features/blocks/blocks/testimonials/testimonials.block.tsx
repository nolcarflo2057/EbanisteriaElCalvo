import type { BlockDefinition } from "../../types/schema";
import { LandingTestimonials } from "@/features/landing/components/landing-testimonials";
import { testimonialsSchema, testimonialsDefaultProps, type TestimonialsBlockProps } from "./testimonials.schema";
import { useTestimonials } from "./useTestimonials";

export const testimonialsBlock: BlockDefinition<TestimonialsBlockProps> = {
	schema: testimonialsSchema,
	Component: ({ props }) => {
		 
		const {} = useTestimonials();
		return (
			<LandingTestimonials
				title={props.title}
				subtitle={props.subtitle}
				items={(props.items ?? []).map((t) => ({
					author: t.author,
					role: t.role,
					quote: t.quote,
					rating: t.rating,
					avatar: t.avatar,
				}))}
			/>
		);
	},
	defaultProps: testimonialsDefaultProps,
};


