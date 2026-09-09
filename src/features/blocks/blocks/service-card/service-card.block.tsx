import type { BlockDefinition } from "../../types/schema";
import { serviceCardSchema, serviceCardDefaultProps, type ServiceCardBlockProps } from "./service-card.schema";
import { useServiceCard } from "./useServiceCard";

export const serviceCardBlock: BlockDefinition<ServiceCardBlockProps> = {
	schema: serviceCardSchema,
	Component: ({ props }) => {
		 
		const {} = useServiceCard();
		return (
			<div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary/5 flex flex-col items-start group">
				<div
					className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-white ${props.iconBg ? `bg-[${props.iconBg}]/10 text-[${props.iconBg}]` : "bg-primary/10 text-primary"}`}
				>
					<span className="material-symbols-outlined text-xl">
						{props.icon}
					</span>
				</div>
				<h3 className="font-headline-sm text-headline-sm mb-3 text-primary">
					{props.title}
				</h3>
				<p className="text-on-surface-variant font-body-md">
					{props.description}
				</p>
			</div>
		);
	},
	defaultProps: serviceCardDefaultProps,
};
