import type { BlockSchema } from "../../types/schema";

export interface HeroBlockProps {
	title: string;
	subtitle: string;
	ctaLabel: string;
	ctaHref: string;
	bgImage: string;
	bgAlt?: string;
	badge?: string;
}

export const heroSchema: BlockSchema = {
	type: "hero",
	label: "Hero de portada",
	icon: "🏠",
	description: "Banner principal con imagen de fondo, título y llamada a la acción.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Transformamos tus muebles con alegría y maestría" },
		{ key: "subtitle", label: "Subtítulo", type: "textarea", required: true, default: "En el corazón de Perla del Sur, devolvemos la vida a tus puertas, sillas y sofás con técnicas expertas de restauración, pintura y tapicería." },
		{ key: "badge", label: "Etiqueta", type: "text", placeholder: "Ebanistería artesanal" },
		{ key: "bgImage", label: "Imagen de fondo", type: "image", default: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsf2gE4yozlKT3nJY-WKWevRPgwid8Twb_v15Hb8p0_47EdMm6ZsFoaYse4r730ChsgzFpkRKl-YEO2sbr16j9mHBv8TBo7NkxoTGEdV5SIijNTAbAQtpWsleml352OW4FP7pDVJ8BUufQr1jLFPxIiFaG4wfezZR6_RkxvbSi_NxgVGpGBQmAbSzCfzdBz39Kddc81wJgxb-y4ppQDPmExZxOWIO9n8fzYZub3wB7p8tvNlpPKAxnhw", help: "URL de una imagen de gran resolución (1920x800 aprox.)." },
		{ key: "ctaLabel", label: "Texto del botón", type: "text", default: "Contáctanos ahora" },
		{ key: "ctaHref", label: "Enlace del botón", type: "text", default: "#contacto" },
		{ key: "bgAlt", label: "Texto alternativo imagen", type: "text", placeholder: "Descripción de la imagen de fondo" },
	],
};

export const heroDefaultProps: HeroBlockProps = {
	title: "Transformamos tus muebles con alegría y maestría",
	subtitle: "En el corazón de Perla del Sur, devolvemos la vida a tus puertas, sillas y sofás con técnicas expertas de restauración, pintura y tapicería.",
	bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsf2gE4yozlKT3nJY-WKWevRPgwid8Twb_v15Hb8p0_47EdMm6ZsFoaYse4r730ChsgzFpkRKl-YEO2sbr16j9mHBv8TBo7NkxoTGEdV5SIijNTAbAQtpWsleml352OW4FP7pDVJ8BUufQr1jLFPxIiFaG4wfezZR6_RkxvbSi_NxgVGpGBQmAbSzCfzdBz39Kddc81wJgxb-y4ppQDPmExZxOWIO9n8fzYZub3wB7p8tvNlpPKAxnhw",
	ctaLabel: "Contáctanos ahora",
	ctaHref: "#contacto",
};
