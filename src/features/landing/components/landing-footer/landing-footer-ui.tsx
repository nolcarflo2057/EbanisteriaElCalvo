"use client";

import { Share2, Phone } from "lucide-react";
import type { LandingFooterUIProps } from "./landing-footer.types";
import toast from "react-hot-toast";

export function LandingFooterUI({ brand, tagline, linkGroups, copyright }: LandingFooterUIProps) {
	const brandName = brand || "Ebanistería El Calvo";
	const groups = linkGroups || [];
	const copyrightText = copyright || `© 2026 ${brandName}. Todos los derechos reservados.`;

	const handleShare = (e: React.MouseEvent) => {
		e.preventDefault();
		const shareData = {
			title: brandName,
			text: tagline || `Visita el sitio web de ${brandName}`,
			url: typeof window !== "undefined" ? window.location.href : "",
		};

		if (typeof navigator !== "undefined" && navigator.share) {
			navigator.share(shareData).catch((err) => console.error("Error al compartir", err));
		} else if (typeof navigator !== "undefined" && navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			toast.success("¡Enlace copiado al portapapeles!");
		}
	};

	return (
		<footer className="bg-primary dark:bg-neutral-900 text-primary-foreground border-t border-primary/10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex max-md:flex-col md:flex-row justify-between items-center gap-8">
				{/* Left Side: Brand and Copyright */}
				<div className="flex flex-col items-center md:items-start gap-2">
					<span className="font-serif text-2xl font-bold tracking-tight text-white dark:text-neutral-100">
						{brandName}
					</span>
					<p className="text-xs text-white/70 dark:text-neutral-400">
						{copyrightText}
					</p>
				</div>

				{/* Middle Side: Dynamic flat links */}
				<div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
					{groups.flatMap((g) => g.links || []).map((link, idx) => (
						<a
							key={idx}
							className="text-sm text-white/80 dark:text-neutral-300 hover:text-white dark:hover:text-white transition-colors"
							href={link.href}
						>
							{link.label}
						</a>
					))}
				</div>

				{/* Right Side: Social / Action Buttons */}
				<div className="flex gap-4">
					<button
						type="button"
						onClick={handleShare}
						className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors group cursor-pointer bg-transparent"
						title="Compartir"
					>
						<Share2 className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
					</button>
					<a
						className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors group cursor-pointer"
						href="#contacto"
						title="Llamar"
					>
						<Phone className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
					</a>
				</div>
			</div>
		</footer>
	);
}


