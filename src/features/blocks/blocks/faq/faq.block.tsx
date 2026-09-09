import type { BlockDefinition } from "../../types/schema";
import { LandingFaq } from "@/features/landing/components/landing-faq";
import { faqSchema, faqDefaultProps, type FaqBlockProps } from "./faq.schema";
import { useFaq } from "./useFaq";

export const faqBlock: BlockDefinition<FaqBlockProps> = {
	schema: faqSchema,
	Component: ({ props }) => {
		 
		const {} = useFaq();
		return (
			<LandingFaq
				title={props.title}
				subtitle={props.subtitle}
				items={(props.items ?? []).map((i) => ({ question: i.question, answer: i.answer }))}
			/>
		);
	},
	defaultProps: faqDefaultProps,
};
