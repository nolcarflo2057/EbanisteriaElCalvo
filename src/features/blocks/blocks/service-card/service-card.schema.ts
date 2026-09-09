import type { BlockSchema } from "../../types/schema";

export interface ServiceCardBlockProps {
	icon: string;
	title: string;
	description: string;
	iconBg?: string;
}

export const serviceCardSchema: BlockSchema = {
	type: "serviceCard",
	label: "Tarjeta de Servicio",
	icon: "🛠️",
	description: "Tarjeta individual de servicio con icono, título y descripción.",
	fields: [
		{
			key: "icon",
			label: "Icono (Material Symbol)",
			type: "text",
			default: "auto_fix",
			placeholder: "ej: auto_fix, format_paint, chair, door_front",
		},
		{
			key: "title",
			label: "Título",
			type: "text",
			required: true,
			default: "Restauración",
		},
		{
			key: "description",
			label: "Descripción",
			type: "textarea",
			default: "Recuperamos el alma de tus muebles antiguos con técnicas artesanales expertas.",
		},
		{
			key: "iconBg",
			label: "Color de fondo del icono",
			type: "color",
			default: "#442a22",
		},
	],
};

export const serviceCardDefaultProps: ServiceCardBlockProps = {
	icon: "auto_fix",
	title: "Restauración",
	description: "Recuperamos el alma de tus muebles antiguos con técnicas artesanales expertas.",
	iconBg: "#442a22",
};
