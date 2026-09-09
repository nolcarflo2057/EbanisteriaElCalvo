#!/usr/bin/env node
/**
 * scripts/deploy.js
 *
 * Paso de aprovisionamiento de BD para despliegue (release).
 *   1. db:push  → sincroniza el esquema (idempotente, seguro en cada deploy).
 *   2. si la BD está vacía (sin tenants) → seed generativo (src/db/seed.ts).
 *   3. siempre → asegura que el admin sea tenant_member (notificaciones de lead).
 *
 * No borra data: el seed solo corre la PRIMERA vez (DB vacía). En redeploys
 * solo se hace push + el link de admin (idempotente).
 *
 * Uso (dentro del release): pnpm deploy
 */
const { spawnSync } = require("child_process");
const pg = require("pg");
require("dotenv").config();

function run(cmd, args, opts = {}) {
  console.log(`\n▶ ${cmd} ${args.join(" ")}`);
  const res = spawnSync(cmd, args, {
    stdio: ["pipe", "inherit", "inherit"],
    input: "y\n", // auto-confirma prompts de drizzle-kit push
    ...opts,
  });
  if (res.status !== 0) {
    console.error(`✖ Falló: ${cmd} ${args.join(" ")} (exit ${res.status})`);
    process.exit(1);
  }
}

async function getPool() {
  return new pg.Pool({ connectionString: process.env.DATABASE_URL });
}

async function isDbEmpty() {
  const pool = await getPool();
  try {
    const r = await pool.query("SELECT count(*)::int AS n FROM tenants");
    return r.rows[0].n === 0;
  } finally {
    await pool.end();
  }
}

async function ensureAdminMember() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@admin.com";
  const pool = await getPool();
  try {
    const u = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (u.rowCount === 0) {
      console.log(`ℹ️  Usuario ${email} aún no existe (se creará en el seed si aplica).`);
      return;
    }
    const t = await pool.query(
      "SELECT id, slug FROM tenants WHERE active = true ORDER BY created_at LIMIT 1"
    );
    if (t.rowCount === 0) {
      console.log("ℹ️  No hay tenant activo todavía.");
      return;
    }
    const tid = t.rows[0].id;
    const uid = u.rows[0].id;
    const ex = await pool.query(
      "SELECT 1 FROM tenant_members WHERE tenant_id = $1 AND user_id = $2",
      [tid, uid]
    );
    if (ex.rowCount > 0) {
      console.log(`✓ ${email} ya es miembro del tenant (notificaciones OK).`);
      return;
    }
    await pool.query(
      "INSERT INTO tenant_members (id, tenant_id, user_id, role, created_at) VALUES (gen_random_uuid(), $1, $2, 'admin', now())",
      [tid, uid]
    );
    console.log(`✓ ${email} vinculado como tenant_member (notificaciones de lead habilitadas).`);
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log("🚀 Aprovisionando base de datos para despliegue...");

  // 1. Esquema siempre (idempotente)
  run("npx", ["drizzle-kit", "push"]);

  // 3. Link de admin (idempotente, corre siempre por si el seed fue por backup)
  await ensureAdminMember();

  // 2. Seed solo si la BD está vacía
  if (await isDbEmpty()) {
    console.log("📦 BD vacía → ejecutando seed generativo...");
    run("npx", ["tsx", "src/db/seed.ts"]);
  } else {
    console.log("✓ BD ya inicializada → se omite el seed (no se borra data).");
  }

  console.log("\n✅ Aprovisionamiento completado.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
