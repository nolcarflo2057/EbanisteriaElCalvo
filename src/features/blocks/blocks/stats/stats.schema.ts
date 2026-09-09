import type { BlockSchema } from "../../types/schema";
import type { StatItem } from "@/features/landing/components/landing-stats";

export interface StatsBlockProps {
	title: string;
	stats: StatItem[];
}

export const statsSchema: BlockSchema = {
	type: "stats",
	label: "Cifras destacadas",
	icon: "📊",
	description: "Fila de números grandes con etiqueta.",
	fields: [
		{ key: "title", label: "Título", type: "text", default: "Nuestros números" },
		{
			key: "stats",
			label: "Cifras",
			type: "list",
			fields: [
				{ key: "value", label: "Valor", type: "text", required: true, placeholder: "10 años" },
				{ key: "label", label: "Etiqueta", type: "text", required: true, placeholder: "De experiencia" },
			],
		},
	],
};

export const statsDefaultProps: StatsBlockProps = {
	title: "Nuestros números",
	stats: [
		{ value: "10+", label: "Años de experiencia" },
		{ value: "500+", label: "Clientes felices" },
		{ value: "1k+", label: "Proyectos entregados" },
		{ value: "4.9", label: "Calificación promedio" },
	],
};
