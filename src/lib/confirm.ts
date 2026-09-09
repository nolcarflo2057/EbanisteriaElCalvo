/**
 * Confirmación segura para componentes "use client".
 * `window.confirm` solo existe en el navegador; en SSR devuelve `false`.
 */
export function confirmClient(message: string): boolean {
	if (typeof window === "undefined") return false;
	return window.confirm(message);
}
