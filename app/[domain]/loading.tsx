import { Loader2 } from "lucide-react";

export default function DomainLoading() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] w-full">
			<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
			<p className="mt-4 text-sm text-gray-500 animate-pulse">Cargando...</p>
		</div>
	);
}
