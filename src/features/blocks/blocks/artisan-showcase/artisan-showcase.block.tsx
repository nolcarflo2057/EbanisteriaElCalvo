import type { BlockDefinition } from "../../types/schema";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { artisanShowcaseSchema, artisanShowcaseDefaultProps, type ArtisanShowcaseBlockProps } from "./artisan-showcase.schema";
import { useArtisanShowcase } from "./useArtisanShowcase";

export const artisanShowcaseBlock: BlockDefinition<ArtisanShowcaseBlockProps> = {
	schema: artisanShowcaseSchema,
	Component: ({ props }) => {
		 
		const {} = useArtisanShowcase();
		const isImageLeft = props.layout === "image-left";
		const backgroundClass = {
			transparent: "",
			light: "bg-surface-container-low",
			dark: "bg-primary text-on-primary",
			accent: "bg-accent text-on-accent",
		}[props.background ?? "light"];

		return (
			<section className={cn("py-12 md:py-24 overflow-hidden", backgroundClass)} id="artesano">
				<div className="max-w-[1200px] mx-auto px-4 md:px-10">
					<div className={cn("grid md:grid-cols-2 gap-16 items-center", isImageLeft ? "" : "md:flex-row-reverse")}>
						{/* Image Column */}
						<div className="relative">
							<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10">
								<Image
									alt={props.imageAlt}
									src={props.image}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover"
									unoptimized={String(props.image).startsWith("http")}
								/>
							</div>
							<div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl -z-10" />
							<div className="absolute -top-8 -left-8 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl -z-10" />
						</div>

						{/* Content Column */}
						<div>
							{props.badge && (
								<span className="text-secondary font-label-md uppercase tracking-widest block mb-4">
									{props.badge}
								</span>
							)}
							<h2 className="font-headline-md text-headline-md mb-6 text-primary">
								{props.title}
							</h2>
							<p className="font-body-md text-on-surface-variant mb-8">
								{props.description}
							</p>

							{props.badgeContent && (
								<div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-outline-variant">
									<div className="text-secondary">
										<span
											className="material-symbols-outlined text-4xl"
											style={{ fontVariationSettings: '"FILL" 1' }}
										>
											{props.badgeContent.icon}
										</span>
									</div>
									<div>
										<p className="font-label-md text-primary">{props.badgeContent.label}</p>
										<p className="text-on-surface-variant text-label-sm">{props.badgeContent.subtitle}</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		);
	},
	defaultProps: artisanShowcaseDefaultProps,
};
