import type { BlockDefinition } from "../../types/schema";
import { LandingFaq } from "@/features/landing/components/landing-faq";
import { faqSchema, faqDefaultProps, type FaqBlockProps } from "./faq.schema";
import { useFaq } from "./useFaq";

export const faqBlock: BlockDefinition<FaqBlockProps> = {
	schema: faqSchema,
	Component: ({ props }) => {
		 
		const {} = useFaq();
		const items = props.items ?? [];
		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": items.map((i) => ({
				"@type": "Question",
				"name": i.question,
				"acceptedAnswer": {
					"@type": "Answer",
					"text": i.answer
				}
			}))
		};

		return (
			<>
				{items.length > 0 && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
					/>
				)}
				<LandingFaq
					title={props.title}
					subtitle={props.subtitle}
					items={items.map((i) => ({ question: i.question, answer: i.answer }))}
				/>
			</>
		);
	},
	defaultProps: faqDefaultProps,
};


