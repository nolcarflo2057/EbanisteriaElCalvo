import type { LandingFaqProps } from "./landing-faq.types";
import { useLandingFaq } from "./useLandingFaq";

export function LandingFaq({ title, subtitle, items }: LandingFaqProps) {
	const {} = useLandingFaq();
	if (!items.length) return null;

	return (
		<section className="py-20 bg-muted/50">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-14">
					{subtitle && <span className="text-sm font-semibold tracking-wide text-primary uppercase">{subtitle}</span>}
					<h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>
				</div>
				<div className="space-y-3">
					{items.map((item) => (
						<details key={item.question} className="group rounded-xl border border-border bg-card overflow-hidden">
							<summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-4 font-semibold text-foreground hover:bg-muted/40 transition-colors">
								{item.question}
								<span className="text-primary text-lg leading-none transition-transform group-open:rotate-45">+</span>
							</summary>
							<div className="px-6 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
								{item.answer}
							</div>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}


