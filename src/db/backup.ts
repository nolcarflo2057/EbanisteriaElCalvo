import "dotenv/config";
import fs from "fs";
import path from "path";
import type { PoolClient } from "pg";
import { pool } from "./index";

/**
 * Respaldo / restauración de la base de datos como "seed de respaldo".
 *
 * Uso:
 *   pnpm db:backup               → crea db-backups/backup-<fecha>.json
 *   pnpm db:restore              → restaura el snapshot más reciente
 *   pnpm db:restore <archivo>    → restaura un snapshot concreto
 *
 * El snapshot vuelca TODAS las tablas del schema `public` (excepto las de
 * migración de Drizzle) más el estado de las secuencias, para que la
 * aplicación quede exactamente tal cual estaba antes de las pruebas.
 */

const BACKUP_DIR = path.resolve(process.cwd(), "db-backups");

interface TableSnapshot {
	table: string;
	columns: string[];
	rows: Record<string, unknown>[];
}

interface SequenceSnapshot {
	sequence: string;
	lastValue: string;
	isCalled: boolean;
}

interface BackupFile {
	app: string;
	createdAt: string;
	tables: TableSnapshot[];
	sequences: SequenceSnapshot[];
}

const q = (name: string) => `"${name.replaceAll('"', '""')}"`;

async function getPublicTables(): Promise<string[]> {
	const res = await pool.query(
		`SELECT tablename
		 FROM pg_tables
		 WHERE schemaname = 'public'
		   AND tablename NOT LIKE '_drizzle%'
		   AND tablename != '__drizzle_migrations'
		 ORDER BY tablename`
	);
	return res.rows.map((r) => r.tablename as string);
}

async function getTableColumns(table: string): Promise<string[]> {
	const res = await pool.query(
		`SELECT column_name
		 FROM information_schema.columns
		 WHERE table_schema = 'public' AND table_name = $1
		 ORDER BY ordinal_position`,
		[table]
	);
	return res.rows.map((r) => r.column_name as string);
}

async function getSequences(): Promise<SequenceSnapshot[]> {
	const tables = await getPublicTables();
	const sequences: SequenceSnapshot[] = [];

	for (const table of tables) {
		const columns = await getTableColumns(table);
		for (const column of columns) {
			const seqRes = await pool.query(
				`SELECT pg_get_serial_sequence('public.' || quote_ident($1), $2) AS seq`,
				[table, column]
			);
			const seqName = seqRes.rows[0]?.seq as string | null;
			if (!seqName) continue;

			const shortName = seqName.replace(/^public\./, "");
			const stateRes = await pool.query(
				`SELECT last_value::text AS last_value, is_called FROM public.${q(shortName)}`
			);
			if (!stateRes.rows[0]) continue;

			sequences.push({
				sequence: shortName,
				lastValue: stateRes.rows[0].last_value,
				isCalled: stateRes.rows[0].is_called,
			});
		}
	}
	return sequences;
}

async function createBackup(): Promise<string> {
	const tables = await getPublicTables();
	const data: TableSnapshot[] = [];

	for (const table of tables) {
		const columns = await getTableColumns(table);
		const res = await pool.query(`SELECT * FROM public.${q(table)}`);
		const rows = res.rows.map((row) => {
			const out: Record<string, unknown> = {};
			for (const col of columns) {
				out[col] = row[col];
			}
			return out;
		});
		data.push({ table, columns, rows });
	}

	const sequences = await getSequences();

	const backup: BackupFile = {
		app: "carvin-ecommerce",
		createdAt: new Date().toISOString(),
		tables: data,
		sequences,
	};

	if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const filePath = path.join(BACKUP_DIR, `backup-${stamp}.json`);
	fs.writeFileSync(filePath, JSON.stringify(backup, null, 2), "utf-8");

	const totalRows = data.reduce((acc, t) => acc + t.rows.length, 0);
	console.log(`✅ Snapshot creado: ${filePath}`);
	console.log(`   ${data.length} tablas, ${totalRows} filas, ${sequences.length} secuencias.`);

	return filePath;
}

interface FkEdge {
	child: string;
	parent: string;
}

async function getFkEdges(): Promise<FkEdge[]> {
	const res = await pool.query(
		`SELECT DISTINCT tc.table_name AS child, ccu.table_name AS parent
		 FROM information_schema.table_constraints tc
		 JOIN information_schema.constraint_column_usage ccu
		   ON ccu.constraint_name = tc.constraint_name
		  AND ccu.constraint_schema = tc.constraint_schema
		 WHERE tc.constraint_type = 'FOREIGN KEY'
		   AND tc.table_schema = 'public'`
	);
	return res.rows.map((r) => ({ child: r.child as string, parent: r.parent as string }));
}

/**
 * Orden topológico (padres antes que hijos) de un conjunto de nodos según sus
 * dependencias. `getDeps` devuelve las claves de las que depende cada nodo.
 * Los nodos en ciclos quedan al final conservando su orden original.
 */
function topoSort<T>(items: T[], getKey: (item: T) => string, getDeps: (item: T) => string[]): T[] {
	const keyToItem = new Map(items.map((item) => [getKey(item), item]));
	const deps = new Map(items.map((item) => [getKey(item), new Set(getDeps(item).filter((d) => keyToItem.has(d)))]));
	const sorted: T[] = [];
	const visited = new Set<string>();
	const visiting = new Set<string>();

	const visit = (key: string) => {
		if (visited.has(key)) return;
		if (visiting.has(key)) return; // ciclo: posponer
		visiting.add(key);
		const item = keyToItem.get(key)!;
		for (const dep of deps.get(key)!) {
			visit(dep);
		}
		visiting.delete(key);
		visited.add(key);
		sorted.push(item);
	};

	for (const item of items) visit(getKey(item));

	if (sorted.length < items.length) {
		const done = new Set(sorted.map(getKey));
		for (const item of items) {
			if (!done.has(getKey(item))) sorted.push(item);
		}
	}
	return sorted;
}

async function resetPublicSchema(): Promise<void> {
	const tables = await getPublicTables();
	if (tables.length === 0) return;
	await pool.query(`TRUNCATE TABLE ${tables.map((t) => `public.${q(t)}`).join(", ")} RESTART IDENTITY CASCADE`);
}

async function restoreBackup(backup: BackupFile): Promise<void> {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		await resetPublicSchema();

		const currentTables = new Set(await getPublicTables());
		const tableNames = backup.tables.map((t) => t.table);
		const edges = (await getFkEdges()).filter(
			(e) => e.child !== e.parent && tableNames.includes(e.child) && tableNames.includes(e.parent)
		);

		const orderedTables = topoSort(
			backup.tables.map((t) => t.table),
			(t) => t,
			(t) => edges.filter((e) => e.child === t).map((e) => e.parent)
		);

		const snapshotByTable = new Map(backup.tables.map((t) => [t.table, t]));

		let insertedRows = 0;

		for (const tableName of orderedTables) {
			const snapshot = snapshotByTable.get(tableName)!;

			if (!currentTables.has(tableName)) {
				console.warn(`⚠️  Tabla "${tableName}" no existe en la BD actual; se omite.`);
				continue;
			}

			const currentColumns = await getTableColumns(tableName);
			const cols = snapshot.columns.filter((c) => currentColumns.includes(c));
			const missingCols = snapshot.columns.filter((c) => !currentColumns.includes(c));
			if (missingCols.length > 0) {
				console.warn(`⚠️  Columnas ausentes en "${tableName}" (se omiten): ${missingCols.join(", ")}`);
			}
			if (cols.length === 0) continue;

			const colList = cols.map((c) => q(c)).join(", ");
			const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
			const stmt = `INSERT INTO public.${q(tableName)} (${colList}) VALUES (${placeholders})`;

			// Refs auto-referenciadas (p.ej. categories.parent_id) requieren
			// que los padres se inserten antes que los hijos dentro de la tabla.
			const selfFkCols = (await getSelfReferencingColumns(client, tableName)).filter((c) => cols.includes(c));
			const rows = selfFkCols.length > 0 ? orderSelfReferencingRows(snapshot.rows, selfFkCols) : snapshot.rows;

			for (const row of rows) {
				const values = cols.map((c) => {
					const v = row[c];
					if (v === undefined) return null;
					// jsonb (objetos/arrays) deben pasarse como texto JSON; si no,
					// node-pg serializa los arrays como array de PG ('{}') y se
					// insertan como objeto vacio en jsonb.
					if (v !== null && typeof v === "object" && !(v instanceof Date)) return JSON.stringify(v);
					return v;
				});
				await client.query(stmt, values);
				insertedRows++;
			}
		}

		for (const seq of backup.sequences) {
			await client.query(`SELECT setval($1::regclass, $2::bigint, $3::boolean)`, [
				`public.${seq.sequence}`,
				seq.lastValue,
				seq.isCalled,
			]);
		}

		// ── Remap del slug del tenant al entorno destino (releases single-tenant) ──
		// El snapshot restaura el tenant con el slug del PADRE. En un release,
		// NEXT_PUBLIC_TENANT_SLUG apunta al slug del cliente: sin este remap,
		// ningún query encuentra la tienda y todo cae a defaults.
		const targetSlug = process.env.NEXT_PUBLIC_TENANT_SLUG;
		if (targetSlug) {
			await client.query(
				`UPDATE public.tenants SET slug = $1`,
				[targetSlug]
			);
			console.log(`  Slug del tenant remapeado a "${targetSlug}".`);
		}

		await client.query("COMMIT");
		console.log(`✅ Restauración completada: ${orderedTables.length} tablas, ${insertedRows} filas.`);
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
}

async function getSelfReferencingColumns(client: PoolClient, table: string): Promise<string[]> {
	const res = await client.query(
		`SELECT DISTINCT kcu.column_name
		 FROM information_schema.table_constraints tc
		 JOIN information_schema.key_column_usage kcu
		   ON kcu.constraint_name = tc.constraint_name
		  AND kcu.constraint_schema = tc.constraint_schema
		 JOIN information_schema.referential_constraints rc
		   ON rc.constraint_name = tc.constraint_name
		  AND rc.constraint_schema = tc.constraint_schema
		 JOIN information_schema.constraint_column_usage ccu
		   ON ccu.constraint_name = rc.unique_constraint_name
		  AND ccu.constraint_schema = rc.unique_constraint_schema
		 WHERE tc.constraint_type = 'FOREIGN KEY'
		   AND tc.table_schema = 'public'
		   AND tc.table_name = $1
		   AND ccu.table_schema = 'public'
		   AND ccu.table_name = $1`,
		[table]
	);
	return res.rows.map((r) => r.column_name as string);
}

function orderSelfReferencingRows(rows: Record<string, unknown>[], selfFkCols: string[]): Record<string, unknown>[] {
	const keyOf = (row: Record<string, unknown>) =>
		selfFkCols.map((c) => row[c]).join("|") || String(rows.indexOf(row));
	const parentOf = (row: Record<string, unknown>) =>
		selfFkCols.map((c) => row[c]).join("|");

	const present = new Set(rows.map(keyOf));
	return topoSort(
		rows,
		keyOf,
		(row) => {
			const parent = parentOf(row);
			return parent ? [parent] : [];
		}
	);
}

async function findLatestBackup(): Promise<string | null> {
	if (!fs.existsSync(BACKUP_DIR)) return null;
	const files = fs
		.readdirSync(BACKUP_DIR)
		.filter((f) => f.startsWith("backup-") && f.endsWith(".json"))
		.sort()
		.reverse();
	return files.length ? path.join(BACKUP_DIR, files[0]) : null;
}

async function main() {
	const args = process.argv.slice(2);
	const command = args[0] || "create";

	if (command === "create") {
		await createBackup();
	} else if (command === "restore") {
		const filePath = args[1] ? path.resolve(process.cwd(), args[1]) : await findLatestBackup();
		if (!filePath || !fs.existsSync(filePath)) {
			console.error("❌ No se encontró ningún snapshot. Ejecuta primero `pnpm db:backup`.");
			process.exit(1);
		}
		console.log(`Restaurando snapshot: ${filePath}`);
		const backup = JSON.parse(fs.readFileSync(filePath, "utf-8")) as BackupFile;
		await restoreBackup(backup);
	} else {
		console.error('Uso: tsx src/db/backup.ts <create|restore> [archivo]');
		process.exit(1);
	}
}

main()
	.catch((error) => {
		console.error("❌ Error:", error);
		process.exit(1);
	})
	.finally(() => pool.end());
