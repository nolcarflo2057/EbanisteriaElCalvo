import type { BlockSchema } from "../../types/schema";
import type { FaqItem } from "@/features/landing/components/landing-faq";

export interface FaqBlockProps {
	title: string;
	subtitle?: string;
	items: FaqItem[];
}

export const faqSchema: BlockSchema = {
	type: "faq",
	label: "Preguntas frecuentes",
	icon: "❓",
	description: "Acordeón de preguntas y respuestas.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Preguntas frecuentes" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Resolvemos tus dudas" },
		{
			key: "items",
			label: "Preguntas",
			type: "list",
			fields: [
				{ key: "question", label: "Pregunta", type: "text", required: true },
				{ key: "answer", label: "Respuesta", type: "textarea", required: true },
			],
		},
	],
};

export const faqDefaultProps: FaqBlockProps = {
	title: "Preguntas frecuentes",
	subtitle: "Resolvemos tus dudas",
	items: [
		{ question: "¿Cuánto tarda el envío?", answer: "Los envíos tardan entre 24 y 72 horas hábiles." },
		{ question: "¿Qué métodos de pago aceptan?", answer: "Aceptamos tarjetas de crédito, débito y pagos en línea." },
		{ question: "¿Puedo cambiar mi pedido?", answer: "Sí, contáctanos dentro de las primeras 24 horas." },
	],
};
