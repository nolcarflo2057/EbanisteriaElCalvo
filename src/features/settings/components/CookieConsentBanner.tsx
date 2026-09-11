"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const COOKIE_CONSENT_KEY = "cookie_consent";
export const COOKIE_CONSENT_ACCEPTED = "accepted";
export const COOKIE_CONSENT_DECLINED = "declined";

export function getCookieConsent(): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));
	return match ? match.split("=")[1] : null;
}

export function setCookieConsent(value: string) {
	const d = new Date();
	d.setFullYear(d.getFullYear() + 1);
	document.cookie = `${COOKIE_CONSENT_KEY}=${value}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
}

export function CookieConsentBanner() {
	const [visible, setVisible] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Mostrar solo si aún no hay decisión guardada.
		if (!getCookieConsent()) setVisible(true);
	}, []);

	if (!visible) return null;

	const decide = (value: string) => {
		setCookieConsent(value);
		setVisible(false);
		// Recargar suavemente para que el servidor inyecte scripts de tracking
		router.refresh();
	};

	return (
		<div
			className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999] rounded-2xl border border-border bg-card/95 backdrop-blur-md p-5 shadow-2xl animate-in slide-in-from-bottom duration-300"
			role="dialog"
			aria-label="Aviso de cookies"
		>
			<p className="text-sm font-semibold text-foreground">🍪 Aviso de cookies</p>
			<p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
				Usamos cookies para medir el tráfico y mejorar tu experiencia en nuestro sitio. Puedes aceptar
				o rechazar las cookies no esenciales. Consulta nuestra{" "}
				<Link href="/privacy" className="text-primary hover:underline">
					Política de Privacidad
				</Link>
				.
			</p>
			<div className="flex max-sm:flex-col sm:flex-row items-center gap-2 mt-4">
				<button
					type="button"
					onClick={() => decide(COOKIE_CONSENT_ACCEPTED)}
					className="w-full sm:flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
				>
					Aceptar todas
				</button>
				<button
					type="button"
					onClick={() => decide(COOKIE_CONSENT_DECLINED)}
					className="w-full sm:flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
				>
					Solo esenciales
				</button>
			</div>
		</div>
	);
}


