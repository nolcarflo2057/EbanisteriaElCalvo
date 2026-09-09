import type { BlockSchema } from "../../types/schema";

export interface NavbarMinimalProps {
	logoImage: string;
	logoAlt: string;
	logoText: string;
	links: { label: string; href: string; }[];
	ctaLabel: string;
	ctaHref: string;
}

export const navbarMinimalSchema: BlockSchema = {
	type: "navbar-minimal",
	label: "Navegación Minimalista (Dark Luxury)",
	icon: "🧭",
	description: "Barra de navegación superior tipo glassmorphism con logotipo, enlaces de anclaje y botón CTA estilizado. Móvil: logo compacto + toggle de menú; md+: enlaces y CTA visibles.",
	fields: [
		{ key: "logoImage", label: "Logotipo (Imagen)", type: "image", required: true, default: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI_WdlDBP_BS4vCw3WXEG1K0CO-zTFxGzK8i6gV-v3SeD39b5RfVHrucF1pCjsxaGmQQcBVKcKTAd2ogBVh_5YFn5pIkPrkTecSDgasN5FOM1qROf-OwcZB-7D2NaQ5ehcre4URacMq586B6fM_Gsd_lDuo2YR_sp9zK0lL4hB2uj8QJDjxNw3l3411MfYb3akcAZRuayweV-yi8JURyV7QAs4ijMlpO7usAPVdxPlppPVEfBiUqcHyxUGca32iyPd5w" },
		{ key: "logoAlt", label: "Texto alternativo logo", type: "text", default: "Ebanisteria El Calvo Logo, minimal" },
		{ key: "logoText", label: "Logotipo (Texto)", type: "text", required: true, default: "EBANISTERIA EL CALVO" },
		{
			key: "links", label: "Enlaces", type: "list",
			fields: [
				{ key: "label", label: "Texto del enlace", type: "text", required: true },
				{ key: "href", label: "Destino (URL)", type: "text", required: true }
			]
		},
		{ key: "ctaLabel", label: "Botón Principal", type: "text", required: true, default: "SOLICITAR COTIZACIÓN" },
		{ key: "ctaHref", label: "Destino del botón", type: "text", default: "#contacto" }
	]
};

export const navbarMinimalDefaultProps: NavbarMinimalProps = {
	logoImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI_WdlDBP_BS4vCw3WXEG1K0CO-zTFxGzK8i6gV-v3SeD39b5RfVHrucF1pCjsxaGmQQcBVKcKTAd2ogBVh_5YFn5pIkPrkTecSDgasN5FOM1qROf-OwcZB-7D2NaQ5ehcre4URacMq586B6fM_Gsd_lDuo2YR_sp9zK0lL4hB2uj8QJDjxNw3l3411MfYb3akcAZRuayweV-yi8JURyV7QAs4ijMlpO7usAPVdxPlppPVEfBiUqcHyxUGca32iyPd5w",
	logoAlt: "Ebanisteria El Calvo Logo, minimal",
	logoText: "EBANISTERIA EL CALVO",
	links: [
		{ label: "FILOSOFÍA", href: "#filosofia" },
		{ label: "SERVICIOS", href: "#servicios" },
		{ label: "ESTUDIO", href: "#estudio" },
		{ label: "CONTACTO", href: "#contacto" }
	],
	ctaLabel: "SOLICITAR COTIZACIÓN",
	ctaHref: "#contacto"
};