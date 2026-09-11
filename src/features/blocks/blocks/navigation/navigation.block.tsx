import type { BlockDefinition } from "../../types/schema";
import { navigationSchema, navigationDefaultProps, type NavigationBlockProps } from "./navigation.schema";
import { NavigationClient } from "./navigation-client";

export const navigationBlock: BlockDefinition<NavigationBlockProps> = {
	schema: navigationSchema,
	Component: ({ props }) => {
		return <NavigationClient props={props} />;
	},
	defaultProps: navigationDefaultProps,
};


