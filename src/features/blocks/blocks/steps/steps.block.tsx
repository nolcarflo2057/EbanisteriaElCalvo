import type { BlockDefinition } from "../../types/schema";
import { LandingSteps } from "@/features/landing/components/landing-steps";
import { stepsSchema, stepsDefaultProps, type StepsBlockProps } from "./steps.schema";
import { useSteps } from "./useSteps";

export const stepsBlock: BlockDefinition<StepsBlockProps> = {
	schema: stepsSchema,
	Component: ({ props }) => {
		 
		const {} = useSteps();
		return (
			<LandingSteps
				title={props.title}
				subtitle={props.subtitle}
				steps={(props.steps ?? []).map((s) => ({ step: s.step, title: s.title, desc: s.desc }))}
			/>
		);
	},
	defaultProps: stepsDefaultProps,
};


