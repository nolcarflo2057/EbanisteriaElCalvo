import type { BlockSchema } from "../../types/schema";

export interface ContainerBlockProps {
	columns: 1 | 2 | 3 | 4;
	gap: "sm" | "md" | "lg" | "xl";
	background?: "light" | "dark" | "accent" | "transparent";
	padding?: "sm" | "md" | "lg" | "xl";
	customClasses?: string;
	children?: React.ReactNode;
}

export const containerSchema: BlockSchema = {
	type: "container",
	label: "Contenedor / Sección",
	icon: "📦",
	description: "Sección contenedora que acepta bloques hijos en columnas (grid).",
	fields: [
		{
			key: "columns",
			label: "Columnas",
			type: "select",
			required: true,
			options: [
				{ value: "1", label: "1 columna" },
				{ value: "2", label: "2 columnas" },
				{ value: "3", label: "3 columnas" },
				{ value: "4", label: "4 columnas" },
			],
			default: "2",
		},
		{
			key: "gap",
			label: "Espaciado entre columnas",
			type: "select",
			options: [
				{ value: "sm", label: "Pequeño (gap-4)" },
				{ value: "md", label: "Mediano (gap-6)" },
				{ value: "lg", label: "Grande (gap-8)" },
				{ value: "xl", label: "Extra grande (gap-12)" },
			],
			default: "md",
		},
		{
			key: "background",
			label: "Fondo",
			type: "select",
			options: [
				{ value: "transparent", label: "Transparente" },
				{ value: "light", label: "Claro (surface)" },
				{ value: "dark", label: "Oscuro (primary)" },
				{ value: "accent", label: "Acento" },
			],
			default: "transparent",
		},
		{
			key: "padding",
			label: "Padding vertical",
			type: "select",
			options: [
				{ value: "sm", label: "Pequeño (py-8)" },
				{ value: "md", label: "Mediano (py-12)" },
				{ value: "lg", label: "Grande (py-20)" },
				{ value: "xl", label: "Extra grande (py-28)" },
			],
			default: "md",
		},
		{
			key: "customClasses",
			label: "Clases Tailwind personalizadas",
			type: "text",
			placeholder: "ej: bg-gradient-to-r from-primary to-accent",
		},
	],
};

export const containerDefaultProps: ContainerBlockProps = {
	columns: 2,
	gap: "md",
	background: "transparent",
	padding: "md",
};
