import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Redis } from "@upstash/redis";
import { db } from "@/db";

/**
 * Storage de rate-limiting para better-auth.
 * - Si hay credenciales de Upstash Redis (producción / serverless): usa Redis,
 *   de modo que el contador de intentos persiste entre invocaciones de lambda.
 * - Si no, better-auth cae a storage "memory" (un solo proceso / dev).
 */
const rateLimitRedis =
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
		? new Redis({
				url: process.env.UPSTASH_REDIS_REST_URL,
				token: process.env.UPSTASH_REDIS_REST_TOKEN,
			})
		: null;

function createUpstashRateLimitStorage() {
	if (!rateLimitRedis) return undefined;
	return {
		async get() {
			return null;
		},
		async set() {
			// El conteo lo maneja consume() vía INCR + EXPIRE.
		},
		async consume(key: string, rule: { window: number; max: number }) {
			try {
				const count = await rateLimitRedis.incr(key);
				if (count === 1) {
					await rateLimitRedis.expire(key, rule.window);
				}
				const allowed = count <= rule.max;
				return { allowed, retryAfter: allowed ? null : rule.window };
			} catch (e) {
				console.error("[rate-limit] Upstash falló, fail-open:", e);
				return { allowed: true, retryAfter: null };
			}
		},
	};
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
	}),

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},

	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: "user",
			},
			activeTenantId: {
				type: "string",
				required: false,
			},
		},
	},

	// Orígenes confiables dinámicos: dominio de producción (env) + localhost para dev.
	// better-auth valida el Origin de las peticiones (CSRF); si el dominio real no
	// está aquí, el login se rechaza en producción.
	trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000", "http://localhost:3001"].filter(Boolean) as string[],

	// Blindaje anti-force-brute: habilitado en todos los endpoints de auth.
	// /sign-in/email => 3 intentos fallidos por ventana de 10 min (600s).
	// Storage en Redis (Upstash) cuando está configurado; si no, memory.
	rateLimit: {
		enabled: true,
		customRules: {
			"/sign-in/email": {
				window: 600,
				max: 3,
			},
		},
		...(rateLimitRedis ? { customStorage: createUpstashRateLimitStorage() } : {}),
	},

	plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
