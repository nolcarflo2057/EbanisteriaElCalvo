"use client";

import React from "react";
import toast from "react-hot-toast";
import type { FooterBlockProps } from "./footer.schema";

interface Props {
	props: FooterBlockProps;
}

/* ── SVG icons for share apps (inline, no extra deps) ── */
const ShareIcons: Record<string, React.ReactNode> = {
	WhatsApp: (
		<svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
		</svg>
	),
	Telegram: (
		<svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
			<path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
		</svg>
	),
	Facebook: (
		<svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
			<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
		</svg>
	),
	X: (
		<svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	),
	Correo: (
		<svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
			<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
		</svg>
	),
};

const appColors: Record<string, string> = {
	WhatsApp: "text-[#25D366]",
	Telegram: "text-[#29A9EB]",
	Facebook: "text-[#1877F2]",
	X: "text-white",
	Correo: "text-white",
};

export function FooterClient({ props }: Props) {
		const links = (props.links && props.links.length > 0
			? props.links
			: (props.linkGroups ?? []).flatMap((g) => g.links)).slice(0, 8);
	const iconButtons =
		props.iconButtons && props.iconButtons.length > 0
			? props.iconButtons
			: [
					{ icon: "share", href: "#", label: "Compartir" },
					{ icon: "call", href: "#contacto", label: "Llamar" },
				];
	const [shareOpen, setShareOpen] = React.useState(false);

	const legacyCopy = async (text: string) => {
		try {
			if (typeof navigator !== "undefined" && navigator.clipboard) {
				await navigator.clipboard.writeText(text);
				return true;
			}
		} catch {
			// fallthrough
		}
		try {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(textarea);
			return ok;
		} catch {
			return false;
		}
	};

	const url = typeof window !== "undefined" ? window.location.href : "";
	const shareText = `Visita el sitio web de ${props.brand || "Mi Negocio"}`;
	const shareApps = [
		{ name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}` },
		{ name: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}` },
		{ name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
		{ name: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}` },
		{ name: "Correo", href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(url)}` },
	];

	// Lock body scroll when share modal is open
	React.useEffect(() => {
		if (shareOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => { document.body.style.overflow = ""; };
	}, [shareOpen]);

	const handleShare = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (typeof navigator !== "undefined" && navigator.share) {
			try {
				await navigator.share({
					title: props.brand || "Mi Negocio",
					text: shareText,
					url,
				});
				return;
			} catch (err) {
				if ((err as Error).name === "AbortError") return;
				// fallthrough al popup
			}
		}
		setShareOpen(true);
	};

	const handleCopy = async () => {
		if (await legacyCopy(url)) {
			toast.success("¡Enlace copiado al portapapeles!");
		} else {
			toast.error("No se pudo copiar el enlace");
		}
		setShareOpen(false);
	};

	return (
		<>
			<footer className="bg-primary">
				<div className="max-w-[1400px] mx-auto px-4 md:px-margin-desktop py-12 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
					{/* Brand + Copyright */}
					<div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:col-span-1">
						{props.logo && (
							<div className="flex-shrink-0">
								<img 
									src={props.logo} 
									alt={`Logo ${props.brand || "Marca"}`} 
									className="w-20 h-20 object-cover rounded-2xl shadow-md border-2 border-white/10" 
								/>
							</div>
						)}
						<div className="flex flex-col items-center md:items-start text-center md:text-left gap-1 mt-1">
							<span className="font-headline-sm text-headline-sm text-white w-full">
								{props.brand}
							</span>
							{props.tagline && (
								<p className="font-label-sm text-label-sm text-white/70 w-full whitespace-pre-line leading-relaxed">
									{props.tagline}
								</p>
							)}
						</div>
					</div>

					{/* Navigation links */}
					<div className="flex flex-wrap justify-center gap-8 md:col-span-1">
						{links.map((link) => (
							<a
								key={link.href + link.label}
								className="font-label-sm text-label-sm text-white/90 hover:text-secondary-container transition-colors"
								href={link.href}
							>
								{link.label}
							</a>
						))}
					</div>

					{/* Icon action buttons */}
					<div className="flex gap-4 justify-center md:justify-end md:col-span-1">
						{iconButtons.map((btn) => {
							if (btn.icon === "share") {
								return (
									<button
										key={btn.icon}
										type="button"
										onClick={handleShare}
										aria-label={btn.label}
										title={btn.label}
										className="group w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-secondary-container hover:border-secondary-container hover:text-on-secondary-container active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 cursor-pointer"
									>
										<span className="material-symbols-outlined text-white group-hover:text-on-secondary-container text-[20px]">
											{btn.icon}
										</span>
									</button>
								);
							}
							return (
								<a
									key={btn.icon}
									href={btn.href}
									aria-label={btn.label}
									title={btn.label}
									className="group w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-secondary-container hover:border-secondary-container hover:text-on-secondary-container active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 cursor-pointer"
								>
									<span className="material-symbols-outlined text-white group-hover:text-on-secondary-container text-[20px]">
										{btn.icon}
									</span>
								</a>
							);
						})}
					</div>
				</div>
			</footer>

			<div className="bg-primary py-6 text-center border-t border-white/10 flex flex-col items-center justify-center gap-2">
				<p className="font-label-sm text-label-sm text-white/90">
					{props.copyright}
				</p>
				<p className="text-xs text-white/70">Desarrollado por{" "}<a href="https://jhonatanc-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:underline" style={{color:"#feb300"}}>JhonatanCardona.dev</a></p>
			</div>

			{/* ── Share Modal: Bottom sheet on mobile, centered on desktop ── */}
			{shareOpen && (
				<div
					className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
					onClick={() => setShareOpen(false)}
				>
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]" />

					{/* Modal content */}
					<div
						className="relative w-full sm:w-auto sm:min-w-[360px] sm:max-w-[420px] bg-primary rounded-t-2xl sm:rounded-2xl shadow-2xl ring-1 ring-white/15 animate-[slideUp_200ms_ease-out] sm:animate-[scaleIn_200ms_ease-out]"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Drag handle on mobile */}
					<div className="flex justify-center pt-3 pb-1 sm:hidden">
						<div className="w-10 h-1 rounded-full bg-white/30" />
					</div>

					{/* Header */}
					<div className="flex items-center justify-between px-5 pt-3 sm:pt-5 pb-3">
						<h3 className="text-base font-semibold text-white">
							Comparte esta página
						</h3>
						<button
							type="button"
							onClick={() => setShareOpen(false)}
							className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
							aria-label="Cerrar"
						>
							<span className="material-symbols-outlined text-white/80 text-[20px]">close</span>
						</button>
					</div>

					{/* URL preview */}
					<div className="mx-5 mb-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
						<span className="material-symbols-outlined text-white/70 text-[18px] shrink-0">link</span>
						<span className="text-sm text-white/80 truncate flex-1">{url}</span>
						<button
							type="button"
							onClick={handleCopy}
							className="shrink-0 text-xs font-medium text-white hover:text-white/80 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-white/10"
						>
							Copiar
						</button>
					</div>

					{/* Share apps grid */}
					<div className="grid grid-cols-5 gap-1 px-5 pb-6">
						{shareApps.map((app) => (
							<a
								key={app.name}
								href={app.href}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => setShareOpen(false)}
								className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
							>
								<div className={`w-11 h-11 rounded-full bg-white/10 flex items-center justify-center ${appColors[app.name] || "text-white"}`}>
									{ShareIcons[app.name]}
								</div>
								<span className="text-[11px] font-medium text-white/70 leading-tight">
									{app.name}
								</span>
							</a>
						))}
					</div>

						{/* Safe area padding on mobile */}
						<div className="h-2 sm:hidden" />
					</div>
				</div>
			)}
		</>
	);
}


