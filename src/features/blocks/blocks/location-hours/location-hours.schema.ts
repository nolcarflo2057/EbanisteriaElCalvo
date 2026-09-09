import type { BlockSchema } from "../../types/schema";

export interface LocationHoursBlockProps {
	icon: string;
	title: string;
	description: string;
	address?: string;
	schedule?: string;
	phone?: string;
	email?: string;
	mapEmbedUrl?: string;
	directionsUrl?: string;
	background?: "primary" | "secondary" | "light" | "dark";
}

export const locationHoursSchema: BlockSchema = {
	type: "locationHours",
	label: "Ubicación y Horarios",
	icon: "📍",
	description:
		"Sección con ubicación, horarios y contacto. La dirección, el teléfono y el horario se toman de la configuración White-Label (fuente única de verdad); el mapa y el enlace 'Cómo llegar' se configuran aquí.",
	fields: [
		{ key: "icon", label: "Icono (Material Symbol)", type: "text", default: "location_on" },
		{ key: "title", label: "Título", type: "text", required: true, default: "Ubicados en el Barrio Perla del Sur" },
		{ key: "description", label: "Descripción", type: "textarea", default: "Servicio local, calidad artesanal. Orgullosos de ser el taller de confianza para las familias de nuestra región." },
		{ key: "email", label: "Email (opcional, no está en White-Label)", type: "text", placeholder: "contacto@elcalvo.com" },
		{
			key: "mapEmbedUrl",
			label: "Mapa (Google Maps Embed URL)",
			type: "text",
			placeholder: "https://maps.google.com/maps?q=...&output=embed",
			help: "Opcional. URL del mapa embebido de Google. Si se deja vacío, el bloque no muestra mapa.",
		},
		{
			key: "directionsUrl",
			label: "Enlace 'Cómo llegar'",
			type: "text",
			placeholder: "https://www.google.com/maps/dir/?api=1&destination=...",
			help: "Opcional. URL a la que apunta el botón Cómo llegar.",
		},
		{
			key: "background",
			label: "Fondo",
			type: "select",
			options: [
				{ value: "primary", label: "Primario (oscuro)" },
				{ value: "secondary", label: "Secundario" },
				{ value: "light", label: "Claro" },
				{ value: "dark", label: "Oscuro" },
			],
			default: "primary",
		},
	],
};

export const locationHoursDefaultProps: LocationHoursBlockProps = {
	icon: "location_on",
	title: "Ubicados en el Barrio Perla del Sur",
	description: "Servicio local, calidad artesanal. Orgullosos de ser el taller de confianza para las familias de nuestra región.",
	background: "primary",
};
