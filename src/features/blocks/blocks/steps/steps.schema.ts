import type { BlockSchema } from "../../types/schema";

export interface StepsBlockProps {
	title: string;
	subtitle: string;
	steps: Array<{ step: string; title: string; desc: string }>;
}

export const stepsSchema: BlockSchema = {
	type: "steps",
	label: "Cómo funciona",
	icon: "🪜",
	description: "Pasos numerados con botón final.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Compra en 3 pasos" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Cómo comprar" },
		{
			key: "steps",
			label: "Pasos",
			type: "list",
			fields: [
				{ key: "step", label: "Número", type: "text", default: "1" },
				{ key: "title", label: "Título", type: "text", required: true },
				{ key: "desc", label: "Descripción", type: "textarea" },
			],
		},
	],
};

export const stepsDefaultProps: StepsBlockProps = {
	title: "Compra en 3 pasos",
	subtitle: "Cómo comprar",
	steps: [
		{ step: "1", title: "Elige tu producto", desc: "Explora productos por categoría." },
		{ step: "2", title: "Compra segura", desc: "Paga con tu método favorito." },
		{ step: "3", title: "Recibe en casa", desc: "Envío rápido con seguimiento." },
	],
};
