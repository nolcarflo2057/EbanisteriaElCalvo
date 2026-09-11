"use client";

import Link from "next/link";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { Settings } from "lucide-react";

export function DashboardTopbar() {
	const { data: session } = useSession();
	const isAdmin = (session?.user as any)?.role === "admin";

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/admin";
				},
			},
		});
	};

	return (
		<header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md md:px-8">
			<div className="flex items-center gap-4">
				<Link
					href="/"
					className="lg:hidden! group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
				>
					<svg
						className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M19 12H5" />
						<path d="m12 19-7-7 7-7" />
					</svg>
					Volver a Tienda
				</Link>
			</div>

			<div className="flex items-center gap-2">
				{isAdmin && (
					<Link
						href="/admin/modules"
						className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
					>
						<Settings className="w-4 h-4" />
						<span className="hidden sm:inline">Empaquetar (Módulos)</span>
					</Link>
				)}

				<button
					type="button"
					onClick={handleSignOut}
					title="Cerrar Sesión"
					className="lg:hidden! flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
				>
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</button>
			</div>
		</header>
	);
}


