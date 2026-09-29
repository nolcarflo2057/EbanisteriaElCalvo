import type { MetadataRoute } from "next";

/**
 * Web App Manifest — mejora la presencia en móvil, permite "agregar al inicio"
 * y envía señales de calidad a Google (Core Web Vitals / PWA).
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Ebanistería El Calvo — Restauración de Muebles en Pereira",
		short_name: "El Calvo",
		description:
			"Taller de ebanistería en Pereira, Risaralda. Restauración de muebles, cocinas integrales, clósets y muebles a medida.",
		start_url: "/",
		display: "standalone",
		background_color: "#fbf9f5",
		theme_color: "#B45309",
		icons: [
			{
				src: "/logo.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/logo.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
