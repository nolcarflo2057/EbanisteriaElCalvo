#!/usr/bin/env node

/**
 * scripts/release-client.js
 *
 * Genera una carpeta de entrega independiente para un cliente.
 * Copia el proyecto maestro, inyecta modules.ts personalizado,
 * purga archivos de mÃ³dulos deshabilitados, genera .env y seed.config,
 * y deja un repo limpio listo para git init + push.
 *
 * Uso:
 *   node scripts/release-client.js <slug> --tier=<tier>
 *   node scripts/release-client.js <slug> --modules=landing,blocks,leads
 *   node scripts/release-client.js <slug>              (usa clients/<slug>.json)
 *   node scripts/release-client.js ebanisteria-el-calvo --tier=business --color=#2563EB
 *   node scripts/release-client.js ebanisteria-el-calvo --modules=landing,blocks --dry-run
 *
 * ResoluciÃ³n de mÃ³dulos (prioridad): flags > spec > error.
 *
 * Argumentos:
 *   <slug>              Slug del cliente (ej: ebanisteria-el-calvo)
 *   --tier=<name>       Plan comercial segÃºn src/config/tiers.json
 *                       (mutuamente excluyente con --modules)
 *   --modules=<list>    Lista separada por comas de mÃ³dulos a habilitar
 *                       (override manual, mutuamente excluyente con --tier)
 *   --color=<hex>       Color principal hex (default: #F97316)
 *   --name=<name>       Nombre del negocio (default: capitalizado desde slug)
 *   --db=<url>          URL de conexiÃ³n a PostgreSQL (si se omite, deja placeholder)
 *   --dry-run           Solo muestra quÃ© harÃ­a, sin cambios reales
 *
 * Spec de cliente: clients/<slug>.json â€” la genera el panel /admin/modules.
 *   { "slug", "name?", "color?", "dbUrl?", "tier"|"custom", "modules": [...] }
 *   Si la spec declara tier, sus modules deben coincidir exactamente con Ã©l.
 *
 * Genera release.config.json dentro del release con { slug, tier, modules }.
 * Ese manifiesto es la fuente de verdad para update:release.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

// â”€â”€â”€ Colores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const C = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  reset: "\x1b[0m",
};

function log(icon, msg, color = C.reset) {
  console.log(`${color}${icon} ${msg}${C.reset}`);
}

// â”€â”€â”€ MÃ³dulos Core (siempre activos) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CORE_MODULES = [
  "auth",
  "users",
  "roles",
  "settings",
  "uploads",
  "notifications",
  "audit",
];

// â”€â”€â”€ Tiers comerciales (fuente Ãºnica: src/config/tiers.json) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// Consumido tambiÃ©n por el generador de specs del panel /admin/modules.
// "full" (modules:"*") se resuelve dinÃ¡micamente contra MODULES_META.
// Tiers con available:false NO son empaquetables.
//
//   pnpm release:client <slug> --tier=business
//   pnpm release:client <slug> --modules=landing,blocks,leads  (override manual)
//   pnpm release:client <slug>                                 (usa clients/<slug>.json)

const { tiers: TIERS_META } = require(path.join(
  __dirname,
  "..",
  "src",
  "config",
  "tiers.json"
));

// â”€â”€â”€ Mapeo mÃ³dulo â†’ archivos a eliminar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// SOLO mÃ³dulos con implementaciÃ³n real en el master (carpeta fÃ­sica).
// Un mÃ³dulo entra aquÃ­ cuando su feature existe; nunca "por adelantado".

const MODULE_PATHS = {
  landing: [
    "src/features/landing",
    "app/[domain]/(public)/page.tsx",
  ],
  blocks: [
    "src/features/blocks",
    "app/[domain]/dashboard/blocks",
  ],
  leads: [
    "src/features/leads",
    "app/(admin)/leads",
    "app/[domain]/dashboard/leads",
    "app/api/contact",
  ],
  appointments: [
    "src/features/appointments",
    "src/features/blocks/blocks/appointments",
    "app/(admin)/appointments",
    "app/[domain]/dashboard/appointments",
  ],
  whitelabel: [
    "src/features/whiteLabel",
    "src/components/FloatingWidgets.tsx",
    "app/[domain]/dashboard/settings/white-label",
    "app/api/chat",
    "app/api/white-label/config",
  ],
  analytics: [
    "src/features/analytics",
    "app/[domain]/dashboard/settings/integrations",
  ],
};

// ——— Directorios a excluir al copiar —————————————————————————————

const EXCLUDE_DIRS = [
  ".git",
  "node_modules",
  ".next",
  "db-backups",
  "graphify-out",
  "playwright-report",
  "test-results",
  ".eject-temp",
  "releases",
  "clients",
  ".vscode",
];

// ——— Parseo de argumentos ————————————————————————————————————————

function parseArgs() {
  const args = process.argv.slice(2);
  const positional = [];
  const flags = {};

  for (const arg of args) {
    if (arg === "--dry-run") {
      flags.dryRun = true;
    } else if (arg.startsWith("--")) {
      const [key, rawValue] = arg.slice(2).split("=");
      // Manejar valores separados por coma (ej. --modules=landing,blocks) 
      // y valores separados por espacio que pnpm podria generar
      let value = rawValue || true;
      if (typeof value === "string") {
        // Si el valor contiene espacios, dividirlo y tratarlo como multiples valores
        value = value.replace(/\s+/g, ",");
      }
      flags[key] = value;
    } else {
      positional.push(arg);
    }
  }

  // Recolectar args posicionales adicionales que podrian ser parte de un flag dividido
  // pnpm sometimes splits: --modules=landing blocks â†’ ["--modules=landing", "blocks"]
  const modulesIdx = positional.findIndex((p) => p.startsWith("--modules="));
  if (modulesIdx !== -1) {
    const [key, val] = positional[modulesIdx].slice(2).split("=");
    flags[key] = val;
    positional.splice(modulesIdx, 1);
  }

  return { positional, flags };
}

// â”€â”€â”€ Copia recursiva excluyendo directorios â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function copyDirSync(src, dest, excludes) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (excludes.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, excludes);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// â”€â”€â”€ Metadata de mÃ³dulos para la UI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MODULES_LABELS = {
  landing: { label: "Landing Page", description: "PÃ¡gina pÃºblica de la tienda con diseÃ±o personalizable" },
  blocks: { label: "Editor de Bloques", description: "Constructor visual de secciones (hero, CTA, galerÃ­a)" },
  leads: { label: "Leads de Contacto", description: "Mensajes y formularios del formulario de la landing" },
  appointments: { label: "Citas", description: "Agendamiento de citas desde la landing" },
  analytics_traffic: { label: "Métricas de tráfico", description: "Google Analytics 4" },
  analytics_conversions: { label: "Conversiones", description: "Meta Pixel, Google Ads, TikTok Pixel" },
  analytics_behavior: { label: "Comportamiento", description: "Google Tag Manager" },
  whitelabel_whatsapp: { label: "Botón de WhatsApp", description: "Widget flotante de WhatsApp" },
  whitelabel_chatbot_simple: { label: "Chatbot Simple", description: "Chatbot con respuestas predefinidas" },
  whitelabel_chatbot_advanced: { label: "Chatbot Avanzado (IA)", description: "Chatbot con IA generativa" },
  analytics: { label: "Analíticas", description: "Píxeles de conversión y analítica web (GA4, Meta, TikTok)" },
  whitelabel: { label: "Marca Blanca", description: "PersonalizaciÃ³n avanzada de identidad (chat, WhatsApp, branding)" },
};

const CORE_LABELS = {
  auth: { label: "AutenticaciÃ³n", description: "Login, registro y sesiones de usuarios" },
  users: { label: "Usuarios", description: "GestiÃ³n de cuentas y perfiles de usuario" },
  roles: { label: "Roles", description: "Sistema de permisos y roles (admin, editor, etc.)" },
  settings: { label: "ConfiguraciÃ³n", description: "Ajustes generales de la tienda (moneda, idioma, envÃ­os)" },
  uploads: { label: "Archivos", description: "Subida y gestiÃ³n de imÃ¡genes y documentos" },
  notifications: { label: "Notificaciones", description: "Sistema de notificaciones push y email" },
  audit: { label: "AuditorÃ­a", description: "Registro de acciones y logs de seguridad" },
};

const MODULES_ROUTES = {
  auth: ["/admin", "/login", "/register"],
  users: ["/dashboard/profile"],
  roles: [],
  settings: ["/dashboard/settings"],
  uploads: [],
  notifications: [],
  audit: [],
  landing: [],
  blocks: ["/dashboard/blocks"],
  leads: ["/dashboard/leads"],
  appointments: ["/dashboard/appointments"],
  analytics: ["/dashboard/settings/integrations"],
  whitelabel: [],
};

// â”€â”€â”€ Generar modules.ts para el cliente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function generateModulesTs(enabledModules) {
  const allModules = [
    ...CORE_MODULES.map((m) => ({ name: m, enabled: true, core: true })),
    ...Object.keys(MODULE_PATHS).map((m) => ({
      name: m,
      enabled: enabledModules.includes(m),
      core: false,
    })),
    // Sub-flags de Marca Blanca: existen solo si el módulo padre viaja
    ...["whitelabel_whatsapp", "whitelabel_chatbot_simple", "whitelabel_chatbot_advanced"].map(
      (m) => ({
        name: m,
        enabled: enabledModules.includes("whitelabel"),
        core: false,
      })
    ),
    // Sub-flags de Analytics: heredan el estado del padre
    ...["analytics_traffic", "analytics_conversions", "analytics_behavior"].map(
      (m) => ({
        name: m,
        enabled: enabledModules.includes("analytics"),
        core: false,
      })
    ),
  ];

  const enabledLines = allModules.map((m) => {
    const space = m.name.length < 12 ? " ".repeat(12 - m.name.length) : " ";
    return `  ${m.name}:${space}${m.enabled},`;
  });

  const metaEntries = allModules.map((m) => {
    const labels = m.core ? CORE_LABELS : MODULES_LABELS;
    const meta = labels[m.name] || { label: m.name, description: "" };
    const routes = MODULES_ROUTES[m.name] || [];
    const enabledVal = m.enabled ? "true" : "false";
    const coreVal = m.core ? "true" : "false";
    const space = m.name.length < 12 ? " ".repeat(12 - m.name.length) : " ";
    const labelSpace = " ".repeat(Math.max(1, 20 - meta.label.length));
    const routesStr = JSON.stringify(routes);
    return `  ${m.name}:{${space}enabled:${enabledVal},label:"${meta.label}",${labelSpace}description:"${meta.description}",core:${coreVal},routes:${routesStr}},`;
  });

  return `/**
 * @file modules.ts
 * @description ConfiguraciÃ³n de mÃ³dulos para este cliente.
 * Generado automÃ¡ticamente por release:client.
 */

export interface ModuleDefinition {
  enabled: boolean;
  label: string;
  description: string;
  core: boolean;
  routes: string[];
}

export const enabledModules = {
${enabledLines.join("\n")}
} as const;

export type ModuleName = keyof typeof enabledModules;

export const MODULES_META: Record<ModuleName, ModuleDefinition> = {
${metaEntries.join("\n")}
};

/**
 * Verifica si un mÃ³dulo opcional estÃ¡ activo.
 */
export function isModuleEnabled(moduleName: ModuleName): boolean {
  return enabledModules[moduleName];
}

/**
 * Verifica si una ruta pertenece a un mÃ³dulo inactivo.
 * Retorna false si la ruta pertenece a un mÃ³dulo que estÃ¡ en enabled: false.
 * Retorna true si la ruta pertenece a un mÃ³dulo activo o no estÃ¡ mapeada en ningÃºn mÃ³dulo.
 */
export function isRouteAllowed(pathname: string): boolean {
  for (const key in MODULES_META) {
    const moduleName = key as ModuleName;
    const meta = MODULES_META[moduleName];
    if (!meta.enabled) {
      const isBlockedRoute = meta.routes.some((route) =>
        pathname === route || pathname.startsWith(route + "/")
      );
      if (isBlockedRoute) {
        return false;
      }
    }
  }
  return true;
}
`;
}

// â”€â”€â”€ Generar .env â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function generateEnv(slug, dbUrl) {
  const authSecret = crypto.randomBytes(32).toString("hex");
  // SEC-02: credenciales admin únicas por cliente — nunca las defaults conocidas
  const seedAdminEmail = `admin@${slug}.com`;
  const seedAdminPassword = crypto.randomBytes(6).toString("hex");
  log(
    "🔐",
    `Credenciales admin generadas (guárdalas): ${seedAdminEmail} / ${seedAdminPassword}`,
    C.yellow
  );
  return `DATABASE_URL="${dbUrl}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SINGLE_TENANT="true"
NEXT_PUBLIC_TENANT_SLUG="${slug}"
BETTER_AUTH_SECRET="${authSecret}"
SEED_ADMIN_EMAIL="${seedAdminEmail}"
SEED_ADMIN_PASSWORD="${seedAdminPassword}"
`;
}

// â”€â”€â”€ Generar seed.config.json â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function generateSeedConfig(slug, name, color, opts = {}) {
  return {
    store: {
      name,
      slug,
      currency: "USD",
      locale: "es-CO",
      taxRate: 0,
      shippingCost: 0,
      niche: "servicios",
      department: "servicios",
      address: opts.address || undefined,
      mapEmbedUrl: opts.mapEmbedUrl || undefined,
      directionsUrl: opts.directionsUrl || undefined,
      appearance: {
        primaryColor: color,
        secondaryColor: "#F4F4F5",
        accentColor: "#EA580C",
        borderRadius: "0.375rem",
        shadowStyle: "shadow-xs",
      },
    },
    categories: [],
  };
}

// â”€â”€â”€ Landing estÃ¡tica de reemplazo (cuando blocks no se contrata) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function staticLandingPageSource(withLeads) {
  return `import {
	LandingHero,
	LandingWhy,
	LandingSteps,
	LandingCta,${
    withLeads
      ? `
	LandingContact,`
      : ""
  }
} from "@/features/landing/components";
import { defaultLanding } from "@/features/landing/constants/mock-cms";

export default async function StoreHomePage() {
	return (
		<>
			<LandingHero {...defaultLanding.hero} ctaLabel={defaultLanding.hero.cta} bgImage={defaultLanding.hero.bgImage ?? "" } />
			<LandingWhy
				title="Â¿Por quÃ© elegirnos?"
				subtitle="Calidad y compromiso en cada trabajo"
				features={defaultLanding.features}
			/>
			<LandingSteps
				title="CÃ³mo trabajamos"
				subtitle="Un proceso simple y transparente"
				steps={defaultLanding.steps}
			/>
			<LandingCta {...defaultLanding.cta} />${
        withLeads
          ? `
			<LandingContact
				title="ContÃ¡ctanos"
				subtitle="Te respondemos lo antes posible"
				mode="form"
				ctaLabel="Enviar mensaje"
			/>`
          : ""
      }
		</>
	);
}
`;
}

// â”€â”€â”€ Purgar archivos de mÃ³dulos deshabilitados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function purgeDisabledModules(releaseDir, enabledModules) {
  let purged = 0;

  for (const [modName, paths] of Object.entries(MODULE_PATHS)) {
    if (enabledModules.includes(modName)) continue;

    for (const relPath of paths) {
      // Manejar par�ntesis codificados por Windows/Git en URL: (admin) â†’ %28admin%29
      const variants = [relPath];
      if (relPath.includes("(admin)")) {
        variants.push(relPath.replace(/\(admin\)/g, "%28admin%29"));
      }
      if (relPath.includes("(public)")) {
        variants.push(relPath.replace(/\(public\)/g, "%28public%29"));
      }

      for (const variant of variants) {
        const fullPath = path.join(releaseDir, variant);
        if (!fs.existsSync(fullPath)) continue;

        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(fullPath);
          }
          log("  ðŸ—‘ï¸", `Purgado: ${variant}`, C.red);
          purged++;
        } catch (err) {
          log("  âš ï¸", `Error purgando ${variant}: ${err.message}`, C.yellow);
        }
      }
    }
  }

  return purged;
}

// â”€â”€â”€ Parchear imports rotos post-purge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function patchBrokenImports(releaseDir, enabledModules) {
  const disabledMods = Object.keys(MODULE_PATHS).filter(
    (m) => !enabledModules.includes(m),
  );

  if (disabledMods.length === 0) return 0;

  // Construir patrones para coincidir: nombres de carpetas de caracter�sticas desde MODULE_PATHS
  const featureFolders = disabledMods.flatMap((m) =>
    MODULE_PATHS[m]
      .filter((p) => p.startsWith("src/features/"))
      .map((p) => p.split("/")[2]), // "src/features/appointments" â†’ "appointments"
  );

  const uniqueFolders = [...new Set(featureFolders)];
  if (uniqueFolders.length === 0) return 0;

  let patched = 0;

  // Escanear todos los archivos .ts/.tsx en src/features/blocks (el lugar principal con referencias cruzadas)
  const blocksDir = path.join(releaseDir, "src", "features", "blocks");
  if (!fs.existsSync(blocksDir)) return 0;

  const scanFiles = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanFiles(full);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        patchFile(full, uniqueFolders);
      }
    }
  };

  const patchFile = (filePath, folders) => {
    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;

    for (const folder of folders) {
      // Eliminar l�neas de importaci�n que referencian la carpeta purgada
      const importRegex = new RegExp(
        `^\\s*import\\s+.*from\\s+['\"].*\\/blocks\\/${folder}\\/.*['\"].*;\\s*$`,
        "gm",
      );
      content = content.replace(importRegex, "");

      // Eliminar entradas de registro como [xxxBlock.schema.type]: xxxBlock,
      const registryRegex = new RegExp(
        `^\\s*\\[.*\\]\\s*:\\s*.*Block,?\\s*$`,
      );
      // Solo eliminar l�neas que referencian exportaciones de la carpeta purgada
      const lines = content.split("\n");
      const filtered = lines.filter((line) => {
        if (!registryRegex.test(line)) return true;
        // Verificar si esta l�nea referencia un bloque purgado
        const blockName = line.match(/(\w+Block)/);
        if (!blockName) return true;
        // Mantener la entrada si su importaci�n a�n existe; eliminar si qued� hu�rfana
        const importExists = content.includes(`import { ${blockName[1]} }`) ||
                             content.includes(`import {${blockName[1]}}`) ||
                             content.includes(`import * as`) && content.includes(blockName[1]);
        return importExists;
      });
      content = filtered.join("\n");
    }

    // Limpiar m�ltiples l�neas en blanco
    content = content.replace(/\n{3,}/g, "\n\n");

    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf-8");
      patched++;
    }
  };

  scanFiles(blocksDir);
  return patched;
}

// â”€â”€â”€ Purgar referencias cross-module â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Cuando un mÃ³dulo se deshabilita, elimina TODAS las referencias a Ã©l en otros
// archivos: imports, estado, efectos, JSX, etc. Sin stubs.

function purgeCrossModuleRefs(releaseDir, enabledModules) {
  let purged = 0;

  // Mapa de quÃ© purgar por cada mÃ³dulo deshabilitado
  const PURGE_RULES = {
    blocks: [
      {
        file: "src/db/seed.ts",
        patterns: [
          /^\s*import\s+\{\s*buildNicheLandingBlocks\s*\}\s+from\s+['"]@\/features\/blocks\/templates\/niche-landing['"];\s*$/gm,
          /\/\/\s*6\.\s*Seed default blocks[\s\S]*?console\.log\("Default landing blocks seeded successfully\."\);\s*/gm,
        ],
      },
      {
        file: "app/[domain]/(public)/layout.tsx",
        patterns: [
          /^\s*import\s+\{\s*BlockService\s*\}\s+from\s+['"]@\/features\/blocks\/services\/block\.service['"];\s*$/gm,
          /\r?\n[ \t]*\/\/ Check if store has any visible blocks configured\r?\n[ \t]*const blocks = await BlockService\.getPageBlocks\(tenantId, "home"\);\r?\n[ \t]*const hasBlocks = blocks\.some\(\(b\) => b\.visible\);/g,
        ],
        replacements: [
          { pattern: /\{!hasBlocks && (<LandingFooter \/>)\}/g, replacement: "$1" },
        ],
      },
    ],
    analytics: [
      {
        file: "app/[domain]/(public)/layout.tsx",
        patterns: [
          /^\s*import\s+\{\s*AnalyticsInjector\s*\}\s+from\s+['"]@\/features\/analytics\/components\/AnalyticsInjector['"];\s*$/gm,
          /^\s*import\s+\{\s*TrackingScripts\s*\}\s+from\s+['"]@\/features\/analytics\/components\/TrackingScripts['"];\s*$/gm,
          /\r?\n[ \t]*<AnalyticsInjector tenantId=\{tenantId\} \/>/g,
          /\r?\n[ \t]*<TrackingScripts tenantId=\{tenantId\} \/>/g,
        ],
      },
    ],
    whitelabel: [
      {
        file: "app/[domain]/(public)/layout.tsx",
        patterns: [
          /^\s*import\s+\{\s*FloatingWidgets\s*\}\s+from\s+['"]@\/components\/FloatingWidgets['"];\s*$/gm,
          /\r?\n[ \t]*\{tenantSlug && <FloatingWidgets slug=\{tenantSlug\} \/>\}/g,
        ],
      },
    ],
    leads: [
      {
        file: "src/features/dashboard/components/AdminSidebar.tsx",
        patterns: [
          /^\s*import\s+\{\s*getNewLeadsCountAction\s*\}\s+from\s+['"]@\/features\/leads\/actions\/lead\.actions['"];\s*$/gm,
          /^\s*import\s+Pusher\s+from\s+['"]pusher-js['"];\s*$/gm,
          /^\s*const\s+\[newLeadsCount,\s*setNewLeadsCount\]\s*=\s*useState\(\d+\);\s*$/gm,
          /\/\/\s*Obtener cantidad de nuevos leads[\s\S]*?\},\s*\[pathname\]\);/gm,
          /\/\/\s*Pusher[\s\S]*?\},\s*\[[\s\S]*?\]\);/gm,
          /\{\s*item\.href\s*===\s*["']\/dashboard\/leads["']\s*&&\s*newLeadsCount\s*>\s*0\s*&&\s*\([\s\S]*?<\/span>\s*\)\s*\}/gm,
        ],
      },
      {
        file: "src/features/dashboard/components/AdminSidebarMobile.tsx",
        patterns: [
          /^\s*import\s+\{\s*getNewLeadsCountAction\s*\}\s+from\s+['"]@\/features\/leads\/actions\/lead\.actions['"];\s*$/gm,
          /^\s*import\s+Pusher\s+from\s+['"]pusher-js['"];\s*$/gm,
          /^\s*const\s+\[newLeadsCount,\s*setNewLeadsCount\]\s*=\s*useState\(\d+\);\s*$/gm,
          /\/\/\s*Obtener cantidad de nuevos leads[\s\S]*?\},\s*\[pathname\]\);/gm,
          /\/\/\s*Pusher[\s\S]*?\},\s*\[[\s\S]*?\]\);/gm,
          // Sin comentario: useEffect que contiene getNewLeadsCountAction
          /useEffect\(\(\)\s*=>\s*\{[\s\S]*?getNewLeadsCountAction[\s\S]*?\},\s*\[pathname\]\);/gm,
          // Sin comentario: useEffect que contiene new Pusher
          /useEffect\(\(\)\s*=>\s*\{[\s\S]*?new Pusher[\s\S]*?\},\s*\[[\s\S]*?\]\);/gm,
          /\{\s*item\.href\s*===\s*["']\/dashboard\/leads["']\s*&&\s*newLeadsCount\s*>\s*0\s*&&\s*\([\s\S]*?<\/span>\s*\)\s*\}/gm,
        ],
      },
      {
        file: "src/features/landing/components/landing-contact/landing-contact.tsx",
        patterns: [
          /^\s*import\s+\{\s*LeadContactForm\s*\}\s+from\s+['"]@\/features\/leads\/components\/LeadContactForm['"];\s*$/gm,
          /\{\s*showForm\s*&&\s*\([\s\S]*?<LeadContactForm[\s\S]*?\)\s*\}/gm,
        ],
      },
      {
        file: "src/features/blocks/blocks/hero-cover/hero-cover.component.tsx",
        patterns: [
          /^\s*import\s+\{\s*useLeadModal\s*\}\s+from\s+['"]@\/features\/leads\/components\/LeadModalProvider['"];\s*$/gm,
          /^\s*const\s+\{\s*openLeadModal\s*\}\s*=\s*useLeadModal\(\);\s*$/gm,
          /\s*onClick=\{openLeadModal\}/gm,
          /^\s*openLeadModal\(\);\s*$/gm,
        ],
      },

      {
        file: "src/features/blocks/blocks/navbar-minimal/navbar-minimal.component.tsx",
        patterns: [
          /^\s*import\s+\{\s*useLeadModal\s*\}\s+from\s+['"]@\/features\/leads\/components\/LeadModalProvider['"];\s*$/gm,
          /^\s*const\s+\{\s*openLeadModal\s*\}\s*=\s*useLeadModal\(\);\s*$/gm,
          /\s*onClick=\{openLeadModal\}/gm,
          /^\s*openLeadModal\(\);\s*$/gm,
        ],
      },
    ],
  };

  for (const [modName, rules] of Object.entries(PURGE_RULES)) {
    if (enabledModules.includes(modName)) continue;

    for (const rule of rules) {
      const filePath = path.join(releaseDir, rule.file);
      if (!fs.existsSync(filePath)) continue;

      let content = fs.readFileSync(filePath, "utf-8");
      const original = content;

      for (const pattern of rule.patterns) {
        content = content.replace(pattern, "");
      }

      // Reemplazos con captura (pattern â†’ replacement)
      for (const rep of rule.replacements || []) {
        content = content.replace(rep.pattern, rep.replacement);
      }

      // Limpiar lÃ­neas vacÃ­as mÃºltiples
      content = content.replace(/\n{3,}/g, "\n\n");

      if (content !== original) {
        fs.writeFileSync(filePath, content, "utf-8");
        purged++;
        log("  ðŸ§¹", `Purgado cross-module: ${rule.file} (${modName})`, C.yellow);
      }
    }
  }

  return purged;
}

// â”€â”€â”€ Parchear sidebar: eliminar items adminOnly â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function patchAdminOnlySidebarItems(releaseDir) {
  const sidebarFiles = [
    path.join(releaseDir, "src", "features", "dashboard", "components", "AdminSidebar.tsx"),
    path.join(releaseDir, "src", "features", "dashboard", "components", "AdminSidebarMobile.tsx"),
  ];

  for (const filePath of sidebarFiles) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;

    // Remove the "MÃ³dulos" NAV_ITEM block (from { title: "MÃ³dulos" to the closing },)
    // Coincidir con el objeto completo incluyendo adminOnly: true
    const modulosItemRegex = /\t\{\s*\n\s*title:\s*"MÃ³dulos"[\s\S]*?adminOnly:\s*true,[\s\S]*?\},?\n/g;
    content = content.replace(modulosItemRegex, "");

    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf-8");
      log("  ðŸ—‘ï¸", `Sidebar parcheado: item "MÃ³dulos" eliminado de ${path.basename(filePath)}`, C.red);
    }
  }
}

// â”€â”€â”€ Validar build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function validateBuild(releaseDir) {
  log(C.bold, "\nðŸ”¨ Validando TypeScript...", C.cyan);
  try {
    execSync("npx tsc --noEmit", { cwd: releaseDir, stdio: "pipe" });
    log("âœ…", "TypeScript check: OK", C.green);
    return true;
  } catch {
    log("âŒ", "TypeScript check: FALLÃ“", C.red);
    return false;
  }
}

// â”€â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


// Paleta de inyeccion exclusiva del director
function sanitizeClientBlockPalette(releaseDir) {
  const p = path.join(releaseDir, "app", "[domain]", "dashboard", "blocks", "page.tsx");
  if (!fs.existsSync(p)) return;
  let c = fs.readFileSync(p, "utf-8");
  const rx = /const\s+isAdmin\s*=\s*await\s+RolesService\.hasRole\([^)]*\);/
  const cleaned = c.replace(rx, "const isAdmin = false;");
  if (cleaned !== c) {
    fs.writeFileSync(p, cleaned, "utf-8");
    log("\uD83D\uDD12", "Paleta super-admin desactivada", C.green);
  }
}

// ─── Saneamiento de seguridad del release ──────────────────────────────────
function sanitizeReleaseSecurity(releaseDir) {
  // IPs de LAN del director jamás viajan al cliente (SEC-04)
  const ipFixes = [
    { file: "next.config.ts", rx: /allowedDevOrigins:\s*\[[^\]]*\]/, to: 'allowedDevOrigins: ["localhost:3000"]' },
    { file: path.join("src","lib","auth","auth.ts"), rx: /trustedOrigins:\s*\[[\s\S]*?as string\[\],?/, to: 'trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000", "http://localhost:3001"].filter(Boolean) as string[],' },
  ];
  // Produccion del cliente sin console.* (best practice)
  const nfPath = path.join(releaseDir, "next.config.ts");
  if (fs.existsSync(nfPath)) {
    let nc = fs.readFileSync(nfPath, "utf-8");
    if (!nc.includes("removeConsole")) {
      nc = nc.replace(
        /const nextConfig: NextConfig = \{/,
        'const nextConfig: NextConfig = {\n\tcompiler: { removeConsole: { exclude: ["error", "warn"] } },'
      );
      fs.writeFileSync(nfPath, nc, "utf-8");
      log("\uD83D\uDD12", "next.config: removeConsole activado", C.green);
    }
  }

  for (const fix of ipFixes) {
    const fp = path.join(releaseDir, fix.file);
    if (!fs.existsSync(fp)) continue;
    let c = fs.readFileSync(fp, "utf-8");
    const cleaned = c.replace(fix.rx, fix.to);
    if (cleaned !== c) {
      fs.writeFileSync(fp, cleaned, "utf-8");
      log("🔒", "IPs de LAN removidas: " + fix.file, C.green);
    }
  }
  // Usuario demo con credenciales conocidas jamás viaja al cliente (SEC-02)
  const seedPath = path.join(releaseDir, "src", "db", "seed.ts");
  if (fs.existsSync(seedPath)) {
    let s = fs.readFileSync(seedPath, "utf-8");
    const cleaned = s.replace(
      /\/\/ 5\. Create user pepe[\s\S]*?\n\t\t\}(?=\r?\n\r?\n[ \t]*\/\/ 6\.)/g,
      ""
    );
    if (cleaned !== s) {
      fs.writeFileSync(seedPath, cleaned, "utf-8");
      log("🔒", "Usuario demo (pepe/12345678) removido del seed", C.green);
    }
  }
}

function main() {
  const { positional, flags } = parseArgs();
  const dryRun = flags.dryRun || false;

  console.log(`${C.bold}${C.cyan}`);
  console.log("â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—");
  console.log("â•‘   ðŸ“¦ CARVIN RELEASE - Empaquetado de Cliente        â•‘");
  console.log("â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  console.log(C.reset);

  // â”€â”€ Validar argumentos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const slug = positional[0];
  if (!slug) {
    log("âŒ", "Falta el slug del cliente. Uso: pnpm release:client <slug> --tier=business", C.red);
    process.exit(1);
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    log("âŒ", `Slug invÃ¡lido "${slug}". Solo minÃºsculas, nÃºmeros y guiones.`, C.red);
    process.exit(1);
  }

  // â”€â”€ Resolver fuente de mÃ³dulos: flag > spec > error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const allValidModules = [...CORE_MODULES, ...Object.keys(MODULE_PATHS)];
  const tierFlag = typeof flags.tier === "string" ? flags.tier : null;
  const modulesFlag = typeof flags.modules === "string" ? flags.modules : null;

  let enabledModules;
  let tier = null;
  let source = "flags";

  if (tierFlag && modulesFlag) {
    log(
      "âŒ",
      `No se puede usar --tier y --modules a la vez. Elige uno:\n` +
        `   --tier=${Object.keys(TIERS_META).join(" | ")}\n` +
        `   --modules=<lista>`,
      C.red
    );
    process.exit(1);
  }

  if (!tierFlag && !modulesFlag) {
    // Prioridad: clients/<slug>.json
    const specPath = path.join(process.cwd(), "clients", `${slug}.json`);
    if (!fs.existsSync(specPath)) {
      log("âŒ", "Falta --tier o --modules, y no existe spec del cliente.", C.red);
      console.log(`\n${C.bold}Tiers disponibles:${C.reset}`);
      for (const [name, meta] of Object.entries(TIERS_META)) {
        const resolved =
          meta.modules === "*" ? Object.keys(MODULE_PATHS) : meta.modules.join(", ");
        const badge = meta.available ? "" : ` ${C.yellow}(prÃ³ximamente)${C.reset}`;
        console.log(`  ${C.cyan}${name.padEnd(15)}${C.reset} â†’ ${resolved}${badge}`);
      }
      console.log(
        `\nO crea una spec en ${C.cyan}clients/${slug}.json${C.reset} desde /admin/modules`
      );
      process.exit(1);
    }

    let spec;
    try {
      spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
    } catch (err) {
      log("âŒ", `Spec corrupta (${specPath}): ${err.message}`, C.red);
      process.exit(1);
    }

    if (!Array.isArray(spec.modules) || spec.modules.length === 0) {
      log("âŒ", `Spec invÃ¡lida: "modules" debe ser un array no vacÃ­o.`, C.red);
      process.exit(1);
    }
    if (spec.tier !== null && spec.tier !== undefined && typeof spec.tier !== "string") {
      log("âŒ", `Spec invÃ¡lida: "tier" debe ser string o null.`, C.red);
      process.exit(1);
    }

    // Integridad: si la spec declara un tier, los mÃ³dulos deben coincidir
    if (spec.tier) {
      const tierMeta = TIERS_META[spec.tier];
      if (!tierMeta) {
        log("âŒ", `Spec invÃ¡lida: tier desconocido "${spec.tier}".`, C.red);
        process.exit(1);
      }
      if (!tierMeta.available) {
        log(
          "âŒ",
          `El tier "${spec.tier}" estÃ¡ marcado como prÃ³ximamente â€” no empaquetable.`,
          C.red
        );
        process.exit(1);
      }
      const expected = tierMeta.modules === "*" ? Object.keys(MODULE_PATHS) : tierMeta.modules;
      const same =
        expected.length === spec.modules.length &&
        expected.every((m) => spec.modules.includes(m));
      if (!same) {
        log(
          "âŒ",
          `Spec inconsistente: declara tier "${spec.tier}" pero mÃ³dulos distintos.\n` +
            `   Tier define: ${expected.join(", ")}\n` +
            `   Spec tiene:  ${spec.modules.join(", ")}\n` +
            `   Regenera la spec desde /admin/modules o usa tier:null para custom.`,
          C.red
        );
        process.exit(1);
      }
    }

    tier = spec.tier || null;
    enabledModules = [...spec.modules];
    source = "spec";

    // Pass-through opcional de datos del cliente (flags tienen prioridad)
    if (!flags.name && typeof spec.name === "string") flags.name = spec.name;
    if (!flags.color && typeof spec.color === "string") flags.color = spec.color;
    if (!flags.db && typeof spec.dbUrl === "string") flags.db = spec.dbUrl;
  }

  if (tierFlag) {
    const tierMeta = TIERS_META[tierFlag];
    if (!tierMeta) {
      log("âŒ", `Tier desconocido: "${tierFlag}". Disponibles: ${Object.keys(TIERS_META).join(", ")}`, C.red);
      process.exit(1);
    }
    if (!tierMeta.available) {
      log("âŒ", `El tier "${tierFlag}" estÃ¡ marcado como prÃ³ximamente â€” no empaquetable.`, C.red);
      process.exit(1);
    }
    tier = tierFlag;
    enabledModules =
      tierMeta.modules === "*" ? [...Object.keys(MODULE_PATHS)] : [...tierMeta.modules];
  } else if (modulesFlag) {
    enabledModules = modulesFlag.split(",").map((m) => m.trim()).filter(Boolean);
  }

  if (enabledModules.length === 0) {
    log("âŒ", "La lista de mÃ³dulos quedÃ³ vacÃ­a.", C.red);
    process.exit(1);
  }

  // Validar que todos los mÃ³dulos existen (abortar ante desconocidos)
  for (const mod of enabledModules) {
    if (!allValidModules.includes(mod)) {
      log(
        "âŒ",
        `MÃ³dulo desconocido: "${mod}". Abortando para evitar purgas incorrectas.\n` +
          `   VÃ¡lidos: ${allValidModules.join(", ")}`,
        C.red
      );
      process.exit(1);
    }
  }

  // Dedup preservando orden (un mÃ³dulo repetido no es error, solo se ignora)
  enabledModules = [...new Set(enabledModules)];

  const color = flags.color || "#F97316";
  const name = flags.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const dbUrl = flags.db || "";

  if (!dbUrl) {
    log("âŒ", "Es obligatorio proveer una URL de base de datos de pruebas (Neon) con --db=\"<neon_url>\" o en la spec del cliente.", C.red);
    process.exit(1);
  }

  if (dryRun) {
    log("âš ï¸", "Modo DRY-RUN (sin cambios reales)", C.yellow);
  }

  // â”€â”€ Resumen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, `\nðŸ“‹ Cliente: ${name}`, C.blue);
  log(C.bold, `   Slug: ${slug}`, C.blue);
  log(C.bold, `   Tier: ${tier || "(custom)"}${source === "spec" ? " [desde spec]" : ""}`, C.blue);
  log(C.bold, `   Color: ${color}`, C.blue);
  log(C.bold, `   MÃ³dulos: ${enabledModules.join(", ")}`, C.blue);
  log(C.bold, `   DB: ${dbUrl || "(placeholder â€” configurar en .env)"}`, C.blue);

  const allModules = Object.keys(MODULE_PATHS);
  const disabled = allModules.filter((m) => !enabledModules.includes(m));
  if (disabled.length > 0) {
    log(C.bold, `   Deshabilitados: ${disabled.join(", ")}`, C.yellow);
  }

  // â”€â”€ Definir ruta de salida â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const releaseDir = path.join(process.cwd(), "releases", slug);

  if (fs.existsSync(releaseDir)) {
    log("ðŸ—‘ï¸", `Release anterior encontrado: releases/${slug}/ â€” eliminando...`, C.yellow);
    fs.rmSync(releaseDir, { recursive: true, force: true });
    log("âœ…", "Release anterior eliminado", C.green);
  }

  if (dryRun) {
    log(C.cyan, `\nðŸ“ [DRY-RUN] Se crearÃ­a: releases/${slug}/`);
    log(C.cyan, "   â†’ Copiar proyecto (excluyendo .git, node_modules, .next, etc.)");
    log(C.cyan, `   â†’ Generar modules.ts con: ${enabledModules.join(", ")}`);
    log(C.cyan, `   â†’ Purgar archivos de: ${disabled.join(", ")}`);
    log(C.cyan, "   â†’ Generar .env, .env.local, seed.config.json y release.config.json");
    log(C.cyan, "   â†’ git init + commit inicial");
    log(C.green, "\nâœ… Dry-run completado.", C.bold);
    return;
  }

  // â”€â”€ 1. Copiar proyecto â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, "\nðŸ“¦ Copiando proyecto maestro...", C.cyan);

  try {
    copyDirSync(process.cwd(), releaseDir, EXCLUDE_DIRS);
    log("âœ…", "Copia completada", C.green);
    sanitizeReleaseSecurity(releaseDir);
    sanitizeClientBlockPalette(releaseDir);

  // Snapshot de DB del padre
  {
    const bdir = path.join(process.cwd(), "db-backups");
    let snapSrc = null;
    const orig = path.join(bdir, "backup-original.json");
    if (fs.existsSync(orig)) { snapSrc = orig; }
    else {
      const recent = fs.readdirSync(bdir).filter(f2 => f2.startsWith("backup-") && f2.endsWith(".json")).sort().reverse();
      if (recent.length > 0) snapSrc = path.join(bdir, recent[0]);
    }
    if (snapSrc) {
      const rbd = path.join(releaseDir, "db-backups");
      fs.mkdirSync(rbd, { recursive: true });
      fs.copyFileSync(snapSrc, path.join(rbd, "seed-snapshot.json"));
      log("\u2705", "Snapshot de DB copiado", C.green);
      try {
        const pp = path.join(releaseDir, "package.json");
        const pj = JSON.parse(fs.readFileSync(pp, "utf-8"));
        if (!pj.devDependencies) pj.devDependencies = {};
        pj.devDependencies.tsx = "^4.19.2";
        pj.scripts["db:seed"] = "tsx src/db/backup.ts restore db-backups/seed-snapshot.json";
        pj.scripts["db:backup"] = "tsx src/db/backup.ts create";
        fs.writeFileSync(pp, JSON.stringify(pj, null, 2) + "\n", "utf-8");
        log("\u2705", "db:seed apunta a snapshot del padre", C.green);
      } catch (e2) { log("\u26A0", e2.message, C.yellow); }
    } else {
      log("\u26A0\uFE0F", "Sin backup en el master - seed generico", C.yellow);
    }
  }
  } catch (err) {
    log("âŒ", `Error copiando: ${err.message}`, C.red);
    process.exit(1);
  }

  // â”€â”€ 2. Inyectar modules.ts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, "\nâš™ï¸  Generando modules.ts...", C.cyan);

  const modulesPath = path.join(releaseDir, "src", "config", "modules.ts");
  const modulesContent = generateModulesTs(enabledModules);
  fs.writeFileSync(modulesPath, modulesContent, "utf-8");
  log("âœ…", `modules.ts generado con ${enabledModules.length} mÃ³dulos habilitados`, C.green);

  // â”€â”€ 3. Purgar archivos deshabilitados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, "\nðŸ—‘ï¸  Purgando mÃ³dulos deshabilitados...", C.cyan);

  const purged = purgeDisabledModules(releaseDir, enabledModules);
  log("âœ…", `${purged} archivos/directorios eliminados`, C.green);

  // â”€â”€ 3a. Copiar stubs para dependencias de mÃ³dulos activos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, "\nðŸ“‹ Stubs: omitido (purga cross-module en su lugar)", C.cyan);

  // â”€â”€ 3b. Parchear imports rotos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const patched = patchBrokenImports(releaseDir, enabledModules);
  if (patched > 0) {
    log("âœ…", `${patched} archivos parcheados (imports rotos eliminados)`, C.green);
  }

  // â”€â”€ 3b. Purgar referencias cross-module (sin stubs) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const crossPurged = purgeCrossModuleRefs(releaseDir, enabledModules);
  if (crossPurged > 0) {
    log("âœ…", `${crossPurged} archivos purgados (referencias cross-module eliminadas)`, C.green);
  }

  // â”€â”€ 3c. Parchear sidebar: eliminar items adminOnly de NAV_ITEMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  patchAdminOnlySidebarItems(releaseDir);

  // â”€â”€ Landing estÃ¡tica si blocks no se contrata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // La page.tsx del master es 100% CMS (PageRenderer). Sin blocks se
  // reemplaza por la composiciÃ³n estÃ¡tica de secciones landing.
  if (!enabledModules.includes("blocks")) {
    const pagePath = path.join(
      releaseDir,
      "app",
      "[domain]",
      "(public)",
      "page.tsx"
    );
    fs.writeFileSync(
      pagePath,
      staticLandingPageSource(enabledModules.includes("leads")),
      "utf-8"
    );
    log("âœ…", "Landing estÃ¡tica activa (sin CMS de bloques)", C.cyan);
  }

  // â”€â”€ 4. Generar configuraciÃ³n del cliente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, "\nðŸ“ Generando configuraciÃ³n...", C.cyan);

  // .env
  const envPath = path.join(releaseDir, ".env");
  fs.writeFileSync(envPath, generateEnv(slug, dbUrl), "utf-8");
  log("âœ…", ".env generado", C.green);

  // .env.local (sobrescribe el copiado del master repo con el slug correcto)
  const envLocalPath = path.join(releaseDir, ".env.local");
  fs.writeFileSync(envLocalPath, `NEXT_PUBLIC_SINGLE_TENANT=true\nNEXT_PUBLIC_TENANT_SLUG=${slug}\n`, "utf-8");
  log("âœ…", ".env.local generado con slug correcto", C.green);

  // seed.config.json
  const seedPath = path.join(releaseDir, "seed.config.json");
  fs.writeFileSync(seedPath, JSON.stringify(generateSeedConfig(slug, name, color, {
    address: spec && spec.address,
    mapEmbedUrl: spec && spec.mapEmbedUrl,
    directionsUrl: spec && spec.directionsUrl,
  }), null, 2), "utf-8");
  log("âœ…", "seed.config.json generado", C.green);

  // release.config.json (manifiesto del release â€” lo lee update:release)
  const manifestPath = path.join(releaseDir, "release.config.json");
  const manifest = {
    slug,
    tier,
    modules: enabledModules,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  log("âœ…", "release.config.json generado", C.green);

  // Eliminar .env.example (el cliente no lo necesita)
  const envExample = path.join(releaseDir, ".env.example");
  if (fs.existsSync(envExample)) fs.unlinkSync(envExample);

  // â”€â”€ 5. Limpiar archivos innecesarios â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, "\nðŸ§¹ Limpiando archivos internos...", C.cyan);

  const filesToClean = [
    // Archivos de diagnÃ³stico y desarrollo
    "check-db.ts",
    "check-migrations.js",
    "output.txt",
    "temp_widgets.tsx",
    "implementation_plan.md",
    ".devserver.err.log",
    ".devserver.out.log",
    "tsconfig.tsbuildinfo",
    // NOTA: proxy.ts NO se elimina â€” es el middleware de Next 16 que maneja
    // el rewrite del tenant (/ -> /{slug}/...) y el route guard de mÃ³dulos.
    // Archivos del factory core â€” jamÃ¡s salen al cliente
    "AGENTS.md",
    "docker-compose.yml",
    "pnpm-workspace.yaml",
    "playwright.config.ts",
  ];

  for (const file of filesToClean) {
    const fp = path.join(releaseDir, file);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }

  // Limpiar carpetas de desarrollo y del factory core
  const dirsToClean = [
    "scratch",
    ".agents",
    "docs",     // DocumentaciÃ³n interna del factory core
    "tests",    // Tests de Playwright del core â€” fallarÃ­an en el release
    "drizzle",
    "app/[domain]/dashboard/settings/domain", // Dominios: solo el proveedor gestiona DNS  // Historial de migraciones del factory (incluye mÃ³dulos purgados)
  ];
  for (const dir of dirsToClean) {
    const dp = path.join(releaseDir, dir);
    if (fs.existsSync(dp)) fs.rmSync(dp, { recursive: true, force: true });
  }

  // â”€â”€ Inyectar permisos de build nativos de pnpm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // El master los declara en pnpm-workspace.yaml (que se purga del release),
  // asÃ­ que el cliente necesita el equivalente estÃ¡ndar en su package.json.
  // Sin esto, sharp/esbuild quedan sin binarios y el build falla.
  try {
    const pkgPath = path.join(releaseDir, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    let allowed = [];
    const wsPath = path.join(process.cwd(), "pnpm-workspace.yaml");
    if (fs.existsSync(wsPath)) {
      const ws = fs.readFileSync(wsPath, "utf-8");
      const m = ws.match(/allowBuilds:([\s\S]*?)(?:\n\S|$)/);
      if (m) {
        allowed = [...m[1].matchAll(/^\s*([A-Za-z0-9@/_.-]+):\s*true/gm)].map(
          (x) => x[1]
        );
      }
    }
    if (allowed.length === 0) {
      allowed = ["esbuild", "sharp", "msgpackr-extract", "unrs-resolver"];
    }
    pkg.pnpm = { ...(pkg.pnpm || {}), onlyBuiltDependencies: allowed };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
    log("âœ…", `pnpm.onlyBuiltDependencies inyectado (${allowed.length} paquetes nativos)`, C.green);
  } catch (err) {
    log("âš ï¸", `No se pudo inyectar pnpm.onlyBuiltDependencies: ${err.message}`, C.yellow);
  }

  // â”€â”€ Reemplazar README.md con uno especÃ­fico del cliente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // El README del repo padre menciona el boilerplate y el repo padre.
  // El cliente recibe un README enfocado solo en cÃ³mo desplegar su sitio.

  const clientReadme = `# ${name} â€” Sitio Web

Repositorio del sitio web de **${name}**.

---

## Primeros pasos

### 1. Instalar dependencias
\`\`\`bash
pnpm install
\`\`\`

### 2. Configurar variables de entorno
Edita el archivo \`.env\` con las credenciales de tu base de datos y servicios:
\`\`\`
DATABASE_URL="tu_url_de_neon_aqui"
BETTER_AUTH_SECRET="tu_secret_de_32_caracteres"
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
\`\`\`

### 3. Aplicar la base de datos
\`\`\`bash
pnpm db:push
pnpm db:seed
\`\`\`

### 4. Servidor de desarrollo
\`\`\`bash
pnpm dev
\`\`\`
Abre http://localhost:3000

---

## Panel de AdministraciÃ³n

- Accede a \`/admin\` para iniciar sesiÃ³n.
- Credenciales iniciales: las configuradas en \`.env\` (\`SEED_ADMIN_EMAIL\` / \`SEED_ADMIN_PASSWORD\`).

---

## Despliegue en Vercel (recomendado)

1. Conectar este repositorio a [Vercel](https://vercel.com).
2. Configurar las variables del \`.env\` en Vercel â†’ Settings â†’ Environment Variables.
3. El despliegue es automÃ¡tico en cada push a \`main\`.

### Comandos Ãºtiles
\`\`\`bash
pnpm build      # Build de producciÃ³n
pnpm lint       # Verificar cÃ³digo
pnpm typecheck  # Verificar tipos TypeScript
\`\`\`

---

*Sitio web de ${name}. Todos los derechos reservados.*
`;

  const readmePath = path.join(releaseDir, "README.md");
  fs.writeFileSync(readmePath, clientReadme, "utf-8");
  log("âœ…", "README.md reemplazado con versiÃ³n del cliente", C.green);

  // â”€â”€ Reemplazar DEPLOYMENT.md con guÃ­a limpia para el programador externo â”€

  const clientDeployment = `# GuÃ­a de Despliegue â€” ${name}

Este documento describe cÃ³mo desplegar el sitio web de **${name}** en producciÃ³n.

---

## Prerrequisitos

- Cuenta en [Vercel](https://vercel.com) (gratuita).
- Base de datos PostgreSQL en [Neon](https://neon.tech) (gratuita).
- Dominio propio (opcional â€” Vercel provee subdominio gratis).

---

## Despliegue en Vercel

### 1. Subir el repositorio a GitHub
\`\`\`bash
git remote add origin https://github.com/TU_ORG/${slug}.git
git push -u origin main
\`\`\`

### 2. Conectar a Vercel
1. Entra a [vercel.com](https://vercel.com) y haz clic en **Add New Project**.
2. Importa el repositorio de GitHub.
3. Framework: selecciona **Next.js** (se detecta automÃ¡ticamente).

### 3. Variables de entorno
En Vercel â†’ Settings â†’ Environment Variables, configura:

| Variable | DescripciÃ³n |
|---|---|
| \`DATABASE_URL\` | URL de conexiÃ³n a Neon PostgreSQL |
| \`BETTER_AUTH_SECRET\` | Secret de autenticaciÃ³n (mÃ­nimo 32 caracteres) |
| \`BETTER_AUTH_URL\` | URL pÃºblica del sitio (ej: https://mi-sitio.vercel.app) |
| \`NEXT_PUBLIC_APP_URL\` | URL pÃºblica del sitio |
| \`NEXT_PUBLIC_TENANT_SLUG\` | \`${slug}\` |
| \`NEXT_PUBLIC_SINGLE_TENANT\` | \`true\` |
| \`UPLOADTHING_TOKEN\` | Token de UploadThing para subida de imÃ¡genes |
| \`NEXT_PUBLIC_PUSHER_KEY\` | Clave pÃºblica de Pusher (notificaciones) |
| \`PUSHER_APP_ID\` | App ID de Pusher |
| \`PUSHER_SECRET\` | Secret de Pusher |
| \`PUSHER_CLUSTER\` | Cluster de Pusher (ej: us2) |

### 4. Primer despliegue
Haz clic en **Deploy**. Vercel construirÃ¡ y desplegarÃ¡ el sitio automÃ¡ticamente.

### 5. Inicializar la base de datos (una sola vez)
En la terminal local (con las variables de entorno configuradas en \`.env\`):
\`\`\`bash
pnpm db:push    # Crear las tablas
pnpm db:seed    # Sembrar datos iniciales y credenciales de administrador
\`\`\`

---

## Dominio personalizado

1. En Vercel â†’ Settings â†’ Domains, aÃ±ade tu dominio.
2. Apunta los DNS de tu dominio al servidor de Vercel (Vercel te indica los valores exactos).
3. SSL se configura automÃ¡ticamente.

---

## Actualizaciones

Cada push a \`main\` despliega automÃ¡ticamente la nueva versiÃ³n en Vercel.
`;

  const deploymentPath = path.join(releaseDir, "DEPLOYMENT.md");
  fs.writeFileSync(deploymentPath, clientDeployment, "utf-8");
  log("âœ…", "DEPLOYMENT.md reemplazado con guÃ­a para el cliente", C.green);



  // Eliminar pÃ¡gina de super admin (no se entrega a clientes)
  const adminModulesPaths = [
    path.join(releaseDir, "app", "[domain]", "admin", "modules"),
    path.join(releaseDir, "app", "%28admin%29", "modules"),
  ];
  for (const mp of adminModulesPaths) {
    if (fs.existsSync(mp)) {
      fs.rmSync(mp, { recursive: true, force: true });
      log("  ðŸ—‘ï¸", `Eliminado: admin/modules (super admin)`, C.red);
    }
  }

  log("âœ…", "Archivos internos limpiados", C.green);

  // â”€â”€ 6. Validar build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  validateBuild(releaseDir);

  // â”€â”€ 7. Git init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  log(C.bold, "\nðŸ”§ Inicializando repositorio...", C.cyan);

  try {
    execSync("git init", { cwd: releaseDir, stdio: "pipe" });
    execSync("git add .", { cwd: releaseDir, stdio: "pipe" });
    execSync('git commit -m "Initial release: ' + name + '"', {
      cwd: releaseDir,
      stdio: "pipe",
      env: { ...process.env, GIT_AUTHOR_NAME: "Carvin", GIT_COMMITTER_NAME: "Carvin" },
    });
    log("âœ…", "Repo inicializado con commit limpio", C.green);
  } catch (err) {
    log("âš ï¸", `Git init fallÃ³: ${err.message}`, C.yellow);
  }

  // â”€â”€ Resumen final â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  console.log(`${C.bold}${C.green}`);
  console.log("â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—");
  console.log("â•‘   âœ… RELEASE COMPLETADO                              â•‘");
  console.log("â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  console.log(C.reset);

  log(C.bold, `ðŸ“ Carpeta: releases/${slug}/`, C.green);
  log(C.bold, `ðŸ·ï¸  Tier: ${tier || "(custom)"}`, C.green);
  log(C.bold, `ðŸ“¦ MÃ³dulos: ${enabledModules.join(", ")}`, C.green);
  log(C.bold, `ðŸ—‘ï¸  Purgados: ${disabled.join(", ") || "ninguno"}`, C.green);

  console.log(`\n${C.cyan}Siguientes pasos:${C.reset}`);
  console.log(`  cd releases/${slug}`);
  console.log(`  npm install`);
  console.log(`  npx drizzle-kit push`);
  console.log(`  npx tsx src/db/seed.ts`);
  console.log(`  npm dev`);
  console.log(`\n${C.cyan}Para subir a GitHub:${C.reset}`);
  console.log(`  git remote add origin https://github.com/TU_ORG/${slug}.git`);
  console.log(`  git push -u origin main`);
}

main();

