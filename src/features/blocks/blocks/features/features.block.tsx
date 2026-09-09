import type { BlockDefinition } from "../../types/schema";
import { LandingWhy } from "@/features/landing/components/landing-why";
import { featuresSchema, featuresDefaultProps, type FeaturesBlockProps } from "./features.schema";
import { useFeatures } from "./useFeatures";

export const featuresBlock: BlockDefinition<FeaturesBlockProps> = {
	schema: featuresSchema,
	Component: ({ props }) => {
		 
		const {} = useFeatures();
		return (
			<LandingWhy
				title={props.title}
				subtitle={props.subtitle}
				features={(props.features ?? []).map((f) => ({ icon: f.icon, title: f.title, desc: f.desc }))}
			/>
		);
	},
	defaultProps: featuresDefaultProps,
};
