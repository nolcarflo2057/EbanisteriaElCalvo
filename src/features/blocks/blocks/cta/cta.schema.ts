import type { BlockSchema } from "../../types/schema";

export interface CtaBlockProps {
	title: string;
	subtitle: string;
	cta?: { label?: string; href?: string };
	bgImage?: string;
}

export const ctaSchema: BlockSchema = {
	type: "cta",
	label: "Llamada a la acción",
	icon: "🎯",
	description: "Banda promocional con imagen de fondo y botón.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "¿Listo para empezar?" },
		{ key: "subtitle", label: "Subtítulo", type: "textarea", default: "Únete a miles de clientes satisfechos." },
		{ key: "bgImage", label: "Imagen de fondo", type: "image" },
		{
			key: "cta",
			label: "Botón",
			type: "group",
			fields: [
				{ key: "label", label: "Texto", type: "text", default: "Comenzar ahora" },
				{ key: "href", label: "Enlace", type: "text", default: "/products" },
			],
		},
	],
};

export const ctaDefaultProps: CtaBlockProps = {
	title: "¿Listo para empezar?",
	subtitle: "Únete a miles de clientes satisfechos.",
	cta: { label: "Comenzar ahora", href: "/products" },
};
