/**
 * Expresión segura para IDs de tracking: solo [A-Za-z0-9-_].
 * Defensa en profundidad: aunque el schema valida al guardar, escrituras
 * directas a BD se saltan esa validación y en scripts se inyecta JS.
 */
const SAFE_ID = /^[A-Za-z0-9-_]+$/;

export function safeId(id: string | null | undefined): string | null {
	if (!id) return null;
	return SAFE_ID.test(id) ? id : null;
}
