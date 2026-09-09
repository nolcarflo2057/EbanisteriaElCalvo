import type { BlockSchema } from "../../types/schema";
import type { TestimonialItem } from "@/features/landing/components/landing-testimonials";

export interface TestimonialsBlockProps {
	title: string;
	subtitle: string;
	items: TestimonialItem[];
}

export const testimonialsSchema: BlockSchema = {
	type: "testimonials",
	label: "Testimonios",
	icon: "💬",
	description: "Reseñas de clientes con calificación y avatar.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Lo que dicen nuestros clientes" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Testimonios" },
		{
			key: "items",
			label: "Testimonios",
			type: "list",
			fields: [
				{ key: "author", label: "Autor", type: "text", required: true },
				{ key: "role", label: "Cargo / Ciudad", type: "text" },
				{ key: "quote", label: "Reseña", type: "textarea", required: true },
				{ key: "rating", label: "Calificación (1-5)", type: "number", default: 5 },
				{ key: "avatar", label: "Avatar", type: "image" },
			],
		},
	],
};

export const testimonialsDefaultProps: TestimonialsBlockProps = {
	title: "Lo que dicen nuestros clientes",
	subtitle: "Testimonios",
	items: [
		{ author: "María González", role: "Cliente verificada", quote: "Excelente atención y calidad. Lo recomiendo totalmente.", rating: 5 },
		{ author: "Carlos Ruiz", role: "Cliente verificado", quote: "Cumplieron con todo lo prometido. Muy profesionales.", rating: 5 },
		{ author: "Ana Torres", role: "Cliente verificada", quote: "La mejor experiencia, volveré a comprar sin dudarlo.", rating: 4 },
	],
};
