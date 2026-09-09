import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: { removeConsole: { exclude: ["error", "warn"] } },
	typedRoutes: false,
	turbopack: {
		root: process.cwd(),
	},
	allowedDevOrigins: ["localhost:3000"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "sea1.ingest.uploadthing.com",
			},
			{
				protocol: "https",
				hostname: "*.ufs.sh",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
};

export default nextConfig;
