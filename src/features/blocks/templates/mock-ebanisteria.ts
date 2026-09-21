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
	title: "Tu mueble tiene una historia. Dale una nueva oportunidad",
	subtitle:
		"Restauramos y renovamos tus muebles para que vuelvan a hacer parte de tus espacios. Conservamos lo que los hace especiales y les damos un estilo renovado y funcional.",
	ctaLabel: "Contáctanos ahora",
	ctaHref: "#contacto",
	bgImage: "/images/hero/hero.webp",
	bgAlt: "Taller de restauración con muebles antiguos",
	badge: "Restauración de Muebles & Ebanistería",
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
				"Restauramos y renovamos tus muebles conservando su esencia, recuperando sus acabados y adaptándolos a nuevos espacios y necesidades.",
			iconBg: "#442a22",
		},
		{
			icon: "countertops",
			title: "Cocinas Integrales",
			description:
				"Fabricamos cocinas a medida pensando en la distribución, el uso diario y el estilo que quieres para tu hogar.",
			iconBg: "#442a22",
		},
		{
			icon: "checkroom",
			title: "Clósets a Medida",
			description:
				"Diseñamos y fabricamos soluciones de almacenamiento adaptadas a tu espacio, necesidades y forma de organizarlo.",
			iconBg: "#442a22",
		},
		{
			icon: "door_front",
			title: "Puertas y Otros Trabajos",
			description:
				"Realizamos reparación, restauración y fabricación de puertas y otros elementos de madera para darle continuidad y funcionalidad a tus espacios.",
			iconBg: "#442a22",
		},
	],
};

export const artisanShowcaseProps: ArtisanShowcaseBlockProps = {
	layout: "image-left",
	image: "/images/hero/artisan.webp",
	imageAlt: "Maestro restaurador trabajando meticulosamente la madera",
	badge: "UNA HISTORIA HECHA EN PEREIRA",
	title: "Conoce la historia detrás de Ebanistería El Calvo",
	description:
		"Todo comenzó en el barrio Perla del Sur, en el sector de Cuba, Pereira, con las ganas de salir adelante de un pereirano que decidió emprender desde su propio hogar, convirtiendo su oficio y pasión por la madera en un pequeño taller.\n\nCon el tiempo, entre muebles, herramientas y proyectos, el maestro fue haciéndose conocido por un nombre que nació de manera sencilla y que muchos en la ciudad aún reconocen: El Calvo.\n\nAsí nació la identidad de Ebanistería El Calvo, un taller donde se restauran muebles, se recuperan piezas que aún tienen mucho por ofrecer y se crean espacios pensados de acuerdo con los gustos y necesidades de cada cliente.\n\nMás que fabricar o reparar, el propósito siempre ha sido escuchar, entender lo que cada persona necesita y poner el oficio al servicio de sus ideas, buscando que cada proyecto encuentre su lugar en el hogar y que el resultado deje la satisfacción de haber hecho una buena elección.\n\nHoy, Ebanistería El Calvo conserva ese espíritu de sus comienzos: un trabajo cercano, hecho con dedicación y con el valor de aprovechar, transformar y darle nuevas oportunidades a la madera.",
	background: "light",
	badgeContent: {
		icon: "verified",
		label: "Ebanistería El Calvo",
		subtitle: "Un oficio que comenzó en un hogar de Pereira y que hoy sigue tomando forma en cada proyecto.",
	},
};

export const galleryProps: GalleryBlockProps = {
	title: "De una idea a un espacio hecho realidad",
	subtitle: "Galería",
	description:
		"Cada proyecto tiene su propia historia. Restauramos muebles que merecen seguir siendo parte de tu hogar, pero también diseñamos y construimos nuevas soluciones en madera para transformar tus espacios.\n\nRestauración, renovación y fabricación a medida: desde un mueble recuperado hasta una cocina, un clóset o una puerta hecha para tu espacio.",
images: [
		{
			url: "/images/gallery/kitchen.webp",
			label: "Cocina Integral Moderna",
			alt: "Cocina integral moderna con acabados premium",
		},
		{
			url: "/images/gallery/door.webp",
			label: "Puerta de Diseño",
			alt: "Puerta de diseño moderno para oficina",
		},
		{
			url: "/images/gallery/table.webp",
			label: "Mesa de Comedor a Medida",
			alt: "Mesa de comedor fabricada a medida con acabados de alta calidad",
		},
		{
			url: "/images/gallery/closet.webp",
			label: "Closet Personalizado",
			alt: "Closet personalizado con diseño moderno y funcional",
		},
	],
};

export const locationHoursProps: LocationHoursBlockProps = {
	icon: "location_on",
	title: "ESTAMOS EN PERLA DEL SUR",
	description:
		"Desde nuestro taller en Perla del Sur, sector de Cuba, Pereira, trabajamos la madera para restaurar, transformar y crear soluciones pensadas para cada espacio.\n\nRestauramos muebles que merecen una nueva oportunidad y también diseñamos y fabricamos cocinas, clósets, puertas y proyectos a medida, buscando siempre una solución que se adapte a lo que necesitas.\n\nCuéntanos tu proyecto y encontremos juntos la mejor manera de hacerlo realidad.",
	address: "Manzana D Casa 142 esquina, Barrio Atenas - Sector Perla del Sur, Pereira",
	schedule: "Lun a Vie: 8:00 - 18:00, Sáb: 8:00 - 14:00",
	phone: "+57 312 760 9748",
	mapEmbedUrl:
		"https://maps.google.com/maps?q=Ebanisteria%20El%20Calvo,%20Pereira,%20Risaralda&t=&z=17&ie=UTF8&iwloc=&output=embed",
	directionsUrl: "https://www.google.com/maps?cid=14653104836874347307",
	background: "primary",
};

export const contactFormProps: ContactFormBlockProps = {
	title: "Cuéntanos qué quieres hacer",
	description:
		"Puede ser un mueble que quieres recuperar, una cocina que quieres renovar, un clóset que necesitas aprovechar mejor o una idea nueva para tu hogar.\n\nCuéntanos qué tienes en mente.\nRevisamos las posibilidades, definimos contigo lo que necesitas y te orientamos sobre el trabajo que requiere tu proyecto.",
	leftBackground: "primary",
	benefits: [
		{ icon: "check_circle", text: "Asesoría inicial" },
		{ icon: "check_circle", text: "Trabajos a medida" },
		{ icon: "check_circle", text: "Restauración y renovación de muebles" },
		{ icon: "check_circle", text: "Fabricación de cocinas, clósets y otros proyectos" },
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
				{ value: "otros", label: "Otros / Diferente" },
			]),
		},
		{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos un poco sobre el estado actual del mueble...", required: false },
	],
	submitLabel: "Solicitar presupuesto",
};

export const footerProps: FooterBlockProps = {
	logo: "/logo.png",
	brand: "Ebanistería El Calvo",
	tagline: "Restauramos muebles para que sigan\nhaciendo parte de tu historia y fabricamos\nnuevos espacios pensados para tu hogar.",
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
	hours: "Lun a Vie: 8:00 - 18:00, Sáb: 8:00 - 14:00",
	phone: "+57 312 760 9748",
	address: "Manzana D Casa 142 esquina, Barrio Atenas - Sector Perla del Sur, Pereira",
	extraInfo: "Maestría en Madera",
	whatsappNumber: "573127609748",
	whatsappMessage: "Hola, me interesaría solicitar un presupuesto o cotización para sus servicios.",
	showWhatsapp: true,
	showChatbot: false,
};
