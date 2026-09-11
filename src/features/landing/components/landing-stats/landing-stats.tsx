import type { LandingStatsProps } from "./landing-stats.types";
import { useLandingStats } from "./useLandingStats";

export function LandingStats({ title, stats }: LandingStatsProps) {
	const {} = useLandingStats();
	if (!stats.length) return null;

	return (
		<section className="py-20 bg-primary">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{title && (
					<h2 className="text-center text-3xl font-bold text-primary-foreground mb-12">{title}</h2>
				)}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{stats.map((stat) => (
						<div key={stat.label} className="text-center">
							<p className="text-4xl font-extrabold text-primary-foreground">{stat.value}</p>
							<p className="mt-2 text-sm text-primary-foreground/80 uppercase tracking-wide">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}


