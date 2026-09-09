import type { BlockSchema } from "../../types/schema";

export interface PricingPlanItem {
	name: string;
	price: string;
	period: string;
	description: string;
	features: Array<{ feature: string }>;
	highlighted: boolean;
	ctaLabel: string;
	ctaHref: string;
}

export interface PricingBlockProps {
	title: string;
	subtitle: string;
	plans: PricingPlanItem[];
}

export const pricingSchema: BlockSchema = {
	type: "pricing",
	label: "Precios / Planes",
	icon: "💰",
	description: "Planes con precio, características y CTA. Uno puede destacarse.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Elige tu plan" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Planes y precios" },
		{
			key: "plans",
			label: "Planes",
			type: "list",
			fields: [
				{ key: "name", label: "Nombre", type: "text", required: true },
				{ key: "price", label: "Precio", type: "text", required: true, placeholder: "$99.900" },
				{ key: "period", label: "Periodo", type: "text", placeholder: "/mes" },
				{ key: "description", label: "Descripción", type: "textarea" },
				{
					key: "features",
					label: "Características",
					type: "list",
					fields: [{ key: "feature", label: "Característica", type: "text", required: true }],
				},
				{ key: "highlighted", label: "Destacado (Más popular)", type: "boolean", default: false },
				{ key: "ctaLabel", label: "Texto del botón", type: "text", default: "Elegir plan" },
				{ key: "ctaHref", label: "Enlace del botón", type: "text", default: "#" },
			],
		},
	],
};

export const pricingDefaultProps: PricingBlockProps = {
	title: "Elige tu plan",
	subtitle: "Planes y precios",
	plans: [
		{
			name: "Básico",
			price: "$49.900",
			period: "/mes",
			description: "Para empezar.",
			features: [{ feature: "1 servicio" }, { feature: "Soporte por email" }],
			highlighted: false,
			ctaLabel: "Elegir plan",
			ctaHref: "#",
		},
		{
			name: "Pro",
			price: "$99.900",
			period: "/mes",
			description: "Para crecer.",
			features: [{ feature: "5 servicios" }, { feature: "Soporte prioritario" }, { feature: "Reportes" }],
			highlighted: true,
			ctaLabel: "Elegir plan",
			ctaHref: "#",
		},
		{
			name: "Empresa",
			price: "$199.900",
			period: "/mes",
			description: "Para equipos.",
			features: [{ feature: "Servicios ilimitados" }, { feature: "Soporte 24/7" }, { feature: "Reportes avanzados" }],
			highlighted: false,
			ctaLabel: "Elegir plan",
			ctaHref: "#",
		},
	],
};
