import type { BlockSchema } from "../../types/schema";

export interface CategoriesBlockProps {
	title: string;
	subtitle: string;
	categories: Array<{ name: string; desc: string; image: string; href: string }>;
}

export const categoriesSchema: BlockSchema = {
	type: "categories",
	label: "Categorías destacadas",
	icon: "🗂️",
	description: "Grid de tarjetas de categoría con imagen y enlace.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Explora por categoría" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Categorías" },
		{
			key: "categories",
			label: "Categorías",
			type: "list",
			fields: [
				{ key: "name", label: "Nombre", type: "text", required: true },
				{ key: "desc", label: "Descripción", type: "textarea" },
				{ key: "image", label: "Imagen", type: "image" },
				{ key: "href", label: "Enlace", type: "text", placeholder: "/category/slug" },
			],
		},
	],
};

export const categoriesDefaultProps: CategoriesBlockProps = {
	title: "Explora por categoría",
	subtitle: "Categorías",
	categories: [
		{
			name: "Destacados",
			desc: "Lo más vendido de la tienda.",
			image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
			href: "/products",
		},
	],
};
