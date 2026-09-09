import type { tenantPageBlocks } from "@/db/schema/core";

export type DefaultLandingBlock = Pick<
	typeof tenantPageBlocks.$inferInsert,
	"blockType" | "label" | "props" | "visible" | "order"
>;

/**
 * Plantilla base de la landing para una tienda nueva: bloques en orden
 * visualmente óptimo listos para usar desde el segundo cero.
 *
 * Se parametriza por marca/negocio para que ninguna tienda herede el branding
 * del ejemplo de seed. Los datos (imágenes, textos) son placeholders que el
 * cliente edita desde el BlockEditor.
 */
export function buildDefaultLandingBlocks(brand: string): DefaultLandingBlock[] {
	return [
		{
			blockType: "navigation",
			label: "Menú de Navegación",
			props: {
				brand,
				ctaLabel: "Pedir Presupuesto",
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
				title: `Bienvenido a ${brand}`,
				subtitle: "Productos y servicios cuidadosamente elaborados, con la calidad que tu negocio merece.",
				ctaLabel: "Contáctanos ahora",
				ctaHref: "#contacto",
				bgImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=800&fit=crop&q=80",
				badge: "Tienda online",
			},
			visible: true,
			order: 1,
		},
		{
			blockType: "servicesGrid",
			label: "Grid de Servicios",
			props: {
				title: "Nuestros Servicios",
				subtitle: "¿Qué ofrecemos?",
				columns: 4,
				services: [
					{
						icon: "auto_fix",
						title: "Servicio 1",
						description: "Describe aquí el primer servicio que ofreces a tus clientes.",
						iconBg: "#442a22",
					},
					{
						icon: "format_paint",
						title: "Servicio 2",
						description: "Describe aquí el segundo servicio que ofreces a tus clientes.",
						iconBg: "#442a22",
					},
					{
						icon: "chair",
						title: "Servicio 3",
						description: "Describe aquí el tercer servicio que ofreces a tus clientes.",
						iconBg: "#442a22",
					},
					{
						icon: "door_front",
						title: "Servicio 4",
						description: "Describe aquí el cuarto servicio que ofreces a tus clientes.",
						iconBg: "#442a22",
					},
				],
			},
			visible: true,
			order: 2,
		},
		{
			blockType: "artisanShowcase",
			label: "Sección Artesano",
			props: {
				layout: "image-left",
				image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=800&fit=crop&q=80",
				imageAlt: "Equipo trabajando en nuestro taller",
				badge: "La Persona Detrás del Arte",
				title: `Conoce a ${brand}: pasión por lo que hacemos`,
				description: "Más que un servicio, es dedicación por cada detalle. Con años de experiencia sirviendo a nuestra comunidad, entendemos que cada cliente y cada encargo cuentan una historia. Nuestra misión es cuidarla con la paciencia y el respeto que merece.",
				background: "light",
				badgeContent: {
					icon: "verified",
					label: "Certificación Artesanal",
					subtitle: "Garantía de calidad en cada trabajo.",
				},
			},
			visible: true,
			order: 3,
		},
		{
			blockType: "gallery",
			label: "Galería de Trabajos",
			props: {
				title: "Nuestra Galería",
				subtitle: "Portafolio",
				description: "Cada pieza es un testimonio de nuestra dedicación a la excelencia y el respeto por la tradición.",
				images: [
					{
						url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
						label: "Trabajo 1",
						alt: "Primer trabajo destacado",
					},
					{
						url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop&q=80",
						label: "Trabajo 2",
						alt: "Segundo trabajo destacado",
					},
					{
						url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop&q=80",
						label: "Trabajo 3",
						alt: "Tercer trabajo destacado",
					},
					{
						url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop&q=80",
						label: "Trabajo 4",
						alt: "Cuarto trabajo destacado",
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
				description: "Servicio local, calidad artesanal. Estamos aquí para ayudarte.",
				address: "Tu dirección aquí",
				schedule: "Lunes a Viernes: 9:00 - 18:00",
				mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.123456789!2d-66.61!3d18.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDAwJzM2LjAiTiA2NsKwMzYnMzYuMCJX!5e0!3m2!1ses!2spr!4v1234567890",
				directionsUrl: "https://maps.google.com",
				background: "primary",
			},
			visible: true,
			order: 5,
		},
		{
			blockType: "contactForm",
			label: "Formulario de Contacto",
			props: {
				title: "Pide tu presupuesto",
				description: "Cuéntanos sobre tu proyecto y te daremos una valoración honesta y profesional.",
				leftBackground: "primary",
				benefits: [
					{ icon: "check_circle", text: "Presupuestos detallados sin compromiso" },
					{ icon: "check_circle", text: "Materiales de primera calidad" },
					{ icon: "check_circle", text: "Atención personalizada" },
				],
				fields: [
					{ key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Juan Pérez", required: true },
					{ key: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "600 000 000", required: true },
					{ key: "servicio", label: "Servicio interesado", type: "select", placeholder: "Selecciona un servicio", required: true, options: JSON.stringify([
						{ value: "servicio1", label: "Servicio 1" },
						{ value: "servicio2", label: "Servicio 2" },
						{ value: "servicio3", label: "Servicio 3" },
					]) },
					{ key: "mensaje", label: "Mensaje o detalles (opcional)", type: "textarea", placeholder: "Cuéntanos un poco más...", required: false },
				],
				submitLabel: "Enviar Solicitud",
			},
			visible: true,
			order: 6,
		},
		{
			blockType: "footer",
			label: "Pie de Página",
			props: {
				brand,
				tagline: "Muebles con alma, hechos a mano.",
				copyright: `© ${new Date().getFullYear()} ${brand}.`,
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
			},
			visible: true,
			order: 7,
		},
	];
}
