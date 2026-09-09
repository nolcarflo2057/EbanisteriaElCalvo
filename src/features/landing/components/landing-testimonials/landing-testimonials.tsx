import Image from "next/image";
import type { LandingTestimonialsProps } from "./landing-testimonials.types";
import { useLandingTestimonials } from "./useLandingTestimonials";

function Stars({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<span key={i} className={i < rating ? "text-amber-400" : "text-muted"}>
					â˜…
				</span>
			))}
		</div>
	);
}

export function LandingTestimonials({ title, subtitle, items }: LandingTestimonialsProps) {
	const {} = useLandingTestimonials();
	if (!items.length) return null;

	return (
		<section className="py-20 bg-muted/50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-14">
					<span className="text-sm font-semibold tracking-wide text-primary uppercase">{subtitle}</span>
					<h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map((t, i) => (
						<div key={`${t.author}-${i}`} className="rounded-2xl bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
							<Stars rating={Math.min(5, Math.max(1, Number(t.rating) || 0))} />
							<p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
							<div className="mt-6 flex items-center gap-3">
								{t.avatar ? (
									<div className="relative size-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
										<Image
											src={t.avatar}
											alt={t.author}
											fill
											sizes="40px"
											className="object-cover"
											unoptimized={t.avatar.startsWith("http")}
										/>
									</div>
								) : (
									<div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
										{t.author.charAt(0).toUpperCase()}
									</div>
								)}
								<div>
									<p className="text-sm font-bold text-foreground">{t.author}</p>
									{t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
