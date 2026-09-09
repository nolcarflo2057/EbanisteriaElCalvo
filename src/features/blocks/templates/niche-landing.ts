import type { DefaultLandingBlock } from "./default-landing";
import { buildDefaultLandingBlocks } from "./default-landing";

export type NicheKey = "carniceria" | "odontologo" | "barberia" | "ebanisteria" | "servicios";

/**
 * Templates de landing por nicho. Cada vertical entrega bloques con contenido
 * inicial realista (servicios, textos, categorías) para que el Día 2 del
 * onboarding solo requiera ajustar imágenes y datos puntuales del cliente.
 *
 * Si no hay template para el nicho, se usa la plantilla base genérica.
 */
export function buildNicheLandingBlocks(brand: string, niche?: string): DefaultLandingBlock[] {
	switch ((niche || "servicios").toLowerCase()) {
		case "carniceria":
			return buildCarniceriaBlocks(brand);
		case "odontologo":
		case "clinica":
		case "clinica_dental":
			return buildOdontologoBlocks(brand);
		case "barberia":
		case "barber":
			return buildBarberiaBlocks(brand);
		case "ebanisteria":
		case "carpinteria":
			return buildDefaultLandingBlocks(brand);
		default:
			return buildDefaultLandingBlocks(brand);
	}
}

function buildCarniceriaBlocks(brand: string): DefaultLandingBlock[] {
	return [
		{
			blockType: "navigation",
			label: "Menú de Navegación",
			props: {
				brand,
				ctaLabel: "Hacer Pedido",
				ctaHref: "#contacto",
				links: [
					{ label: "Carnes", href: "#carnes" },
					{ label: "Servicios", href: "#servicios" },
					{ label: "Contacto", href: "#contacto" },
				],
			},
			visible: true,
			order: 0,
		},
		{
			blockType: "hero",
			label: "Hero Portada",
			props: {
				title: `Carnes frescas todos los días en ${brand}`,
				subtitle:
					"Selección diaria de cortes de res, cerdo y pollo de origen confiable, listos para tu mesa con el mejor sabor y frescura.",
				ctaLabel: "Ver cortes",
				ctaHref: "#carnes",
				bgImage:
					"https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1920&h=800&fit=crop&q=80",
				badge: "Frescura garantizada",
			},
			visible: true,
			order: 1,
		},
		{
			blockType: "servicesGrid",
			label: "Grid de Servicios",
			props: {
				title: "Nuestros cortes y servicios",
				subtitle: "Lo que ofrecemos",
				columns: 4,
				services: [
					{
						icon: "lunch_dining",
						title: "Cortes de Res",
						description:
							"Punta de anca, lomo, sobrebarriga y más, cortados a tu gusto.",
						iconBg: "#8f1d1d",
					},
					{
						icon: "kebab_dining",
						title: "Carnes a la Carta",
						description:
							"Marinados, adobos y preparaciones listas para cocinar.",
						iconBg: "#8f1d1d",
					},
					{
						icon: "egg",
						title: "Pollo y Cerdo",
						description:
							"Pollo fresco y cerdo de granja con calidad garantizada.",
						iconBg: "#8f1d1d",
					},
					{
						icon: "home_work",
						title: "Pedidos a Domicilio",
						description:
							"Llevamos tu pedido a la puerta de tu casa.",
						iconBg: "#8f1d1d",
					},
				],
			},
			visible: true,
			order: 2,
		},
		{
			blockType: "artisanShowcase",
			label: "Sección Sobre Nosotros",
			props: {
				layout: "image-left",
				image:
					"https://images.unsplash.com/photo-1587582083980-4f5f5f45f4a0?w=1200&h=800&fit=crop&q=80",
				imageAlt: "Carnicero experto seleccionando cortes de carne fresca",
				badge: "Tradición y Frescura",
				title: `Más de 20 años sirviendo a ${brand}`,
				description:
					"Seleccionamos cada corte con el mismo cuidado de siempre. Nuestra familia cuida la calidad para que la tuya disfrute la mejor carne.",
				background: "light",
				badgeContent: {
					icon: "verified",
					label: "Calidad Garantizada",
					subtitle: "Productos seleccionados diariamente.",
				},
			},
			visible: true,
			order: 3,
		},
		{
			blockType: "gallery",
			label: "Galería de Productos",
			props: {
				title: "Nuestra Selección",
				subtitle: "Galería",
				description:
					"Una muestra de los cortes y productos frescos que encuentras en nuestro local.",
				images: [
					{
						url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=600&fit=crop&q=80",
						label: "Cortes de res",
						alt: "Cortes frescos de res",
					},
					{
						url: "https://images.unsplash.com/photo-1588348331506-1207a15e7c92?w=800&h=600&fit=crop&q=80",
						label: "Carne a la parrilla",
						alt: "Carne a la parrilla",
					},
					{
						url: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&h=600&fit=crop&q=80",
						label: "Chorizos artesanales",
						alt: "Chorizos artesanales",
					},
					{
						url: "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=800&h=600&fit=crop&q=80",
						label: "Pollo fresco",
						alt: "Pollo fresco",
					},
				],
			},
			visible: true,
			order: 4,
		},
		{
			blockType: "locationHours",
			label: "Ubicación y Horarios",
			props: {
				icon: "location_on",
				title: "Visítanos",
				description:
					"Te esperamos todos los días con producto fresco y atención personalizada.",
				address: "Tu dirección aquí",
				schedule: "Lunes a Sábado: 7:00 - 19:00",
				mapEmbedUrl:
					"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15913.626880093863!2d-75.7279188!3d4.7857187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDcnMDguNiJOIDc1wrA0Myc0MC41Ilc!5e0!3m2!1ses!2sco!4v1710000000000!5m2!1ses!2sco",
				directionsUrl: "https://maps.google.com",
				background: "primary",
			},
			visible: true,
			order: 5,
		},
		{
			blockType: "contactForm",
			label: "Formulario de Pedido",
			props: {
				title: "Haz tu pedido",
				description:
					"Cuéntanos qué necesitas y te lo dejamos listo para recoger o llevar a tu casa.",
				leftBackground: "primary",
				benefits: [
					{ icon: "check_circle", text: "Cortes al gusto del cliente" },
					{ icon: "check_circle", text: "Precio por libra claro" },
					{ icon: "check_circle", text: "Entrega a domicilio disponible" },
				],
				fields: [
					{ key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Juan Pérez", required: true },
					{ key: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "600 000 000", required: true },
					{ key: "pedido", label: "Tipo de pedido", type: "select", placeholder: "Selecciona una opción", required: true, options: JSON.stringify([
						{ value: "cortes", label: "Cortes de res" },
						{ value: "pollo", label: "Pollo y cerdo" },
						{ value: "domicilio", label: "Pedido a domicilio" },
					]) },
					{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos tu pedido...", required: false },
				],
				submitLabel: "Enviar Pedido",
			},
			visible: true,
			order: 6,
		},
		{
			blockType: "footer",
			label: "Pie de Página",
			props: {
				brand,
				copyright: `© ${new Date().getFullYear()} ${brand}.`,
				links: [
					{ label: "Carnes", href: "#carnes" },
					{ label: "Servicios", href: "#servicios" },
					{ label: "Contacto", href: "#contacto" },
					{ label: "Privacidad", href: "/p/privacidad" },
					{ label: "Términos", href: "/p/terminos" },
				],
				iconButtons: [
					{ icon: "share", href: "#", label: "Compartir" },
					{ icon: "call", href: "#contacto", label: "Llamar" },
				],
			},
			visible: true,
			order: 7,
		},
	];
}

function buildOdontologoBlocks(brand: string): DefaultLandingBlock[] {
	return [
		{
			blockType: "navigation",
			label: "Menú de Navegación",
			props: {
				brand,
				ctaLabel: "Pedir Cita",
				ctaHref: "#contacto",
				links: [
					{ label: "Servicios", href: "#servicios" },
					{ label: "Especialistas", href: "#especialistas" },
					{ label: "Contacto", href: "#contacto" },
				],
			},
			visible: true,
			order: 0,
		},
		{
			blockType: "hero",
			label: "Hero Portada",
			props: {
				title: `Tu mejor sonrisa empieza en ${brand}`,
				subtitle:
					"Atención odontológica de calidad con tecnología moderna y un equipo que cuida tu salud bucal con calidez.",
				ctaLabel: "Agenda tu cita",
				ctaHref: "#contacto",
				bgImage:
					"https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&h=800&fit=crop&q=80",
				badge: "Odontología moderna",
			},
			visible: true,
			order: 1,
		},
		{
			blockType: "servicesGrid",
			label: "Grid de Servicios",
			props: {
				title: "Servicios Odontológicos",
				subtitle: "Nuestra especialidad",
				columns: 4,
				services: [
					{
						icon: "tooth_care",
						title: "Ortodoncia",
						description:
							"Alineación dental con brackets y alineadores invisibles.",
						iconBg: "#0b5d8f",
					},
					{
						icon: "smile",
						title: "Estética Dental",
						description:
							"Blanqueamiento, carillas y diseño de sonrisa.",
						iconBg: "#0b5d8f",
					},
					{
						icon: "medical_services",
						title: "Implantes",
						description:
							"Restauración completa de dientes con implantes de alta calidad.",
						iconBg: "#0b5d8f",
					},
					{
						icon: "sanitizer",
						title: "Limpieza y Prevención",
						description:
							"Control de placa, caries y salud bucal general.",
						iconBg: "#0b5d8f",
					},
				],
			},
			visible: true,
			order: 2,
		},
		{
			blockType: "artisanShowcase",
			label: "Sección Especialistas",
			props: {
				layout: "image-left",
				image:
					"https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=800&fit=crop&q=80",
				imageAlt: "Odontólogo atendiendo a un paciente en una clínica moderna",
				badge: "Nuestro Equipo",
				title: `Profesionales que cuidan tu sonrisa`,
				description:
					"Un equipo de odontólogos especializados con años de experiencia, comprometido con tu bienestar y comodidad en cada consulta.",
				background: "light",
				badgeContent: {
					icon: "verified",
					label: "Equipo Certificado",
					subtitle: "Profesionales acreditados.",
				},
			},
			visible: true,
			order: 3,
		},
		{
			blockType: "gallery",
			label: "Galería de la Clínica",
			props: {
				title: "Nuestras Instalaciones",
				subtitle: "Galería",
				description:
					"Espacios modernos y cómodos pensados para tu tranquilidad.",
				images: [
					{
						url: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&h=600&fit=crop&q=80",
						label: "Consultorio moderno",
						alt: "Consultorio odontológico moderno",
					},
					{
						url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop&q=80",
						label: "Equipo odontológico",
						alt: "Equipo odontológico de última generación",
					},
					{
						url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80",
						label: "Atención al paciente",
						alt: "Atención al paciente",
					},
					{
						url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80",
						label: "Área de descanso",
						alt: "Área de descanso de la clínica",
					},
				],
			},
			visible: true,
			order: 4,
		},
		{
			blockType: "locationHours",
			label: "Ubicación y Horarios",
			props: {
				icon: "location_on",
				title: "Visítanos",
				description:
					"Consulta de lunes a sábado. Te esperamos con cita previa o emergencias.",
				address: "Tu dirección aquí",
				schedule: "Lunes a Viernes: 8:00 - 18:00, Sábados: 8:00 - 13:00",
				mapEmbedUrl:
					"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15913.626880093863!2d-75.7279188!3d4.7857187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDcnMDguNiJOIDc1wrA0Myc0MC41Ilc!5e0!3m2!1ses!2sco!4v1710000000000!5m2!1ses!2sco",
				directionsUrl: "https://maps.google.com",
				background: "primary",
			},
			visible: true,
			order: 5,
		},
		{
			blockType: "contactForm",
			label: "Formulario de Citas",
			props: {
				title: "Pide tu cita",
				description:
					"Déjanos tus datos y te contactaremos para confirmar tu cita en el horario que prefieras.",
				leftBackground: "primary",
				benefits: [
					{ icon: "check_circle", text: "Citas puntuales y sin esperas" },
					{ icon: "check_circle", text: "Tecnología de última generación" },
					{ icon: "check_circle", text: "Atención para toda la familia" },
				],
				fields: [
					{ key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: María Gómez", required: true },
					{ key: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "600 000 000", required: true },
					{ key: "servicio", label: "Servicio de interés", type: "select", placeholder: "Selecciona un servicio", required: true, options: JSON.stringify([
						{ value: "ortodoncia", label: "Ortodoncia" },
						{ value: "estetica", label: "Estética Dental" },
						{ value: "implantes", label: "Implantes" },
						{ value: "limpieza", label: "Limpieza y Prevención" },
					]) },
					{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos tu caso...", required: false },
				],
				submitLabel: "Pedir Cita",
			},
			visible: true,
			order: 6,
		},
		{
			blockType: "footer",
			label: "Pie de Página",
			props: {
				brand,
				copyright: `© ${new Date().getFullYear()} ${brand}.`,
				links: [
					{ label: "Servicios", href: "#servicios" },
					{ label: "Especialistas", href: "#especialistas" },
					{ label: "Contacto", href: "#contacto" },
					{ label: "Privacidad", href: "/p/privacidad" },
					{ label: "Términos", href: "/p/terminos" },
				],
				iconButtons: [
					{ icon: "share", href: "#", label: "Compartir" },
					{ icon: "call", href: "#contacto", label: "Llamar" },
				],
			},
			visible: true,
			order: 7,
		},
	];
}

function buildBarberiaBlocks(brand: string): DefaultLandingBlock[] {
	return [
		{
			blockType: "navigation",
			label: "Menú de Navegación",
			props: {
				brand,
				ctaLabel: "Reservar Turno",
				ctaHref: "#contacto",
				links: [
					{ label: "Servicios", href: "#servicios" },
					{ label: "Galería", href: "#galeria" },
					{ label: "Contacto", href: "#contacto" },
				],
			},
			visible: true,
			order: 0,
		},
		{
			blockType: "hero",
			label: "Hero Portada",
			props: {
				title: `Estilo y tradición en ${brand}`,
				subtitle:
					"Cortes clásicos y modernos, barba perfecta y atención de barberos profesionales que entienden lo que buscas.",
				ctaLabel: "Reserva tu turno",
				ctaHref: "#contacto",
				bgImage:
					"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&h=800&fit=crop&q=80",
				badge: "Barbería profesional",
			},
			visible: true,
			order: 1,
		},
		{
			blockType: "servicesGrid",
			label: "Grid de Servicios",
			props: {
				title: "Nuestros Servicios",
				subtitle: "Lo que hacemos",
				columns: 4,
				services: [
					{
						icon: "content_cut",
						title: "Corte de Cabello",
						description:
							"Cortes clásicos y modernos adaptados a tu estilo.",
						iconBg: "#1f2937",
					},
					{
						icon: "face",
						title: "Arreglo de Barba",
						description:
							"Diseño, perfilado y afeitado con toalla caliente.",
						iconBg: "#1f2937",
					},
					{
						icon: "spa",
						title: "Lavado y Estilo",
						description:
							"Lavado, masaje capilar y peinado final.",
						iconBg: "#1f2937",
					},
					{
						icon: "verified",
						title: "Ritual de Barbería",
						description:
							"Experiencia completa: corte, barba y cuidado facial.",
						iconBg: "#1f2937",
					},
				],
			},
			visible: true,
			order: 2,
		},
		{
			blockType: "artisanShowcase",
			label: "Sección Sobre Nosotros",
			props: {
				layout: "image-left",
				image:
					"https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=800&fit=crop&q=80",
				imageAlt: "Barbero profesional trabajando en un corte de cabello",
				badge: "El Arte de la Barbería",
				title: `Más que un corte, una experiencia`,
				description:
					"Cada visita a nuestra barbería es un momento de relajación y estilo. Técnica, atención al detalle y el mejor ambiente para que salgas renovado.",
				background: "light",
				badgeContent: {
					icon: "star",
					label: "Clientes Satisfechos",
					subtitle: "Cientos de clientes nos recomiendan.",
				},
			},
			visible: true,
			order: 3,
		},
		{
			blockType: "gallery",
			label: "Galería de Trabajos",
			props: {
				title: "Nuestros Cortes",
				subtitle: "Galería",
				description:
					"Una muestra de los estilos y acabados que puedes lograr en nuestra barbería.",
				images: [
					{
						url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop&q=80",
						label: "Corte fade",
						alt: "Corte de cabello estilo fade",
					},
					{
						url: "https://images.unsplash.com/photo-1622287162716-f311baa1a2d0?w=800&h=600&fit=crop&q=80",
						label: "Arreglo de barba",
						alt: "Arreglo profesional de barba",
					},
					{
						url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop&q=80",
						label: "Corte clásico",
						alt: "Corte de cabello clásico",
					},
					{
						url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop&q=80",
						label: "Ambiente de la barbería",
						alt: "Interior de la barbería",
					},
				],
			},
			visible: true,
			order: 4,
		},
		{
			blockType: "locationHours",
			label: "Ubicación y Horarios",
			props: {
				icon: "location_on",
				title: "Visítanos",
				description:
					"Te esperamos en el local con atención personalizada. Reserva tu turno para no esperar.",
				address: "Tu dirección aquí",
				schedule: "Lunes a Sábado: 9:00 - 20:00",
				mapEmbedUrl:
					"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15913.626880093863!2d-75.7279188!3d4.7857187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDcnMDguNiJOIDc1wrA0Myc0MC41Ilc!5e0!3m2!1ses!2sco!4v1710000000000!5m2!1ses!2sco",
				directionsUrl: "https://maps.google.com",
				background: "primary",
			},
			visible: true,
			order: 5,
		},
		{
			blockType: "contactForm",
			label: "Formulario de Reservas",
			props: {
				title: "Reserva tu turno",
				description:
					"Déjanos tus datos y te confirmamos el horario disponible que mejor se adapte a ti.",
				leftBackground: "primary",
				benefits: [
					{ icon: "check_circle", text: "Turnos puntuales" },
					{ icon: "check_circle", text: "Barberos profesionales" },
					{ icon: "check_circle", text: "Ambiente único" },
				],
				fields: [
					{ key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Carlos Ruiz", required: true },
					{ key: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "600 000 000", required: true },
					{ key: "servicio", label: "Servicio", type: "select", placeholder: "Selecciona un servicio", required: true, options: JSON.stringify([
						{ value: "corte", label: "Corte de Cabello" },
						{ value: "barba", label: "Arreglo de Barba" },
						{ value: "ritual", label: "Ritual Completo" },
					]) },
					{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos lo que necesitas...", required: false },
				],
				submitLabel: "Reservar Turno",
			},
			visible: true,
			order: 6,
		},
		{
			blockType: "footer",
			label: "Pie de Página",
			props: {
				brand,
				copyright: `© ${new Date().getFullYear()} ${brand}.`,
				links: [
					{ label: "Servicios", href: "#servicios" },
					{ label: "Galería", href: "#galeria" },
					{ label: "Contacto", href: "#contacto" },
					{ label: "Privacidad", href: "/p/privacidad" },
					{ label: "Términos", href: "/p/terminos" },
				],
				iconButtons: [
					{ icon: "share", href: "#", label: "Compartir" },
					{ icon: "call", href: "#contacto", label: "Llamar" },
				],
			},
			visible: true,
			order: 7,
		},
	];
}
