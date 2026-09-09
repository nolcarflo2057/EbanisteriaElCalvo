import type { BlockSchema } from "../../types/schema";

export interface AboutBlockProps {
	title: string;
	text: string;
	image?: string;
	imagePosition?: "left" | "right";
	badge?: string;
}

export const aboutSchema: BlockSchema = {
	type: "about",
	label: "Sobre nosotros",
	icon: "🏢",
	description: "Historia de la marca con imagen a la izquierda o derecha.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Sobre nosotros" },
		{ key: "badge", label: "Etiqueta", type: "text", placeholder: "Nuestra historia" },
		{ key: "text", label: "Texto", type: "textarea", required: true, default: "Somos un equipo apasionado por ofrecer la mejor experiencia. Contamos historias a través de cada detalle." },
		{ key: "image", label: "Imagen", type: "image" },
		{
			key: "imagePosition",
			label: "Posición de la imagen",
			type: "select",
			default: "right",
			options: [
				{ value: "left", label: "Izquierda" },
				{ value: "right", label: "Derecha" },
			],
		},
	],
};

export const aboutDefaultProps: AboutBlockProps = {
	title: "Sobre nosotros",
	text: "Somos un equipo apasionado por ofrecer la mejor experiencia. Contamos historias a través de cada detalle.",
	imagePosition: "right",
};
