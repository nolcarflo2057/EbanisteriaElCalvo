import type { BlockSchema } from "../../types/schema";

export interface GalleryBlockProps {
	title: string;
	subtitle?: string;
	description?: string;
	images: Array<{
		url: string;
		label?: string;
		alt?: string;
	}>;
}

export const gallerySchema: BlockSchema = {
	type: "gallery",
	label: "Galería",
	icon: "🖼️",
	description: "Grid responsive de fotos del negocio o trabajos con animaciones y overlays.",
	fields: [
		{ key: "title", label: "Título", type: "text", required: true, default: "Nuestra Galería" },
		{ key: "subtitle", label: "Subtítulo", type: "text", default: "Portafolio" },
		{ key: "description", label: "Descripción", type: "textarea", default: "Cada pieza es un testimonio de nuestra dedicación a la excelencia y el respeto por la tradición maderera." },
		{
			key: "images",
			label: "Imágenes",
			type: "list",
			fields: [
				{ key: "url", label: "Imagen", type: "image", required: true },
				{ key: "label", label: "Título / Etiqueta", type: "text" },
				{ key: "alt", label: "Texto alternativo", type: "text" },
			],
		},
	],
};

export const galleryDefaultProps: GalleryBlockProps = {
	title: "Nuestra Galería",
	subtitle: "Portafolio",
	description: "Cada pieza es un testimonio de nuestra dedicación a la excelencia y el respeto por la tradición maderera.",
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
