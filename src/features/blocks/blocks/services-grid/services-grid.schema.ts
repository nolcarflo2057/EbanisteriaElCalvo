import type { BlockSchema } from "../../types/schema";

export interface ServicesGridBlockProps {
	title: string;
	subtitle: string;
	services: Array<{
		icon: string;
		title: string;
		description: string;
		iconBg?: string;
	}>;
	columns?: 2 | 3 | 4;
}

export const servicesGridSchema: BlockSchema = {
	type: "servicesGrid",
	label: "Grid de Servicios (Bento)",
	icon: "🧱",
	description: "Grid de tarjetas de servicio con iconos, estilo bento.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Nuestra Especialidad" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Servicios de Ebanistería de Elite" },
		{
			key: "columns",
			label: "Columnas",
			type: "select",
			options: [
				{ value: "2", label: "2 columnas" },
				{ value: "3", label: "3 columnas" },
				{ value: "4", label: "4 columnas" },
			],
			default: "4",
		},
		{
			key: "services",
			label: "Servicios",
			type: "list",
			fields: [
				{ key: "icon", label: "Icono (Material Symbol)", type: "text", default: "auto_fix", placeholder: "ej: auto_fix, format_paint, chair" },
				{ key: "title", label: "Título", type: "text", required: true },
				{ key: "description", label: "Descripción", type: "textarea" },
				{ key: "iconBg", label: "Color fondo icono", type: "color", default: "#442a22" },
			],
		},
	],
};

export const servicesGridDefaultProps: ServicesGridBlockProps = {
	title: "Servicios de Ebanistería de Elite",
	subtitle: "Nuestra Especialidad",
	columns: 4,
	services: [
		{
			icon: "auto_fix",
			title: "Restauración",
			description: "Recover the soul of your antique furniture with meticulous hand-craft techniques.",
			iconBg: "#442a22",
		},
		{
			icon: "format_paint",
			title: "Pintura y Lacado",
			description: "Professional finishes and durable coatings that last a lifetime in your home.",
			iconBg: "#442a22",
		},
		{
			icon: "chair",
			title: "Tapicería",
			description: "Comfort and style combined with premium fabrics carefully selected for your sofas.",
			iconBg: "#442a22",
		},
		{
			icon: "door_front",
			title: "Puertas para el Hogar",
			description: "Security and architectural beauty for your entrance and interior spaces.",
			iconBg: "#442a22",
		},
	],
};
