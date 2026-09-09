import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://carvin-ecommerce.vercel.app";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/dashboard/",
					"/admin/",
					"/api/",
					"/checkout/",
					"/orders/",
					"/profile/",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
