import Link from "next/link";
import type { LandingStepsProps } from "./landing-steps.types";
import { useLandingSteps } from "./useLandingSteps";

export function LandingSteps({ title, subtitle, steps }: LandingStepsProps) {
	const {} = useLandingSteps();
	return (
		<section className="py-20 bg-muted/50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-14">
					<span className="text-sm font-semibold tracking-wide text-primary uppercase">{subtitle}</span>
					<h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					{steps.map((s, i) => (
						<div key={s.step} className="relative text-center">
							{i < steps.length - 1 && (
								<div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
							)}
							<div className="inline-flex items-center justify-center size-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6 relative z-10">
								{s.step}
							</div>
							<h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
						</div>
					))}
				</div>
				<div className="text-center mt-10">
					<Link
						href="/products"
						className="inline-flex items-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
					>
						Empezar a comprar
					</Link>
				</div>
			</div>
		</section>
	);
}
