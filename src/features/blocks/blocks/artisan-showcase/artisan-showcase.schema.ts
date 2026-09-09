import type { BlockSchema } from "../../types/schema";

export interface ArtisanShowcaseBlockProps {
	layout: "image-left" | "image-right";
	image: string;
	imageAlt: string;
	badge?: string;
	title: string;
	description: string;
	badgeContent?: {
		icon: string;
		label: string;
		subtitle: string;
	};
	background?: "light" | "dark" | "accent" | "transparent";
}

export const artisanShowcaseSchema: BlockSchema = {
	type: "artisanShowcase",
	label: "Sección Artesano (Split)",
	icon: "🪵",
	description: "Sección dividida estilo artesanal: imagen + contenido con badge de certificación.",
	fields: [
		{
			key: "layout",
			label: "Posición de la imagen",
			type: "select",
			options: [
				{ value: "image-left", label: "Imagen a la izquierda" },
				{ value: "image-right", label: "Imagen a la derecha" },
			],
			default: "image-left",
		},
		{ key: "image", label: "Imagen", type: "image", required: true },
		{ key: "imageAlt", label: "Texto alternativo", type: "text" },
		{ key: "badge", label: "Etiqueta superior", type: "text", placeholder: "El Maestro Detrás del Arte" },
		{ key: "title", label: "Título", type: "text", required: true },
		{ key: "description", label: "Descripción", type: "textarea" },
		{
			key: "background",
			label: "Fondo",
			type: "select",
			options: [
				{ value: "transparent", label: "Transparente" },
				{ value: "light", label: "Claro (surface-container-low)" },
				{ value: "dark", label: "Oscuro (primary)" },
				{ value: "accent", label: "Acento" },
			],
			default: "light",
		},
		{
			key: "badgeContent",
			label: "Badge de certificación",
			type: "group",
			fields: [
				{ key: "icon", label: "Icono (Material Symbol)", type: "text", default: "verified" },
				{ key: "label", label: "Título badge", type: "text", default: "Certificación Artesanal" },
				{ key: "subtitle", label: "Subtítulo badge", type: "text", default: "Garantía de calidad en cada pieza restaurada." },
			],
		},
	],
};

export const artisanShowcaseDefaultProps: ArtisanShowcaseBlockProps = {
	layout: "image-left",
	image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWuBIsFR8zv9780y07s7r3cpOiLDqijZyyCWfJdO9VEpbei7ulqnJ_mpc2ceZpATf5U_g3HZg5GXG8sNFECLlhAncUO8GOqSInW6vaSDmeA_BCSfSF7vJxseHe_KFxUhrXt7SzZ1rktrhRiSsdksS27uR_1MxUOuorPl634ip5TBFAokrJJzcEjopxnxStbnMgFqY_wDHIrrpKtF0nnY4MqboXOod2lv0Bq9mPNEXgC3Ms97GYm5Nd2A",
	imageAlt: "Master carpenter working in sunlit woodworking studio",
	badge: "El Maestro Detrás del Arte",
	title: "Conoce a El Calvo: pasión por el arte de la madera",
	description: "Más que restauración, es amor por cada detalle. Con décadas de experiencia sirviendo a nuestra comunidad, entendemos que cada mueble cuenta una historia. Nuestra misión es preservar ese legado con la paciencia y el respeto que la madera noble merece.",
	background: "light",
	badgeContent: {
		icon: "verified",
		label: "Certificación Artesanal",
		subtitle: "Garantía de calidad en cada pieza restaurada.",
	},
};
