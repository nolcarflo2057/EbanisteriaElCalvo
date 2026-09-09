/**
 * Normalización de errores para Server Actions y servicios.
 * Evita `catch (error: any)` y expone un mensaje seguro sin exponer internos.
 */

interface ErrorWithMessage {
	message?: unknown;
}

function isErrorLike(value: unknown): value is ErrorWithMessage {
	return typeof value === "object" && value !== null && "message" in value;
}

export function getErrorMessage(error: unknown): string {
	if (typeof error === "string") return error;
	if (error instanceof Error) return error.message;
	if (isErrorLike(error) && typeof error.message === "string") return error.message;
	return "Error inesperado";
}
