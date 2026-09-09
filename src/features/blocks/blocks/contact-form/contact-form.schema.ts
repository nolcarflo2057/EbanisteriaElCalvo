import type { BlockSchema } from "../../types/schema";

export interface ContactFormBlockProps {
	title: string;
	description: string;
	benefits: Array<{ icon: string; text: string }>;
	fields: Array<{
		key: string;
		label: string;
		type: "text" | "tel" | "email" | "select" | "textarea";
		placeholder?: string;
		required?: boolean;
		options?: string; // JSON string for select options
	}>;
	submitLabel: string;
	submitEndpoint?: string;
	background?: "light" | "dark";
	leftBackground?: "primary" | "secondary";
}

export interface ContactFormBlockState {
	status: "idle" | "submitting" | "success" | "error";
	message: string;
}

export const contactFormSchema: BlockSchema = {
	type: "contactForm",
	label: "Formulario de Contacto",
	icon: "📝",
	description: "Formulario de contacto dividido con panel informativo lateral.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Pide tu presupuesto" },
		{ key: "description", label: "Descripción", type: "textarea", default: "Cuéntanos sobre tu proyecto. Ya sea una silla familiar o todas las puertas de tu casa, te daremos una valoración honesta y profesional." },
		{
			key: "leftBackground",
			label: "Fondo panel izquierdo",
			type: "select",
			options: [
				{ value: "primary", label: "Primario" },
				{ value: "secondary", label: "Secundario" },
			],
			default: "primary",
		},
		{
			key: "benefits",
			label: "Beneficios/Características",
			type: "list",
			fields: [
				{ key: "icon", label: "Icono (Material Symbol)", type: "text", default: "check_circle" },
				{ key: "text", label: "Texto", type: "text", required: true },
			],
		},
		{
			key: "fields",
			label: "Campos del formulario",
			type: "list",
			fields: [
				{ key: "key", label: "Clave (name)", type: "text", required: true },
				{ key: "label", label: "Etiqueta", type: "text", required: true },
				{ key: "type", label: "Tipo", type: "select", options: [
					{ value: "text", label: "Texto" },
					{ value: "tel", label: "Teléfono" },
					{ value: "email", label: "Email" },
					{ value: "select", label: "Selector" },
					{ value: "textarea", label: "Área de texto" },
				], default: "text" },
				{ key: "placeholder", label: "Placeholder", type: "text" },
				{ key: "required", label: "Requerido", type: "boolean", default: true },
				{ key: "options", label: "Opciones (para select, JSON)", type: "textarea", placeholder: '[{"value":"restauracion","label":"Restauración"}]' },
			],
		},
		{ key: "submitLabel", label: "Texto botón enviar", type: "text", default: "Enviar Solicitud" },
		{ key: "submitEndpoint", label: "Endpoint de envío", type: "text", placeholder: "/api/contact" },
	],
};

export const contactFormDefaultProps: ContactFormBlockProps = {
	title: "Pide tu presupuesto",
	description: "Cuéntanos sobre tu proyecto. Ya sea una silla familiar o todas las puertas de tu casa, te daremos una valoración honesta y profesional.",
	leftBackground: "primary",
	benefits: [
		{ icon: "check_circle", text: "Presupuestos detallados sin compromiso" },
		{ icon: "check_circle", text: "Materiales de primera calidad" },
		{ icon: "check_circle", text: "Transporte propio disponible" },
	],
	fields: [
		{ key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Juan Pérez", required: true },
		{ key: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "600 000 000", required: true },
		{ key: "servicio", label: "Servicio interesado", type: "select", placeholder: "Selecciona un servicio", required: true, options: JSON.stringify([
			{ value: "restauracion", label: "Restauración" },
			{ value: "pintura", label: "Pintura y Lacado" },
			{ value: "tapiceria", label: "Tapicería" },
			{ value: "puertas", label: "Puertas" },
		]) },
		{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos un poco sobre el mueble...", required: false },
	],
	submitLabel: "Enviar Solicitud",
};
