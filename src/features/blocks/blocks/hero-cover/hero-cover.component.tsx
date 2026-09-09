"use client";

import { useLeadModal } from "@/features/leads/components/LeadModalProvider";
import { type HeroCoverProps } from "./hero-cover.schema";

export function HeroCoverComponent({ props }: { props: HeroCoverProps }) {
	const { openLeadModal } = useLeadModal();
	return (
		<section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-section-gap v-section v-hero overflow-hidden">
			<div className="absolute inset-0 z-0">
				<img
					className="w-full h-full object-cover object-right"
					data-alt={props.backgroundAlt}
					src={props.backgroundImage}
				/>
				<div className="absolute inset-0 bg-black/50" aria-hidden="true" />
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" aria-hidden="true" />
			</div>
			<div className="v-container w-full grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10 mt-12 md:mt-0">
				<div className="col-span-1 md:col-span-8 flex flex-col justify-center fade-up visible">
					<h1 className="v-hero-title mb-6 md:mb-8">
						{props.titleLine1}
						<br />
						<span className="text-primary">{props.titleLine2}</span>
					</h1>
					<p className="v-lead max-w-2xl mb-8 md:mb-12 border-l-2 border-primary pl-4 md:pl-6 leading-relaxed break-words">
						{props.description}
					</p>
					<div className="flex max-sm:flex-col sm:flex-row max-sm:gap-4 sm:gap-6 w-full">
						<button type="button" className="v-btn-primary w-full sm:w-fit text-center" onClick={openLeadModal}>
							{props.primaryCtaLabel}
						</button>
						<a className="v-btn-ghost w-full sm:w-fit text-center" href={props.secondaryCtaHref}>
							{props.secondaryCtaLabel}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}