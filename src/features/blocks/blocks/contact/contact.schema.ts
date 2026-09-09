import type { BlockSchema } from "../../types/schema";

export interface ContactBlockProps {
	title: string;
	subtitle?: string;
	mode?: "whatsapp" | "form";
	whatsapp?: string;
	email?: string;
	address?: string;
	hours?: string;
	ctaLabel: string;
	formTitle?: string;
	formButtonLabel?: string;
	services?: { name: string }[];
}

export const contactSchema: BlockSchema = {
	type: "contact",
	label: "Contacto",
	icon: "📞",
	description: "Tarjetas de contacto con WhatsApp, formulario de leads, correo y dirección.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Contáctanos" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Estamos para ayudarte" },
		{
			key: "mode",
			label: "Modo de contacto",
			type: "select",
			default: "form",
			options: [
				{ value: "whatsapp", label: "Solo WhatsApp" },
				{ value: "form", label: "Formulario de contactos (leads)" },
			],
		},
		{ key: "whatsapp", label: "WhatsApp", type: "text", placeholder: "573001234567" },
		{ key: "email", label: "Correo", type: "text", placeholder: "hola@tienda.com" },
		{ key: "address", label: "Dirección", type: "text" },
		{ key: "hours", label: "Horario", type: "text", placeholder: "Lun a Vie 9:00 - 18:00" },
		{ key: "ctaLabel", label: "Texto del botón WhatsApp", type: "text", default: "Escríbenos por WhatsApp" },
		{ key: "formTitle", label: "Título del formulario", type: "text", default: "Déjanos un mensaje" },
		{ key: "formButtonLabel", label: "Texto del botón del formulario", type: "text", default: "Enviar mensaje" },
		{
			key: "services",
			label: "Servicios de interés (opcional)",
			type: "list",
			fields: [
				{ key: "name", label: "Nombre del servicio", type: "text", required: true },
			],
		},
	],
};

export const contactDefaultProps: ContactBlockProps = {
	title: "Contáctanos",
	subtitle: "Estamos para ayudarte",
	mode: "form",
	whatsapp: "573001234567",
	email: "hola@tienda.com",
	ctaLabel: "Escríbenos por WhatsApp",
	formTitle: "Déjanos un mensaje",
	formButtonLabel: "Enviar mensaje",
	services: [],
};
