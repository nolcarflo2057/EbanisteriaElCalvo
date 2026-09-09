import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema";

const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL!;

// pg-connection-string ya parsea `sslmode` del connection string. Si el string
// no lo especifica y el destino es remoto (Neon/Supabase/Cloud), forzamos SSL.
// En dev contra localhost no se necesita.
const isLocalHost = /(localhost|127\.0\.0\.1|::1|host\.docker\.internal)/i.test(connectionString);
let ssl: PoolConfig["ssl"] = undefined;
if (!/sslmode=disable/i.test(connectionString) && (isProduction || !isLocalHost)) {
	ssl = { rejectUnauthorized: false };
}

// Códigos de error transitorios: no matan la query, se reintenta.
const RETRYABLE_ERROR_CODES = new Set([
	"ECONNRESET",
	"ECONNREFUSED",
	"ETIMEDOUT",
	"EPIPE",
	"57P01", // admin shutdown
	"57P02", // crash recovery
	"57P03", // cannot connect now
	"08001", // client unable to establish connection
	"08004", // server rejected connection
	"08006", // connection failure
	"08003", // connection does not exist
]);

function isRetryableError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false;
	const err = error as { code?: string; message?: string };
	if (err.code && RETRYABLE_ERROR_CODES.has(err.code)) return true;
	if (typeof err.message === "string") {
		return /connection terminated unexpectedly|terminated by the server|socket hang up|connection reset by peer/i.test(
			err.message
		);
	}
	return false;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function withRetry<T>(fn: () => Promise<T>): Promise<T> {
	const maxRetries = 2;
	const retryDelayMs = [150, 400];

	return fn().catch(async (error: unknown) => {
		if (!isRetryableError(error)) throw error;
		for (let attempt = 0; attempt < maxRetries; attempt++) {
			await sleep(retryDelayMs[attempt] ?? 400);
			try {
				return await fn();
			} catch (retryError) {
				if (!isRetryableError(retryError) || attempt === maxRetries - 1) {
					throw retryError;
				}
			}
		}
		throw error;
	});
}

// Patrón Singleton para evitar crear múltiples conexiones durante HMR de Next.js
const globalForDb = globalThis as unknown as { pool: Pool };

const pool =
	globalForDb.pool ??
	new Pool({
		connectionString,
		max: 10, // máximo de conexiones simultáneas
		connectionTimeoutMillis: 10_000, // no esperar indefinidamente un slot libre
		idleTimeoutMillis: 30_000, // liberar conexiones ociosas para el servidor
		statement_timeout: 30_000, // abortar queries colgadas
		query_timeout: 30_000,
		keepAlive: true, // TCP keepalive para detectar cortes a tiempo
		maxUses: 7_500, // reciclar conexiones usadas (evita conexiones zombis)
		allowExitOnIdle: !isProduction,
		application_name: "carvin-ecommerce",
		ssl,
	});

// SIN este handler, un error de un cliente ocioso ("Connection terminated
// unexpectedly") lanza una excepción no capturada y tira el proceso.
pool.on("error", (err) => {
	console.error("[db] Conexión del pool terminada inesperadamente:", err.message);
});

// Drizzle (node-postgres) ejecuta las queries no-transaccionales vía `pool.query()`.
// Envolvemos ese método con reintentos automáticos ante cortes intermitentes.
const poolQuery = pool.query.bind(pool);
pool.query = ((queryText: string | { text: string; values?: unknown[] }, values?: unknown[]) =>
	withRetry(() => poolQuery(queryText as string, values))) as typeof pool.query;

if (!isProduction) globalForDb.pool = pool;

export const db = drizzle(pool, {
	schema,
});

export { pool };
