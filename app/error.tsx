"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function RootError({ error, reset }: Props) {
	useEffect(() => {
		console.error("Error:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
			<h1 className="text-8xl font-bold text-destructive mb-4">Error</h1>
			<p className="text-xl font-semibold mb-2">Algo salió mal</p>
			<p className="text-muted-foreground max-w-md mb-8">
				Parece que hubo un problema inesperado. Puedes intentar de nuevo o volver al inicio.
			</p>
			<div className="flex gap-4">
				<button
					onClick={reset}
					className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer"
				>
					Intentar de nuevo
				</button>
				<Link
					href={"/" as any}
					className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
				>
					Volver al inicio
				</Link>
			</div>
		</div>
	);
}


