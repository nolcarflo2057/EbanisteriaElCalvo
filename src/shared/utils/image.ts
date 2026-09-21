export function shouldUnoptimize(url: string | null | undefined): boolean {
	if (!url) return false;
	if (!url.startsWith("http")) return false; // local images are optimized by default

	try {
		const hostname = new URL(url).hostname;
		const allowedDomains = [
			"sea1.ingest.uploadthing.com",
			"images.unsplash.com",
			"lh3.googleusercontent.com",
			"googleusercontent.com"
		];
		
		// Check exact matches
		if (allowedDomains.includes(hostname)) return false; // Optimize these!
		
		// Check wildcard *.ufs.sh
		if (hostname.endsWith(".ufs.sh") || hostname.endsWith(".googleusercontent.com")) return false; // Optimize!

		// If it's an external domain not in next.config.ts, unoptimize to prevent Next.js crashes
		return true;
	} catch (e) {
		return true;
	}
}
