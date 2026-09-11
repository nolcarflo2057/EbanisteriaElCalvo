"use client";

import { TenantThemeProvider } from "@/core/tenant/tenant-theme-context";
import Image from "next/image";
import { StoreConfigProvider } from "@/features/stores/components/StoreConfigProvider";
import { NavigationClient } from "@/features/blocks/blocks/navigation/navigation-client";
import { LandingHero } from "@/features/landing/components/landing-hero/landing-hero";
import { LandingGallery } from "@/features/landing/components/landing-gallery/landing-gallery";
import { FooterClient } from "@/features/blocks/blocks/footer/footer-client";
import { ContactFormClient } from "@/features/blocks/blocks/contact-form/contact-form-client";

import { cn } from "@/shared/utils/cn";
import {
	nav, hero, services, artisan, gallery, location, contact, footer,
} from "./mock-data";
import type { TenantThemeConfig } from "@/core/tenant/tenant-theme.types";

const themeConfig: TenantThemeConfig = {
	buttonStyle: "rounded",
	navbarStyle: "glass",
	widgetShape: "circle",
	colorScheme: { primary: "#B45309", secondary: "#F4F4F5", accent: "#EA580C" },
};

/* ── LocationHours inlined (avoids async server component + DB read) ── */
function LocationHoursStatic() {
	const p = location;

	return (
		<section className="py-12 md:py-24 bg-surface" id="ubicacion">
			<div className="max-w-[1400px] mx-auto px-4 md:px-10">
				{p.mapEmbedUrl ? (
					<div className="bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 border border-outline-variant">
						<div className="relative md:col-span-3 h-full min-h-[380px]">
							<iframe
								allowFullScreen
								className="absolute inset-0 w-full h-full"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								src={p.mapEmbedUrl}
								title="Mapa de ubicación"
								style={{ border: 0 }}
							/>
						</div>
						<div className="bg-primary-container p-8 md:p-12 flex flex-col justify-center text-left text-on-primary md:col-span-2">
							<span className="material-symbols-outlined text-secondary-container text-4xl mb-6" style={{ fontVariationSettings: '"FILL" 1' }}>
								{p.icon}
							</span>
							<h2 className="font-headline-md text-headline-md mb-4 text-on-primary">{p.title}</h2>
							<div className="font-body-md text-on-primary/80 mb-8 space-y-4">
								{p.description?.split(/(?:\r?\n|\\n|<br\s*\/?>)+/i).map((paragraph, index) => (
									paragraph.trim() ? <p key={index}>{paragraph.trim()}</p> : null
								))}
							</div>
							{p.address && (
								<div className="flex items-center gap-3 text-on-primary mb-4">
									<span className="material-symbols-outlined text-secondary-container">map</span>
									<span className="font-label-md">{p.address}</span>
								</div>
							)}
							{p.schedule && (
								<div className="flex items-center gap-3 text-on-primary mb-4">
									<span className="material-symbols-outlined text-secondary-container">schedule</span>
									<span className="font-label-md">{p.schedule}</span>
								</div>
							)}
							{p.phone && (
								<div className="flex items-center gap-3 text-on-primary mb-4">
									<span className="material-symbols-outlined text-secondary-container">call</span>
									<span className="font-label-md">{p.phone}</span>
								</div>
							)}
							{p.directionsUrl && (
								<a
									className="mt-8 inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary font-label-md px-6 py-3 rounded-lg hover:bg-secondary/90 transition-all btn-active self-start"
									href={p.directionsUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="material-symbols-outlined">directions</span>
									Cómo llegar
								</a>
							)}
						</div>
					</div>
				) : (
					<div className="max-w-xl mx-auto px-4">
						<span className="material-symbols-outlined text-secondary-container text-5xl mb-6 block text-center" style={{ fontVariationSettings: '"FILL" 1' }}>
							{p.icon}
						</span>
						<h2 className="font-headline-md text-headline-md mb-4 text-center">{p.title}</h2>
						<p className="font-body-md opacity-80 text-center mb-8">{p.description}</p>
						{p.address && <p className="font-body-md mb-2 opacity-90 text-center">{p.address}</p>}
						{p.schedule && (
							<div className="inline-flex items-center gap-2 border border-current/20 px-6 py-3 rounded-full font-label-md mt-4">
								<span className="material-symbols-outlined">schedule</span>
								{p.schedule}
							</div>
						)}
						{p.phone && (
							<div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-80">
								<span className="material-symbols-outlined">call</span>
								{p.phone}
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}

/* ── ServicesGrid inlined (avoids BlockRenderer + registry lookup) ── */
function ServicesGridStatic() {
	const p = services;
	const gridCols = {
		2: "grid-cols-1 md:grid-cols-2",
		3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
		4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
	}[p.columns ?? 4];

	return (
		<section className="py-12 md:py-24 bg-surface relative" id="servicios">
			<div
				className="wood-texture-overlay absolute inset-0"
				style={{
					pointerEvents: "none",
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
				}}
			/>
			<div className="max-w-[1400px] mx-auto px-4 md:px-10 relative">
				<div className="text-center mb-16">
					<span className="text-secondary font-label-md uppercase tracking-widest block mb-2">
						{p.subtitle}
					</span>
					<h2 className="font-headline-md text-headline-md text-primary">{p.title}</h2>
				</div>
				<div className={cn("grid gap-6", gridCols)}>
					{p.services?.map((service, i) => (
						<div
							key={i}
							className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary/5 flex flex-col items-start group"
						>
							<div
								className={cn(
									"w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-white",
									service.iconBg ? `bg-[${service.iconBg}]/10 text-[${service.iconBg}]` : "bg-primary/10 text-primary",
								)}
							>
								<span className="material-symbols-outlined text-xl">{service.icon}</span>
							</div>
							<h3 className="font-headline-sm text-headline-sm mb-3 text-primary">{service.title}</h3>
							<p className="text-on-surface-variant font-body-md">{service.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ── ArtisanShowcase inlined (avoids BlockRenderer + registry lookup) ── */
function ArtisanShowcaseStatic() {
	const p = artisan;
	const isImageLeft = p.layout === "image-left";
	const backgroundClass = {
		transparent: "",
		light: "bg-surface-container-low",
		dark: "bg-primary text-on-primary",
		accent: "bg-accent text-on-accent",
	}[p.background ?? "light"];

	return (
		<section className={cn("py-12 md:py-24 overflow-hidden", backgroundClass)} id="artesano">
			<div className="max-w-[1400px] mx-auto px-4 md:px-10">
				<div className={cn("grid md:grid-cols-2 gap-16 items-stretch", isImageLeft ? "" : "md:flex-row-reverse")}>
					<div className="relative h-full min-h-[400px]">
						<div className="h-full rounded-2xl overflow-hidden shadow-2xl relative z-10">
							<Image
  alt={p.imageAlt}
  src={p.image}
  fill
  sizes="100vw"
  className="object-cover"
  unoptimized={p.image.startsWith("http")}
/>
						</div>
						<div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl -z-10" />
						<div className="absolute -top-8 -left-8 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl -z-10" />
					</div>
					<div className="flex flex-col justify-center">
						{p.badge && (
							<span className="text-secondary font-label-md uppercase tracking-widest block mb-4">{p.badge}</span>
						)}
						<h2 className="font-headline-md text-headline-md mb-6 text-primary">{p.title}</h2>
						<div className="font-body-md text-on-surface-variant mb-8 space-y-4">
							{p.description?.split(/(?:\r?\n|\\n|<br\s*\/?>)+/i).map((paragraph, index) => (
								paragraph.trim() ? <p key={index}>{paragraph.trim()}</p> : null
							))}
						</div>
						{p.badgeContent && (
							<div className="flex items-center gap-6 p-6 bg-white rounded-xl shadow-sm border border-outline-variant">
								<div className="text-secondary">
									<span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>
										{p.badgeContent.icon}
									</span>
								</div>
								<div>
									<p className="font-label-md text-primary">{p.badgeContent.label}</p>
									<p className="text-on-surface-variant text-label-sm">{p.badgeContent.subtitle}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

export default function StaticPage() {
	return (
		<TenantThemeProvider config={themeConfig}>
			<StoreConfigProvider initialConfig={{ name: "Ebanistería El Calvo" }}>
				<NavigationClient props={nav} />
				<main className="flex-1 w-full">
					<LandingHero
						title={hero.title}
						subtitle={hero.subtitle}
						badge={hero.badge}
						bgImage={hero.bgImage}
						ctaLabel={hero.ctaLabel}
						ctaHref={hero.ctaHref}
					/>
					<ServicesGridStatic />
					<ArtisanShowcaseStatic />
					<LandingGallery
						title={gallery.title}
						subtitle={gallery.subtitle}
						description={gallery.description}
						images={gallery.images}
					/>
					<LocationHoursStatic />
					<ContactFormClient props={contact} />
				</main>
				<FooterClient props={footer} />
			</StoreConfigProvider>
		</TenantThemeProvider>
	);
}


