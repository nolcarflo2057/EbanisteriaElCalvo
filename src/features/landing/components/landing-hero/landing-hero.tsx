"use client";

import Image from "next/image";
import Link from "next/link";
import type { LandingHeroProps } from "./landing-hero.types";
import { useLandingHero } from "./useLandingHero";
import { resolveButtonClasses } from "@/core/tenant/resolve-styles";
import { useTenantTheme } from "@/core/tenant/useTenantTheme";
import { cn } from "@/shared/utils/cn";

export function LandingHero({ title, subtitle, ctaLabel, ctaHref, bgImage, bgAlt, badge, buttonStyle }: LandingHeroProps) {
	const {} = useLandingHero();
	const { config: themeConfig } = useTenantTheme();
	const resolvedButtonStyle = buttonStyle ?? themeConfig.buttonStyle;
	const btnClasses = resolveButtonClasses({ buttonStyle: resolvedButtonStyle } as any);
	return (
		<section className="relative h-[70vh] sm:h-[70vh] flex items-center overflow-hidden">
			<div className="absolute inset-0 z-0 ">
				<Image
					src={bgImage}
					alt={bgAlt || ""}
					fill
					sizes="100vw"
					priority
					className="object-cover object-[60%_center]"
					unoptimized={bgImage?.startsWith("http")}
				/>
				<div className="absolute inset-0 bg-primary/40 sm:bg-primary/20" />
			</div>
			<div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10 w-full">
				<div className="max-w-xl text-on-primary">
					{badge && (
						<span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase bg-on-primary/10 text-on-primary border border-on-primary/25 mb-4 slide-up-fade">
							<span className="size-1.5 rounded-full bg-on-primary animate-pulse" />
							{badge}
						</span>
					)}
					<h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-6 leading-tight slide-up-fade animation-delay-100" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{title}</h1>
					<p className="font-body-lg text-body-lg mb-8 opacity-90 slide-up-fade animation-delay-200" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{subtitle}</p>
					<div className="flex gap-4 slide-up-fade animation-delay-300">
						<Link
							href={ctaHref}
							className={cn(
								"bg-secondary-container text-on-secondary-container font-label-md font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] capitalize button-shine",
								btnClasses
							)}
						>
							{ctaLabel}
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
