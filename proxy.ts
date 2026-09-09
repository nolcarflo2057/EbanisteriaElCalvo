import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRouteAllowed } from "@/config/modules";

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|imgs|images|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)",
	],
};


export function proxy(req: NextRequest) {
	const url = req.nextUrl;
	const pathname = url.pathname;


	const sessionToken =
		req.cookies.get("better-auth.session_token")?.value ||
		req.cookies.get("__Secure-better-auth.session_token")?.value;

	const isProtectedRoute =
		pathname.startsWith("/dashboard");

	if (isProtectedRoute && !sessionToken) {
		return NextResponse.redirect(new URL("/", req.url));
	}


	let hostname = req.headers.get("host") || "";
	if (hostname.includes(":")) {
		hostname = hostname.split(":")[0];
	}

	const singleTenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG;
	let domainSegment = singleTenantSlug || hostname;
	if (hostname === "localhost" || hostname === "127.0.0.1") {
		domainSegment = singleTenantSlug || "my-store";
	}


	if (
		pathname.startsWith("/images") ||
		pathname.startsWith("/imgs") ||
		pathname.startsWith("/uploadthing") ||
		(pathname.startsWith("/products/") && pathname.includes("."))
	) {
		return NextResponse.next();
	}


	const pathSegments = pathname.split("/").filter(Boolean);
	if (pathSegments.length > 0 && pathSegments[0] === domainSegment) {
		return NextResponse.next();
	}


	if (!isRouteAllowed(pathname)) {
		return NextResponse.redirect(new URL(`/${domainSegment}`, req.url));
	}


	return NextResponse.rewrite(
		new URL(`/${domainSegment}${pathname}${url.search}`, req.url),
	);
}
