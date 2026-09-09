import type { BlockDefinition } from "../../types/schema";
import { LandingStats } from "@/features/landing/components/landing-stats";
import { statsSchema, statsDefaultProps, type StatsBlockProps } from "./stats.schema";
import { useStats } from "./useStats";

export const statsBlock: BlockDefinition<StatsBlockProps> = {
	schema: statsSchema,
	Component: ({ props }) => {
		 
		const {} = useStats();
		return (
			<LandingStats
				title={props.title}
				stats={(props.stats ?? []).map((s) => ({ value: s.value, label: s.label }))}
			/>
		);
	},
	defaultProps: statsDefaultProps,
};
