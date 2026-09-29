import type { MetadataRoute } from "next";
import { db } from "@/db";
import { tenants } from "@/db/schema/core";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		"https://ebanisteria-el-calvo.com";

	const now = new Date();

	const entries: MetadataRoute.Sitemap = [
		// — Página principal (landing estática)
		{
			url: baseUrl,
			lastModified: now,
			changeFrequency: "daily",
			priority: 1.0,
		},
		// — Secciones de servicio (deep links al contenido de la landing)
		{
			url: `${baseUrl}/#servicios`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/#galeria`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/#contacto`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		// — Catálogo de productos
		{
			url: `${baseUrl}/products`,
			lastModified: now,
			changeFrequency: "daily",
			priority: 0.9,
		},
		// — Páginas legales
		{
			url: `${baseUrl}/p/privacidad`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/p/terminos`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.3,
		},
	];

	try {
		const rows = await db
			.select({ slug: tenants.slug })
			.from(tenants);
		for (const row of rows) {
			if (!row.slug) continue;
			entries.push({
				url: `${baseUrl}/${row.slug}`,
				lastModified: now,
				changeFrequency: "daily",
				priority: 0.9,
			});
		}
	} catch {
		// Si la BD no está accesible, al menos exponemos el baseUrl.
	}

	return entries;
}

