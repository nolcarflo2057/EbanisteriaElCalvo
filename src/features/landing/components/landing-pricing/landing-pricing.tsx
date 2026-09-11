import { cn } from "@/shared/utils/cn";
import type { LandingPricingProps } from "./landing-pricing.types";
import { useLandingPricing } from "./useLandingPricing";

export function LandingPricing({ title, subtitle, plans }: LandingPricingProps) {
	const {} = useLandingPricing();
	if (!plans.length) return null;

	return (
		<section className="py-20 bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-14">
					<span className="text-sm font-semibold tracking-wide text-primary uppercase">{subtitle}</span>
					<h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-8 items-stretch">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={cn(
								"relative flex flex-col rounded-2xl p-8 border transition-shadow",
								plan.highlighted
									? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
									: "bg-card border-border hover:shadow-md"
							)}
						>
							{plan.highlighted && (
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background text-primary text-xs font-bold px-4 py-1 shadow-sm">
									Más popular
								</span>
							)}
							<h3 className="text-lg font-bold">{plan.name}</h3>
							<div className="mt-4 flex items-baseline gap-1">
								<span className="text-4xl font-extrabold">{plan.price}</span>
								{plan.period && <span className={cn("text-sm", plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground")}>{plan.period}</span>}
							</div>
							{plan.description && (
								<p className={cn("mt-3 text-sm leading-relaxed", plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground")}>
									{plan.description}
								</p>
							)}
							<ul className="mt-6 space-y-3 flex-1">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-2 text-sm">
										<span className={cn("mt-0.5", plan.highlighted ? "text-primary-foreground" : "text-primary")}>✓</span>
										<span className={plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}>{feature}</span>
									</li>
								))}
							</ul>
							<a
								href={plan.ctaHref || "#"}
								className={cn(
									"mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all",
									plan.highlighted
										? "bg-background text-primary hover:bg-muted"
										: "bg-primary text-primary-foreground hover:opacity-90"
								)}
							>
								{plan.ctaLabel}
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}


