import type { BlockSchema } from "../../types/schema";

export interface FeaturesBlockProps {
	title: string;
	subtitle: string;
	features: Array<{ icon: string; title: string; desc: string }>;
}

export const featuresSchema: BlockSchema = {
	type: "features",
	label: "Por qué elegirnos",
	icon: "✨",
	description: "Grid de características con icono, título y descripción.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "La mejor experiencia de compra" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Por qué elegirnos" },
		{
			key: "features",
			label: "Características",
			type: "list",
			fields: [
				{ key: "icon", label: "Icono (emoji)", type: "text", default: "🚚" },
				{ key: "title", label: "Título", type: "text", required: true },
				{ key: "desc", label: "Descripción", type: "textarea" },
			],
		},
	],
};

export const featuresDefaultProps: FeaturesBlockProps = {
	title: "La mejor experiencia de compra",
	subtitle: "Por qué elegirnos",
	features: [
		{ icon: "🚚", title: "Envío rápido", desc: "Recibe tu pedido en 24-48 horas." },
		{ icon: "✨", title: "Calidad garantizada", desc: "Productos seleccionados." },
		{ icon: "🔄", title: "Cambios sin costo", desc: "Cambia tu producto sin costo." },
	],
};
