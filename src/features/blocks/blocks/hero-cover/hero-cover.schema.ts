import type { BlockSchema } from "../../types/schema";

export interface HeroCoverProps {
	backgroundImage: string;
	backgroundAlt: string;
	titleLine1: string;
	titleLine2: string;
	description: string;
	primaryCtaLabel: string;
	secondaryCtaLabel: string;
	primaryCtaHref: string;
	secondaryCtaHref: string;
}

export const heroCoverSchema: BlockSchema = {
	type: "hero-cover",
	label: "Hero Portada (Dark Luxury)",
	icon: "🖼️",
	description: "Sección hero a pantalla completa con imagen de fondo dramática, título en dos líneas con acento, resumen y doble CTA. Móvil: layout apilado; md: título display-xl.",
	fields: [
		{ key: "backgroundImage", label: "Imagen de fondo", type: "image", required: true, default: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS8YCDneoqI63LjoxgV0EzQSNCZFPtfOejfkUUyN0HHe3tIdlnnnsFTbVDcYxZ1IrsD_haYrAd0grfe4kQpFthHEx-PdQr3GCkYWeSQu0l7N8LC4eiPQPgT2nxmliVNyDUAQWQ74DFsU0eaaXk1AuVdkOReiypBm1NYZR1oOd5NB_yi7IwufTajCQ4rbFM-Q4s8BCEW--OKAr6BoT8sISMUXV_kdld9cDfL2CLRKdda0CZOIjdkL1e7Etsb5wMYv-zJg" },
		{ key: "backgroundAlt", label: "Texto alternativo imagen", type: "text", default: "A cinematic, dark luxury view of a high-end dental clinic with architectural design. A sleek, modern dental chair sits in a dramatically lit room with dark marble walls. A tray of pristine dental tools rests in the foreground." },
		{ key: "titleLine1", label: "Título (línea 1)", type: "text", required: true, default: "ODONTOLOGÍA" },
		{ key: "titleLine2", label: "Título (línea 2, acento)", type: "text", required: true, default: "ARQUITECTÓNICA." },
		{ key: "description", label: "Descripción", type: "textarea", required: true, default: "Rehabilitación oral y diseño de sonrisa de ultra-precisión. No tratamos pacientes, diseñamos estructuras perfectas. La odontología concebida como alta ingeniería en un entorno de absoluto silencio y privacidad." },
		{ key: "primaryCtaLabel", label: "CTA Principal", type: "text", required: true, default: "VALORACIÓN PRIVADA" },
		{ key: "secondaryCtaLabel", label: "CTA Secundario", type: "text", required: true, default: "NUESTRO MANIFIESTO" },
		{ key: "primaryCtaHref", label: "Destino CTA principal", type: "text", default: "#contacto" },
		{ key: "secondaryCtaHref", label: "Destino CTA secundario", type: "text", default: "#filosofia" }
	]
};

export const heroCoverDefaultProps: HeroCoverProps = {
	backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS8YCDneoqI63LjoxgV0EzQSNCZFPtfOejfkUUyN0HHe3tIdlnnnsFTbVDcYxZ1IrsD_haYrAd0grfe4kQpFthHEx-PdQr3GCkYWeSQu0l7N8LC4eiPQPgT2nxmliVNyDUAQWQ74DFsU0eaaXk1AuVdkOReiypBm1NYZR1oOd5NB_yi7IwufTajCQ4rbFM-Q4s8BCEW--OKAr6BoT8sISMUXV_kdld9cDfL2CLRKdda0CZOIjdkL1e7Etsb5wMYv-zJg",
	backgroundAlt: "A cinematic, dark luxury view of a high-end dental clinic with architectural design. A sleek, modern dental chair sits in a dramatically lit room with dark marble walls. A tray of pristine dental tools rests in the foreground.",
	titleLine1: "ODONTOLOGÍA",
	titleLine2: "ARQUITECTÓNICA.",
	description: "Rehabilitación oral y diseño de sonrisa de ultra-precisión. No tratamos pacientes, diseñamos estructuras perfectas. La odontología concebida como alta ingeniería en un entorno de absoluto silencio y privacidad.",
	primaryCtaLabel: "VALORACIÓN PRIVADA",
	secondaryCtaLabel: "NUESTRO MANIFIESTO",
	primaryCtaHref: "#contacto",
	secondaryCtaHref: "#filosofia"
};