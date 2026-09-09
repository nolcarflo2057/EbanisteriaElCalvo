import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL || "",
	token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Rate limiter para endpoints críticos.
 * Usa sliding window con 60 segundos de ventana.
 */
export const orderRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(3, "60 s"),
	analytics: true,
	prefix: "ratelimit:order",
});

/**
 * Rate limiter para webhooks de pago.
 * Más permisivo: 10 requests por minuta para permitir reintentos de las pasarelas.
 */
export const webhookRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, "60 s"),
	analytics: true,
	prefix: "ratelimit:webhook",
});

/**
 * Rate limiter para creación de preferencias de pago.
 * 5 requests por minuto por IP.
 */
export const paymentRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "60 s"),
	analytics: true,
	prefix: "ratelimit:payment",
});

/**
 * Rate limiter para autenticación.
 * 5 intentos por 5 minutos (protege contra brute force).
 */
export const authRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "300 s"),
	analytics: true,
	prefix: "ratelimit:auth",
});

/**
 * Helper para obtener la IP del cliente desde request headers.
 */
export function getClientIp(request: Request): string {
	return (
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		"unknown"
	);
}

/**
 * Helper para aplicar rate limit y retornar respuesta 429 si excede.
 */
export async function checkRateLimit(
	ratelimit: Ratelimit,
	key: string,
): Promise<{ success: boolean; remaining: number; reset: number } | null> {
	try {
		const result = await ratelimit.limit(key);
		return {
			success: result.success,
			remaining: result.remaining,
			reset: result.reset,
		};
	} catch (error) {
		// Si Redis no está disponible, permitir el request (fail open)
		console.error("Rate limit error:", error);
		return null;
	}
}
