import type { BlockSchema } from "../../types/schema";

export interface NavigationBlockProps {
	brand: string;
	links: Array<{ label: string; href: string }>;
	ctaLabel: string;
	ctaHref: string;
}

export const navigationSchema: BlockSchema = {
	type: "navigation",
	label: "Menú de Navegación (Header)",
	icon: "🧭",
	description: "Barra de navegación superior con marca, enlaces y botón de acción.",
	fields: [
		{ key: "brand", label: "Marca / Nombre", type: "text", required: true, default: "El Calvo" },
		{ key: "ctaLabel", label: "Texto botón acción", type: "text", default: "Pedir Presupuesto" },
		{ key: "ctaHref", label: "Enlace botón acción", type: "text", default: "#contacto" },
		{
			key: "links",
			label: "Enlaces del menú",
			type: "list",
			fields: [
				{ key: "label", label: "Etiqueta", type: "text", required: true },
				{ key: "href", label: "Enlace / ID de sección", type: "text", required: true },
			],
		},
	],
};

export const navigationDefaultProps: NavigationBlockProps = {
	brand: "El Calvo",
	ctaLabel: "Pedir Presupuesto",
	ctaHref: "#contacto",
	links: [
		{ label: "Servicios", href: "#servicios" },
		{ label: "Galería", href: "#galeria" },
		{ label: "Contacto", href: "#contacto" },
	],
};
