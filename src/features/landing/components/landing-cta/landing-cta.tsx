import Image from "next/image";
import type { LandingCtaProps } from "./landing-cta.types";
import { useLandingCta } from "./useLandingCta";

export function LandingCta({ title, subtitle, cta, ctaHref, bgImage }: LandingCtaProps) {
	const {} = useLandingCta();
	return (
		<section className="relative py-20 overflow-hidden">
			{bgImage ? (
				<Image src={bgImage} alt="" fill sizes="100vw" className="object-cover" />
			) : (
				<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/20" />
			)}
			<div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-secondary/90" />
			<div className="relative mx-auto max-w-3xl text-center px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl font-bold text-primary-foreground slide-up-fade">{title}</h2>
				<p className="mt-4 text-lg text-primary-foreground/80 slide-up-fade animation-delay-100">{subtitle}</p>
				<a
					href={ctaHref}
					className="mt-8 inline-flex items-center rounded-full bg-secondary-container px-8 py-3.5 text-sm font-semibold text-on-secondary-container hover:shadow-xl transition-all active:scale-[0.98] button-shine slide-up-fade animation-delay-200"
				>
					{cta}
				</a>
			</div>
		</section>
	);
}
