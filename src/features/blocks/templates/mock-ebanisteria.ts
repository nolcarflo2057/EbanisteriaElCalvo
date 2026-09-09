import type { NavigationBlockProps } from "../blocks/navigation/navigation.schema";
import type { HeroBlockProps } from "../blocks/hero/hero.schema";
import type { ServicesGridBlockProps } from "../blocks/services-grid/services-grid.schema";
import type { ArtisanShowcaseBlockProps } from "../blocks/artisan-showcase/artisan-showcase.schema";
import type { GalleryBlockProps } from "../blocks/gallery/gallery.schema";
import type { LocationHoursBlockProps } from "../blocks/location-hours/location-hours.schema";
import type { ContactFormBlockProps } from "../blocks/contact-form/contact-form.schema";
import type { FooterBlockProps } from "../blocks/footer/footer.schema";

export const BRAND = "Ebanistería El Calvo";

export const navigationProps: NavigationBlockProps = {
	brand: BRAND,
	ctaLabel: "Pedir Presupuesto",
	ctaHref: "#contacto",
	links: [
		{ label: "Servicios", href: "#servicios" },
		{ label: "Galería", href: "#galeria" },
		{ label: "Contacto", href: "#contacto" },
	],
};

export const heroProps: HeroBlockProps = {
	title: "Transformamos tus muebles con alegría y maestría",
	subtitle:
		"En el corazón de Perla del Sur, devolvemos la vida a tus puertas, sillas y sofás con técnicas expertas de restauración, pintura y tapicería.",
	ctaLabel: "Contáctanos ahora",
	ctaHref: "#contacto",
	bgImage:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuDsf2gE4yozlKT3nJY-WKWevRPgwid8Twb_v15Hb8p0_47EdMm6ZsFoaYse4r730ChsgzFpkRKl-YEO2sbr16j9mHBv8TBo7NkxoTGEdV5SIijNTAbAQtpWsleml352OW4FP7pDVJ8BUufQr1jLFPxIiFaG4wfezZR6_RkxvbSi_NxgVGpGBQmAbSzCfzdBz39Kddc81wJgxb-y4ppQDPmExZxOWIO9n8fzYZub3wB7p8tvNlpPKAxnhw",
	bgAlt: "Taller de ebanistería con muebles en restauración",
	badge: "Ebanistería artesanal",
};

export const servicesGridProps: ServicesGridBlockProps = {
	title: "Servicios de Ebanistería de Elite",
	subtitle: "Nuestra Especialidad",
	columns: 4,
	services: [
		{
			icon: "auto_fix",
			title: "Restauración",
			description:
				"Recupera el alma de tus muebles antiguos con técnicas manuales meticulosas.",
			iconBg: "#442a22",
		},
		{
			icon: "format_paint",
			title: "Pintura y Lacado",
			description:
				"Acabados profesionales y revestimientos duraderos que duran toda la vida en tu hogar.",
			iconBg: "#442a22",
		},
		{
			icon: "chair",
			title: "Tapicería",
			description:
				"Comodidad y estilo combinados con telas premium cuidadosamente seleccionadas para tus sofás.",
			iconBg: "#442a22",
		},
		{
			icon: "door_front",
			title: "Puertas para el Hogar",
			description:
				"Seguridad y belleza arquitectónica para tu entrada y espacios interiores.",
			iconBg: "#442a22",
		},
	],
};

export const artisanShowcaseProps: ArtisanShowcaseBlockProps = {
	layout: "image-left",
	image:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuCWuBIsFR8zv9780y07s7r3cpOiLDqijZyyCWfJdO9VEpbei7ulqnJ_mpc2ceZpATf5U_g3HZg5GXG8sNFECLlhAncUO8GOqSInW6vaSDmeA_BCSfSF7vJxseHe_KFxUhrXt7SzZ1rktrhRiSsdksS27uR_1MxUOuorPl634ip5TBFAokrJJzcEjopxnxStbnMgFqY_wDHIrrpKtF0nnY4MqboXOod2lv0Bq9mPNEXgC3Ms97GYm5Nd2A",
	imageAlt: "Maestro ebanista trabajando en taller iluminado por luz natural",
	badge: "El Maestro Detrás del Arte",
	title: "Conoce a El Calvo: pasión por el arte de la madera",
	description:
		"Más que restauración, es amor por cada detalle. Con décadas de experiencia sirviendo a nuestra comunidad, entendemos que cada mueble cuenta una historia. Nuestra misión es preservar ese legado con la paciencia y el respeto que la madera noble merece.",
	background: "light",
	badgeContent: {
		icon: "verified",
		label: "Certificación Artesanal",
		subtitle: "Garantía de calidad en cada pieza restaurada.",
	},
};

export const galleryProps: GalleryBlockProps = {
	title: "Nuestra Galería",
	subtitle: "Portafolio",
	description:
		"Cada pieza es un testimonio de nuestra dedicación a la excelencia y el respeto por la tradición maderera.",
	images: [
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIWSbNpdYuImq7LIX9EGms5YmXdaAaMi7K1w0FAZKhfd8v6YGJKlVU_GzcKcuS262kfz5ien3wZdkZaywFPfsWpOtcn4LWvIOqjJaLXiysGA5CSkwBWFR_C_qorCheNCLJWArK822-eFV3khp2gaqfx11VRmYKhJbsdakffr2EvfqV4Nq6JumDeeUejLj0sPDCLw1L74ZG7SVZiVlzJGIMuj0zt69ZAEiG4QQRrBXNfbJzjVxzqlYZ0Q",
			label: "Silla Luis XV Restaurada",
			alt: "Silla antigua restaurada",
		},
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkYvxFes9gGFFf67bAoha-bm9f0g5k5sLB4A0R9ZRgUHeILZnYpNJnOr_34GFYyrBhLWlFSyNubmJR7vzKaX-3wPtRbJrqDxZhq5mqEP50ab_d5Qo5MG0kJZSKJB32eDNB_52N--u3JQo9vOH-LOSfyFXEzu32YkT88dPkqPql1QMtjyL-ttRW2beYNoWlBvqxb7Pmru8wOqDV7Fs-l0c4LWSWb7cU_P7LWlNQ7SvVWsiEQd_3I9gpfA",
			label: "Puerta de Roble Macizo",
			alt: "Puerta de madera a medida",
		},
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwqJZUz_Kps1FldNayNaMjB5TTGdolJLE247qr_mtpoh8uR306AhkQlZtjYXr9qorrFerj9hn_ascN95TTkOKN1pYTs5yV_PLBNdlMXkaCwb03LN5CbPzerlPbybMAmy7tg2q3LOUaCoCGa107DTeZI29XZbCDfaFNCS2dEe4fkO0g5nK9ER5yvZ7PBDqHZwE42KogqQBZkzcqApmt5scbpj2RGJZCptCvpx6t9KUx6UzXFu1oVg8r3w",
			label: "Mesa de Comedor en Nogal",
			alt: "Mesa de comedor pulida",
		},
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy35_zxeRLIeMKzx1Rr9Xcyqqy8CmhGId7eAOLSTjyC1irbbo5kkTrXAT5oLFgpjdKELWTT9GyBjZOv_xYGX2jMxF9zPQbU2fQC-ds6U1z9JI87kappw9symlLr5hl97GqvgW5FWksla6SmXZzd6WB4gzlnthLZ2gw4P_Qx4AHwk3ZYABPahWR8cyodpzYkS-Ks5MoE1IoAMeJcVW97SW7NjK1fjV2merSPEZtkOQYg4wFBWrrGCAERg",
			label: "Detalle de Talla Artesanal",
			alt: "Talla detallada en madera",
		},
	],
};

export const locationHoursProps: LocationHoursBlockProps = {
	icon: "location_on",
	title: "Ubicados en el Barrio Perla del Sur",
	description:
		"Servicio local, calidad artesanal. Orgullosos de ser el taller de confianza para las familias de nuestra región.",
	address: "Ebanistería El Calvo, Pereira, Risaralda",
	schedule: "Lunes a Viernes: 9:00 - 18:00",
	phone: "+57 312 760 9748",
	mapEmbedUrl:
		"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.123456789!2d-75.7279!3d4.7857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDcnMDguNiJOIDc1wrA0Myc0MC41Ilc!5e0!3m2!1ses!2sco!4v1710000000000!5m2!1ses!2sco",
	directionsUrl: "https://maps.google.com",
	background: "primary",
};

export const contactFormProps: ContactFormBlockProps = {
	title: "Pide tu presupuesto",
	description:
		"Cuéntanos sobre tu proyecto. Ya sea una silla familiar o todas las puertas de tu casa, te daremos una valoración honesta y profesional.",
	leftBackground: "primary",
	benefits: [
		{ icon: "check_circle", text: "Presupuestos detallados sin compromiso" },
		{ icon: "check_circle", text: "Materiales de primera calidad" },
		{ icon: "check_circle", text: "Transporte propio disponible" },
	],
	fields: [
		{ key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Juan Pérez", required: true },
		{ key: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "600 000 000", required: true },
		{
			key: "servicio",
			label: "Servicio interesado",
			type: "select",
			placeholder: "Selecciona un servicio",
			required: true,
			options: JSON.stringify([
				{ value: "restauracion", label: "Restauración" },
				{ value: "pintura", label: "Pintura y Lacado" },
				{ value: "tapiceria", label: "Tapicería" },
				{ value: "puertas", label: "Puertas" },
			]),
		},
		{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos un poco sobre el mueble...", required: false },
	],
	submitLabel: "Enviar Solicitud",
};

export const footerProps: FooterBlockProps = {
	brand: BRAND,
	tagline: "Muebles con alma, hechos a mano.",
	copyright: `© ${new Date().getFullYear()} ${BRAND}. Perla del Sur.`,
	linkGroups: [
		{
			title: "Navegación",
			links: [
				{ label: "Servicios", href: "#servicios" },
				{ label: "Galería", href: "#galeria" },
				{ label: "Contacto", href: "#contacto" },
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Privacidad", href: "/p/privacidad" },
				{ label: "Términos", href: "/p/terminos" },
			],
		},
	],
	iconButtons: [
		{ icon: "share", href: "#", label: "Compartir" },
		{ icon: "call", href: "#contacto", label: "Llamar" },
	],
};

export const whiteLabelConfig = {
	businessName: BRAND,
	hours: "Lunes a Viernes: 9:00 - 18:00",
	phone: "+57 312 760 9748",
	address: "Ebanistería El Calvo, Pereira, Risaralda",
	extraInfo: "Maestría en Madera",
	whatsappNumber: "573127609748",
	whatsappMessage: "Hola, me gustaría pedir un presupuesto...",
	showWhatsapp: true,
	showChatbot: false,
};
