import type { BlockDefinition } from "../../types/schema";
import { cn } from "@/shared/utils/cn";
import { servicesGridSchema, servicesGridDefaultProps, type ServicesGridBlockProps } from "./services-grid.schema";
import { useServicesGrid } from "./useServicesGrid";

export const servicesGridBlock: BlockDefinition<ServicesGridBlockProps> = {
	schema: servicesGridSchema,
	Component: ({ props }) => {
		 
		const {} = useServicesGrid();
		const gridCols = {
			2: "grid-cols-1 md:grid-cols-2",
			3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
			4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
		}[props.columns ?? 4];

		return (
			<section className="py-12 md:py-24 bg-surface relative" id="servicios">
				<div
					className="wood-texture-overlay absolute inset-0"
					style={{
						pointerEvents: 'none',
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
					}}
				/>
				<div className="max-w-[1400px] mx-auto px-4 md:px-10 relative">
					<div className="text-center mb-16">
						<span className="text-secondary font-label-md uppercase tracking-widest block mb-2">
							{props.subtitle}
						</span>
						<h2 className="font-headline-md text-headline-md text-primary">
							{props.title}
						</h2>
					</div>
					<div className={cn("grid gap-6", gridCols)}>
						{props.services?.map((service, i) => (
							<div
								key={i}
								className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary/5 flex flex-col items-start group"
							>
								<div
									className={cn(
										"w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-white",
										service.iconBg ? `bg-[${service.iconBg}]/10 text-[${service.iconBg}]` : "bg-primary/10 text-primary"
									)}
								>
									<span className="material-symbols-outlined text-xl">
										{service.icon}
									</span>
								</div>
								<h3 className="font-headline-sm text-headline-sm mb-3 text-primary">
									{service.title}
								</h3>
								<p className="text-on-surface-variant font-body-md">
									{service.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	},
	defaultProps: servicesGridDefaultProps,
};


