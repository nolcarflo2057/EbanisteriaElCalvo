import type {
	VerticalLanding,
	LandingHero,
	LandingFeature,
	LandingStep,
	LandingCta,
	LandingFooter,
	LandingCategoryCard,
} from "@/features/landing/types/landing.types";

// Re-export de tipos para compatibilidad con componentes existentes.
export type MockHero = LandingHero;
export type MockFeature = LandingFeature;
export type MockStep = LandingStep;
export type MockCta = LandingCta;
export type MockFooter = LandingFooter;
export type MockFooterLinkGroup = LandingFooter["linkGroups"][number];
export type MockCategoryCard = LandingCategoryCard;

export interface MockCmsData {
	hero: LandingHero;
	features: LandingFeature[];
	steps: LandingStep[];
	cta: LandingCta;
	footer: LandingFooter;
	categories?: LandingCategoryCard[];
}

/**
 * Landing por defecto, agnóstico de vertical (ni ropa, ni comida, ni electrónica).
 * Cada tienda puede sobrescribirlo en store_verticals.landing.
 */
export const defaultLanding: VerticalLanding = {
	hero: {
		title: "Descubre tu próxima compra",
		subtitle: "Productos cuidadosamente seleccionados con la mejor calidad y al mejor precio.",
		badge: "Tienda online",
		cta: "Ver catálogo",
		ctaHref: "/products",
		bgImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=800&fit=crop&q=80",
	},
	features: [
		{
			icon: "🚚",
			title: "Envío rápido",
			desc: "Recibe tu pedido en 24-48 horas hábiles donde quieras.",
		},
		{
			icon: "✨",
			title: "Calidad garantizada",
			desc: "Productos cuidadosamente seleccionados para tu satisfacción.",
		},
		{
			icon: "🔄",
			title: "Cambios sin costo",
			desc: "¿No te quedó bien? Cambia tu producto sin costo adicional.",
		},
	],
	steps: [
		{ step: "1", title: "Elige tu producto", desc: "Explora productos organizados por categoría." },
		{ step: "2", title: "Compra segura", desc: "Paga con tu método favorito. Tus datos están protegidos." },
		{ step: "3", title: "Recibe en casa", desc: "Envío rápido con seguimiento en tiempo real." },
	],
	cta: {
		title: "¿Listo para empezar?",
		subtitle: "Únete a miles de clientes satisfechos.",
		cta: "Comenzar ahora",
		ctaHref: "/products",
		bgImage: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=1920&q=80",
	},
	footer: {
		brand: "Mi Tienda",
		tagline: "Tu tienda de confianza.",
		linkGroups: [
			{
				title: "Ayuda",
				links: [
					{ label: "Preguntas frecuentes", href: "#" },
					{ label: "Envíos y devoluciones", href: "#" },
					{ label: "Contacto", href: "#" },
				],
			},
			{
				title: "Empresa",
				links: [
					{ label: "Sobre nosotros", href: "#" },
					{ label: "Términos y condiciones", href: "/p/terminos" },
					{ label: "Privacidad", href: "/p/privacidad" },
				],
			},
		],
		social: [
			{ label: "Instagram", href: "#" },
			{ label: "Facebook", href: "#" },
			{ label: "TikTok", href: "#" },
		],
		copyright: "",
	},
};

/** Alias por retrocompatibilidad del export original. */
export const mockCms: MockCmsData = defaultLanding;
