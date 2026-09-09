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
	title: "Tus muebles tienen historia. Nosotros les damos una nueva vida",
	subtitle:
		"Rescatamos la historia de tus piezas con acabados de primera. Además, diseñamos y fabricamos soluciones a medida para tu hogar: modernas cocinas integrales, clósets y puertas de alta calidad.",
	ctaLabel: "Contáctanos ahora",
	ctaHref: "#contacto",
	bgImage:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuDsf2gE4yozlKT3nJY-WKWevRPgwid8Twb_v15Hb8p0_47EdMm6ZsFoaYse4r730ChsgzFpkRKl-YEO2sbr16j9mHBv8TBo7NkxoTGEdV5SIijNTAbAQtpWsleml352OW4FP7pDVJ8BUufQr1jLFPxIiFaG4wfezZR6_RkxvbSi_NxgVGpGBQmAbSzCfzdBz39Kddc81wJgxb-y4ppQDPmExZxOWIO9n8fzYZub3wB7p8tvNlpPKAxnhw",
	bgAlt: "Taller de restauración con muebles antiguos",
	badge: "Restauración & Carpintería Arquitectónica",
};

export const servicesGridProps: ServicesGridBlockProps = {
	title: "Nuestros Servicios",
	subtitle: "Lo que hacemos mejor",
	columns: 4,
	services: [
		{
			icon: "auto_fix",
			title: "Restauración de Muebles",
			description:
				"Recuperamos el esplendor de tus muebles y antigüedades respetando su historia y esencia.",
			iconBg: "#442a22",
		},
		{
			icon: "countertops",
			title: "Cocinas Integrales",
			description:
				"Diseñamos y fabricamos la cocina de tus sueños, optimizando cada espacio con acabados modernos y duraderos.",
			iconBg: "#442a22",
		},
		{
			icon: "checkroom",
			title: "Clósets a Medida",
			description:
				"Soluciones de almacenamiento personalizadas que combinan funcionalidad, elegancia y diseño interior.",
			iconBg: "#442a22",
		},
		{
			icon: "door_front",
			title: "Puertas y Acabados",
			description:
				"Fabricación y reparación de puertas, garantizando seguridad y un estilo arquitectónico perfecto para tu hogar.",
			iconBg: "#442a22",
		},
	],
};

export const artisanShowcaseProps: ArtisanShowcaseBlockProps = {
	layout: "image-left",
	image:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuCWuBIsFR8zv9780y07s7r3cpOiLDqijZyyCWfJdO9VEpbei7ulqnJ_mpc2ceZpATf5U_g3HZg5GXG8sNFECLlhAncUO8GOqSInW6vaSDmeA_BCSfSF7vJxseHe_KFxUhrXt7SzZ1rktrhRiSsdksS27uR_1MxUOuorPl634ip5TBFAokrJJzcEjopxnxStbnMgFqY_wDHIrrpKtF0nnY4MqboXOod2lv0Bq9mPNEXgC3Ms97GYm5Nd2A",
	imageAlt: "Maestro restaurador trabajando meticulosamente la madera",
	badge: "El Maestro Detrás de la Magia",
	title: "Conoce a El Calvo: Pasión por darle nueva vida a la madera",
	description:
		"Diseñamos carpintería arquitectónica a medida y rescatamos piezas con historia. Con décadas de experiencia sirviendo a nuestra comunidad, entendemos el valor de un trabajo bien hecho. Nuestra misión es crear espacios únicos y preservar el legado de tus muebles con la paciencia y el cuidado que la buena madera merece.",
	background: "light",
	badgeContent: {
		icon: "verified",
		label: "Expertos en Restauración",
		subtitle: "Garantía de cuidado total en cada pieza intervenida.",
	},
};

export const galleryProps: GalleryBlockProps = {
	title: "Galería de Transformaciones",
	subtitle: "Antes y Después",
	description:
		"Cada pieza restaurada es un testimonio de nuestra dedicación por rescatar la belleza original oculta por el paso del tiempo.",
	images: [
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIWSbNpdYuImq7LIX9EGms5YmXdaAaMi7K1w0FAZKhfd8v6YGJKlVU_GzcKcuS262kfz5ien3wZdkZaywFPfsWpOtcn4LWvIOqjJaLXiysGA5CSkwBWFR_C_qorCheNCLJWArK822-eFV3khp2gaqfx11VRmYKhJbsdakffr2EvfqV4Nq6JumDeeUejLj0sPDCLw1L74ZG7SVZiVlzJGIMuj0zt69ZAEiG4QQRrBXNfbJzjVxzqlYZ0Q",
			label: "Silla Luis XV Restaurada",
			alt: "Silla antigua restaurada",
		},
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkYvxFes9gGFFf67bAoha-bm9f0g5k5sLB4A0R9ZRgUHeILZnYpNJnOr_34GFYyrBhLWlFSyNubmJR7vzKaX-3wPtRbJrqDxZhq5mqEP50ab_d5Qo5MG0kJZSKJB32eDNB_52N--u3JQo9vOH-LOSfyFXEzu32YkT88dPkqPql1QMtjyL-ttRW2beYNoWlBvqxb7Pmru8wOqDV7Fs-l0c4LWSWb7cU_P7LWlNQ7SvVWsiEQd_3I9gpfA",
			label: "Puerta de Roble Recuperada",
			alt: "Puerta de madera antigua recuperada",
		},
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwqJZUz_Kps1FldNayNaMjB5TTGdolJLE247qr_mtpoh8uR306AhkQlZtjYXr9qorrFerj9hn_ascN95TTkOKN1pYTs5yV_PLBNdlMXkaCwb03LN5CbPzerlPbybMAmy7tg2q3LOUaCoCGa107DTeZI29XZbCDfaFNCS2dEe4fkO0g5nK9ER5yvZ7PBDqHZwE42KogqQBZkzcqApmt5scbpj2RGJZCptCvpx6t9KUx6UzXFu1oVg8r3w",
			label: "Mesa de Comedor Refinada",
			alt: "Mesa de comedor pulida y barnizada",
		},
		{
			url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy35_zxeRLIeMKzx1Rr9Xcyqqy8CmhGId7eAOLSTjyC1irbbo5kkTrXAT5oLFgpjdKELWTT9GyBjZOv_xYGX2jMxF9zPQbU2fQC-ds6U1z9JI87kappw9symlLr5hl97GqvgW5FWksla6SmXZzd6WB4gzlnthLZ2gw4P_Qx4AHwk3ZYABPahWR8cyodpzYkS-Ks5MoE1IoAMeJcVW97SW7NjK1fjV2merSPEZtkOQYg4wFBWrrGCAERg",
			label: "Talla Artesanal Limpiada",
			alt: "Talla de madera restaurada cuidadosamente",
		},
	],
};

export const locationHoursProps: LocationHoursBlockProps = {
	icon: "location_on",
	title: "Tu Taller de Confianza en la Perla del Sur",
	description:
		"Ponerte en contacto con nosotros es la mejor decisión que puedes tomar. Déjanos asesorarte en tu próximo proyecto de carpintería.",
	address: "Ebanistería El Calvo, Pereira, Risaralda",
	schedule: "Lunes a Viernes: 9:00 - 18:00",
	phone: "+57 312 760 9748",
	mapEmbedUrl:
		"https://maps.google.com/maps?q=Ebanisteria%20El%20Calvo,%20Pereira,%20Risaralda&t=&z=17&ie=UTF8&iwloc=&output=embed",
	directionsUrl: "https://www.google.com/maps/place/Ebanisteria+El+Calvo/@4.7952561,-75.7462933,17z/data=!3m1!4b1!4m6!3m5!1s0x8e387d7eda21c641:0xcb5a4936b274232b!8m2!3d4.7952561!4d-75.7462933!16s%2Fg%2F11fj49r1rd?entry=ttu",
	background: "primary",
};

export const contactFormProps: ContactFormBlockProps = {
	title: "Pide tu presupuesto de Restauración",
	description:
		"Cuéntanos sobre tu mueble. Ya sea la silla del abuelo o las puertas desgastadas de tu casa, te daremos una valoración honesta sobre su rescate.",
	leftBackground: "primary",
	benefits: [
		{ icon: "check_circle", text: "Evaluación sin compromiso" },
		{ icon: "check_circle", text: "Uso de barnices y telas premium" },
		{ icon: "check_circle", text: "Transporte propio disponible" },
	],
	fields: [
		{ key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Juan Pérez", required: true },
		{ key: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "600 000 000", required: true },
		{
			key: "servicio",
			label: "Servicio interesado",
			type: "select",
			placeholder: "Selecciona el servicio que necesitas",
			required: true,
			options: JSON.stringify([
				{ value: "restauracion", label: "Restauración de Muebles" },
				{ value: "cocinas", label: "Cocinas Integrales a Medida" },
				{ value: "closets", label: "Clósets y Vestidores" },
				{ value: "puertas", label: "Puertas y Acabados" },
			]),
		},
		{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos un poco sobre el estado actual del mueble...", required: false },
	],
	submitLabel: "Enviar Solicitud",
};

export const footerProps: FooterBlockProps = {
	logo: "/logo.png",
	brand: "Ebanistería El Calvo",
	tagline: "Muebles con historia, restaurados con maestría.",
	copyright: `© 2026 Ebanistería El Calvo. Perla del Sur.`,
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
