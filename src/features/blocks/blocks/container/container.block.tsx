import type { BlockDefinition } from "../../types/schema";
import { cn } from "@/shared/utils/cn";
import { containerSchema, containerDefaultProps, type ContainerBlockProps } from "./container.schema";
import { useContainer } from "./useContainer";

export const containerBlock: BlockDefinition<ContainerBlockProps> = {
	schema: containerSchema,
	Component: ({ props, children }) => {
		 
		const {} = useContainer();
		const gridCols = {
			1: "grid-cols-1",
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
			4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
		}[props.columns ?? 2];

		const gapClass = {
			sm: "gap-4",
			md: "gap-6",
			lg: "gap-8",
			xl: "gap-12",
		}[props.gap ?? "md"];

		const paddingClass = {
			sm: "py-8",
			md: "py-12",
			lg: "py-20",
			xl: "py-28",
		}[props.padding ?? "md"];

		const backgroundClass = {
			transparent: "",
			light: "bg-muted/30",
			dark: "bg-primary text-primary-foreground",
			accent: "bg-accent text-accent-foreground",
		}[props.background ?? "transparent"];

		return (
			<section
				className={cn(
					"w-full max-w-7xl mx-auto px-4",
					gridCols,
					gapClass,
					paddingClass,
					backgroundClass,
					props.customClasses,
				)}
			>
				{children}
			</section>
		);
	},
	defaultProps: containerDefaultProps,
};


