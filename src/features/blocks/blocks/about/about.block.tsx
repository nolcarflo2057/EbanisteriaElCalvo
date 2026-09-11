import type { BlockDefinition } from "../../types/schema";
import { LandingAbout } from "@/features/landing/components/landing-about";
import { aboutSchema, aboutDefaultProps, type AboutBlockProps } from "./about.schema";
import { useAbout } from "./useAbout";

export const aboutBlock: BlockDefinition<AboutBlockProps> = {
	schema: aboutSchema,
	Component: ({ props }) => {
		 
		const {} = useAbout();
		return (
			<LandingAbout
				title={props.title}
				text={props.text}
				image={props.image}
				imagePosition={props.imagePosition}
				badge={props.badge}
			/>
		);
	},
	defaultProps: aboutDefaultProps,
};


