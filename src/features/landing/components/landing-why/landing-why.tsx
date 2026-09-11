import type { LandingWhyProps } from "./landing-why.types";
import { useLandingWhy } from "./useLandingWhy";

export function LandingWhy({ title, subtitle, features }: LandingWhyProps) {
	const {} = useLandingWhy();
	return (
		<section className="py-20 bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-14">
					<span className="text-sm font-semibold tracking-wide text-primary uppercase">{subtitle}</span>
					<h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					{features.map((f) => (
						<div key={f.title} className="text-center p-6 rounded-2xl bg-card border border-border/50 interactive-card group">
							<div className="inline-flex items-center justify-center size-14 rounded-xl bg-primary text-primary-foreground text-2xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
								{f.icon}
							</div>
							<h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}


