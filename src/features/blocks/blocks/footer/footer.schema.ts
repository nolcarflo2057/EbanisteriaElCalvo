import type { BlockSchema } from "../../types/schema";

export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterLinkGroup {
	title: string;
	links: FooterLink[];
}

export interface FooterBlockProps {
	logo?: string;
	brand?: string;
	tagline?: string;
	copyright?: string;
	/** Legacy: enlaces planos. El editor usa `linkGroups`; se conserva para retrocompatibilidad. */
	links?: FooterLink[];
	linkGroups?: FooterLinkGroup[];
	iconButtons?: Array<{ icon: string; href: string; label: string }>;
}

export const footerSchema: BlockSchema = {
	type: "footer",
	label: "Pie de página",
	icon: "🦶",
	description: "Footer con marca, eslogan, grupos de enlaces e iconos de contacto.",
	fields: [
		{ key: "brand", label: "Marca", type: "text", default: "El Calvo" },
		{ key: "tagline", label: "Eslogan / Tagline", type: "text", default: "Muebles con alma, hechos a mano." },
		{ key: "copyright", label: "Copyright", type: "text", default: "© 2024 Ebanistería El Calvo. Perla del Sur." },
		{
			key: "linkGroups",
			label: "Grupos de enlaces",
			type: "list",
			fields: [
				{ key: "title", label: "Título del grupo", type: "text", default: "Navegación" },
				{
					key: "links",
					label: "Enlaces del grupo",
					type: "list",
					fields: [
						{ key: "label", label: "Texto", type: "text", required: true },
						{ key: "href", label: "Enlace", type: "text" },
					],
				},
			],
		},
		{
			key: "iconButtons",
			label: "Botones de icono",
			type: "list",
			fields: [
				{ key: "icon", label: "Icono (Material Symbol)", type: "text", default: "share" },
				{ key: "href", label: "Enlace", type: "text" },
				{ key: "label", label: "Atributo aria/title", type: "text" },
			],
		},
	],
	defaultProps: {
		brand: "El Calvo",
		tagline: "Muebles con alma, hechos a mano.",
		copyright: "© 2024 Ebanistería El Calvo. Perla del Sur.",
		linkGroups: [
			{
				title: "Navegación",
				links: [
					{ label: "Servicios", href: "#servicios" },
					{ label: "Galería", href: "#galeria" },
					{ label: "Contacto", href: "#contacto" },
				],
			},
			{
				title: "Legal",
				links: [
					{ label: "Privacidad", href: "/p/privacidad" },
					{ label: "Términos", href: "/p/terminos" },
				],
			},
		],
		iconButtons: [
			{ icon: "share", href: "#", label: "Compartir" },
			{ icon: "call", href: "#contacto", label: "Llamar" },
		],
	},
};

export const footerDefaultProps: FooterBlockProps = {
	brand: "El Calvo",
	tagline: "Muebles con alma, hechos a mano.",
	copyright: "© 2024 Ebanistería El Calvo. Perla del Sur.",
	linkGroups: [
		{
			title: "Navegación",
			links: [
				{ label: "Servicios", href: "#servicios" },
				{ label: "Galería", href: "#galeria" },
				{ label: "Contacto", href: "#contacto" },
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Privacidad", href: "/p/privacidad" },
				{ label: "Términos", href: "/p/terminos" },
			],
		},
	],
	iconButtons: [
		{ icon: "share", href: "#", label: "Compartir" },
		{ icon: "call", href: "#contacto", label: "Llamar" },
	],
};
