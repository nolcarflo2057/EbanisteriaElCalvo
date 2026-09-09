import type { MetadataRoute } from "next";
import { db } from "@/db";
import { tenants } from "@/db/schema/core";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		"https://carvin-ecommerce.vercel.app";

	const entries: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
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
				lastModified: new Date(),
				changeFrequency: "daily",
				priority: 0.9,
			});
		}
	} catch {
		// Si la BD no está accesible, al menos exponemos el baseUrl.
	}

	return entries;
}
