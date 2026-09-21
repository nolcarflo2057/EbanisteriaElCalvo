import Image from "next/image";
import { StoreConfigProvider } from "@/features/stores/components/StoreConfigProvider";
import { NavigationClient } from "@/features/blocks/blocks/navigation/navigation-client";
import { LandingHero } from "@/features/landing/components/landing-hero/landing-hero";
import { LandingGallery } from "@/features/landing/components/landing-gallery/landing-gallery";
import { FooterClient } from "@/features/blocks/blocks/footer/footer-client";
import { ContactFormClient } from "@/features/blocks/blocks/contact-form/contact-form-client";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

import { cn } from "@/shared/utils/cn";
import {
	nav, hero, services, artisan, gallery, location, contact, footer,
} from "./mock-data";
import type { TenantThemeConfig } from "@/core/tenant/tenant-theme.types";
import { ServicesGridStatic } from "./ServicesGridStatic";
import { ArtisanShowcaseStatic } from "./ArtisanShowcaseStatic";
import { LocationHoursStatic } from "./LocationHoursStatic";

const themeConfig: TenantThemeConfig = {
	buttonStyle: "rounded",
	navbarStyle: "glass",
	widgetShape: "circle",
	colorScheme: { primary: "#B45309", secondary: "#F4F4F5", accent: "#EA580C" },
};

export default function StaticPage() {
	return (
		<StoreConfigProvider initialConfig={{ name: "Ebanistería El Calvo" }}>
			<NavigationClient props={nav} />
			<main id="main-content" className="flex-1 w-full">
				<LandingHero
					title={hero.title}
					subtitle={hero.subtitle}
					badge={hero.badge}
					bgImage={hero.bgImage}
					ctaLabel={hero.ctaLabel}
					ctaHref={hero.ctaHref}
				/>
				<ScrollReveal>
					<ServicesGridStatic {...services} />
				</ScrollReveal>
				<ScrollReveal>
					<ArtisanShowcaseStatic {...artisan} />
				</ScrollReveal>
				<ScrollReveal>
					<LandingGallery
						title={gallery.title}
						subtitle={gallery.subtitle}
						description={gallery.description}
						images={gallery.images}
					/>
				</ScrollReveal>
				<ScrollReveal>
					<LocationHoursStatic {...location} />
				</ScrollReveal>
				<ScrollReveal>
					<ContactFormClient props={contact} />
				</ScrollReveal>
			</main>
			<FooterClient props={footer} />
		</StoreConfigProvider>
	);
}