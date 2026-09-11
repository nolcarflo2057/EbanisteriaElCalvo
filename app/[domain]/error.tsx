"use client";

import { useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function DomainError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Domain boundary error:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
			<AlertCircle className="w-12 h-12 text-red-500 mb-4" />
			<h2 className="text-2xl font-bold tracking-tight mb-2">Algo salió mal</h2>
			<p className="text-gray-500 mb-6 max-w-md">
				Ha ocurrido un error inesperado al cargar esta página. Por favor, intenta de nuevo.
			</p>
			<Button onClick={() => reset()} variant="default">
				Intentar de nuevo
			</Button>
		</div>
	);
}

