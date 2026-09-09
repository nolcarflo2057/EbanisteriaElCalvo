#!/usr/bin/env node

/**
 * scripts/update-release.js
 *
 * Actualiza un release existente con los últimos cambios del repo maestro.
 * Preserva .env, .env.local, seed.config.json, release.config.json y node_modules.
 *
 * Uso:
 *   pnpm update:release <slug>
 *   pnpm update:release ebanisteria-el-calvo-v2
 *
 * Los módulos NO se pasan por flag: se leen del manifiesto
 * release.config.json que release:client generó dentro del release.
 * (Fallback legacy: parsea modules.ts si el manifiesto no existe.)
 *
 * Flujo:
 *   1. Lee release.config.json, .env y seed.config.json del release actual
 *   2. Copia proyecto maestro al release (excluyendo .git, node_modules, .next, etc.)
 *   3. Restaura config preservada
 *   4. Re-genera modules.ts con los módulos del manifiesto
 *   5. Purga archivos de módulos deshabilitados + referencias cross-module
 *   6. Parchea imports rotos y sidebar adminOnly
 *   7. NO reinstala dependencias (ya existen)
 *   8. NO re-seedea (datos ya en DB)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ─── Colores ─────────────────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(icon, msg, color = C.reset) {
  console.log(`${color}${icon}${C.reset} ${msg}`);
}

// ─── Exclusiones de copia ────────────────────────────────────────────────────

const EXCLUDE_DIRS = [
  ".git",
  "node_modules",
  ".next",
  "db-backups",
  "releases",
  "clients",
  ".agents",
  "docs",
  "scratch",
];

const EXCLUDE_FILES = [
  "check-db.ts",
  "check-migrations.js",
  "output.txt",
  "temp_widgets.tsx",
  "implementation_plan.md",
  ".devserver.err.log",
  ".devserver.out.log",
  "dev.err",
  "dev.log",
  "dev.out",
  "devlog.txt",
  "devlog.err",
  "tsconfig.tsbuildinfo",
  ".env.example",
  "README.md",
  "client-readme.template.md",
];

// Archivos de log/basura que jamás deben viajar al empaquetado del cliente.
const JUNK_FILE_REGEX = /^(?:\.devserver\..*|dev(?:log)?\.(?:err|out|log)|dev\.log|output\.txt|.*\.(?:log|tsbuildinfo))$/i;

// ─── Copia recursiva ─────────────────────────────────────────────────────────

function copyDirSync(src, dest, excludes) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (excludes.includes(entry.name)) continue;
    if (JUNK_FILE_REGEX.test(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, excludes);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ─── Module config (copiado de release-client.js) ────────────────────────────

const CORE_MODULES = ["auth", "users", "roles", "settings", "uploads", "notifications", "audit"];

// SOLO módulos con implementación real en el master (carpeta física).
const MODULE_PATHS = {
  landing: ["src/features/landing", "app/[domain]/(public)/page.tsx"],
  blocks: ["src/features/blocks", "app/[domain]/dashboard/blocks"],
  leads: [
    "src/features/leads",
    "app/(admin)/leads",
    "app/[domain]/dashboard/leads",
    "app/api/contact",
  ],
  appointments: ["src/features/appointments", "src/features/blocks/blocks/appointments", "app/(admin)/appointments", "app/[domain]/dashboard/appointments"],
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

// Landing estática de reemplazo cuando blocks no se contrata.
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
				title="Â¿Por qué elegirnos?"
				subtitle="Calidad y compromiso en cada trabajo"
				features={defaultLanding.features}
			/>
			<LandingSteps
				title="Cómo trabajamos"
				subtitle="Un proceso simple y transparente"
				steps={defaultLanding.steps}
			/>
			<LandingCta {...defaultLanding.cta} />${
        withLeads
          ? `
			<LandingContact
				title="Contáctanos"
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

const CORE_LABELS = {
  auth: { label: "Autenticación", description: "Login, registro y sesiones de usuarios" },
  users: { label: "Usuarios", description: "Gestión de cuentas y perfiles de usuario" },
  roles: { label: "Roles", description: "Sistema de permisos y roles (admin, editor, etc.)" },
  settings: { label: "Configuración", description: "Ajustes generales de la tienda (moneda, idioma, envíos)" },
  uploads: { label: "Archivos", description: "Subida y gestión de imágenes y documentos" },
  notifications: { label: "Notificaciones", description: "Sistema de notificaciones push y email" },
  audit: { label: "Auditoría", description: "Registro de acciones y logs de seguridad" },
};

const MODULES_LABELS = {
  landing: { label: "Landing Page", description: "Página pública de la tienda con diseño personalizable" },
  blocks: { label: "Editor de Bloques", description: "Constructor visual de secciones (hero, CTA, galería)" },
  leads: { label: "Leads de Contacto", description: "Mensajes y formularios del formulario de la landing" },
  appointments: { label: "Citas", description: "Agendamiento de citas desde la landing" },
  analytics_traffic: { label: "Métricas de tráfico", description: "Google Analytics 4" },
  analytics_conversions: { label: "Conversiones", description: "Meta Pixel, Google Ads, TikTok Pixel" },
  analytics_behavior: { label: "Comportamiento", description: "Google Tag Manager" },
  whitelabel_whatsapp: { label: "Botón de WhatsApp", description: "Widget flotante de WhatsApp" },
  whitelabel_chatbot_simple: { label: "Chatbot Simple", description: "Chatbot con respuestas predefinidas" },
  whitelabel_chatbot_advanced: { label: "Chatbot Avanzado (IA)", description: "Chatbot con IA generativa" },
  analytics: { label: "Analíticas", description: "Píxeles de conversión y analítica web (GA4, Meta, TikTok)" },
  whitelabel: { label: "Marca Blanca", description: "Personalización avanzada de identidad (chat, WhatsApp, branding)" },
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

// ─── Generar modules.ts ─────────────────────────────────────────────────────

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
 * @description Configuración de módulos para este cliente.
 * Generado automáticamente por release:client.
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
 * Verifica si un módulo opcional está activo.
 */
export function isModuleEnabled(moduleName: ModuleName): boolean {
  return enabledModules[moduleName];
}

/**
 * Verifica si una ruta pertenece a un módulo inactivo.
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

// ─── Purgar módulos deshabilitados ───────────────────────────────────────────

function purgeDisabledModules(releaseDir, enabledModules) {
  let purged = 0;
  const disabledMods = Object.keys(MODULE_PATHS).filter(
    (m) => !enabledModules.includes(m)
  );

  for (const mod of disabledMods) {
    const paths = MODULE_PATHS[mod];
    for (const relPath of paths) {
      const variants = [
        path.join(releaseDir, relPath),
        path.join(releaseDir, relPath.replace(/\(/g, "%28").replace(/\)/g, "%29")),
      ];
      for (const targetPath of variants) {
        if (fs.existsSync(targetPath)) {
          fs.rmSync(targetPath, { recursive: true, force: true });
          log("ðŸ—‘ï¸", `Purgado: ${path.relative(releaseDir, targetPath)}`, C.red);
          purged++;
        }
      }
    }
  }
  return purged;
}

// ─── Parchear imports rotos ─────────────────────────────────────────────────

function patchBrokenImports(releaseDir, enabledModules) {
  const disabledMods = Object.keys(MODULE_PATHS).filter(
    (m) => !enabledModules.includes(m)
  );
  const featureFolders = disabledMods.flatMap((m) =>
    MODULE_PATHS[m]
      .filter((p) => p.startsWith("src/features/"))
      .map((p) => p.split("/")[2])
  );
  const uniqueFolders = [...new Set(featureFolders)];
  if (uniqueFolders.length === 0) return 0;

  let patched = 0;
  const blocksDir = path.join(releaseDir, "src", "features", "blocks");
  if (!fs.existsSync(blocksDir)) return 0;

  const scanFiles = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) scanFiles(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) patchFile(full, uniqueFolders);
    }
  };

  const patchFile = (filePath, folders) => {
    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;
    for (const folder of folders) {
      const importRegex = new RegExp(
        `^\\s*import\\s+.*from\\s+['\"].*\\/blocks\\/${folder}\\/.*['\"].*;\\s*$`, "gm"
      );
      content = content.replace(importRegex, "");
      const registryRegex = new RegExp(`^\\s*\\[.*\\]\\s*:\\s*.*Block,?\\s*$`);
      const lines = content.split("\n");
      const filtered = lines.filter((line) => {
        if (!registryRegex.test(line)) return true;
        const blockName = line.match(/(\w+Block)/);
        if (!blockName) return true;
        return content.includes(`import { ${blockName[1]} }`);
      });
      content = filtered.join("\n");
    }
    content = content.replace(/\n{3,}/g, "\n\n");
    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf-8");
      patched++;
    }
  };

  scanFiles(blocksDir);
  return patched;
}

// ─── Purgar referencias cross-module ─────────────────────────────────────────

function purgeCrossModuleRefs(releaseDir, enabledModules) {
  let purged = 0;

  const PURGE_RULES = {
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
          /useEffect\(\(\)\s*=>\s*\{[\s\S]*?getNewLeadsCountAction[\s\S]*?\},\s*\[pathname\]\);/gm,
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
    whitelabel: [
      {
        file: "app/[domain]/(public)/layout.tsx",
        patterns: [
          /^\s*import\s+\{\s*FloatingWidgets\s*\}\s+from\s+['"]@\/components\/FloatingWidgets['"];\s*$/gm,
          /\r?\n[ \t]*\{tenantSlug && <FloatingWidgets slug=\{tenantSlug\} \/>\}/g,
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
      for (const rep of rule.replacements || []) {
        content = content.replace(rep.pattern, rep.replacement);
      }
      content = content.replace(/\n{3,}/g, "\n\n");
      if (content !== original) {
        fs.writeFileSync(filePath, content, "utf-8");
        purged++;
      }
    }
  }
  return purged;
}

// ─── Parchear sidebar: eliminar items adminOnly ──────────────────────────────

function patchAdminOnlySidebarItems(releaseDir) {
  const sidebarFiles = [
    path.join(releaseDir, "src", "features", "dashboard", "components", "AdminSidebar.tsx"),
    path.join(releaseDir, "src", "features", "dashboard", "components", "AdminSidebarMobile.tsx"),
  ];
  for (const filePath of sidebarFiles) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;
    const modulosItemRegex = /\t\{\s*\n\s*title:\s*"Módulos"[\s\S]*?adminOnly:\s*true,[\s\S]*?\},?\n/g;
    content = content.replace(modulosItemRegex, "");
    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf-8");
      log("ðŸ—‘ï¸", `Sidebar parcheado: item "Módulos" eliminado de ${path.basename(filePath)}`, C.red);
    }
  }
}

// ─── README de cliente (plantilla amigable, no el README tecnico del padre) ───

function writeClientReadme(releaseDir, slug) {
  const tplPath = path.join(process.cwd(), "scripts", "client-readme.template.md");
  if (!fs.existsSync(tplPath)) return;
  let tpl = fs.readFileSync(tplPath, "utf-8");
  tpl = tpl.replace(/\{\{SLUG\}\}/g, slug);
  fs.writeFileSync(path.join(releaseDir, "README.md"), tpl, "utf-8");
  log("✅", "README de cliente generado (plantilla amigable)", C.green);
}

// ─── Main ────────────────────────────────────────────────────────────────────


// ─── Saneamiento de seguridad del release ──────────────────────────────────

// La paleta de inyección de bloques es EXCLUSIVA del director de la fábrica.
function sanitizeClientBlockPalette(releaseDir) {
  const p = path.join(
    releaseDir,
    "app",
    "[domain]",
    "dashboard",
    "blocks",
    "page.tsx"
  );
  if (!fs.existsSync(p)) return;
  let c = fs.readFileSync(p, "utf-8");
  const rx =
    /const\s+isAdmin\s*=\s*await\s+RolesService\.hasRole\([^)]*\);/;
  const cleaned = c.replace(rx, "const isAdmin = false;");
  if (cleaned !== c) {
    fs.writeFileSync(p, cleaned, "utf-8");
    log("🔒", "Paleta super-admin desactivada en blocks (cliente)", C.green);
  }
}
function sanitizeReleaseSecurity(releaseDir) {
  // IPs de LAN del director jamás viajan al cliente (SEC-04)
  const ipFixes = [
    { file: "next.config.ts", rx: /allowedDevOrigins:\s*\[[^\]]*\]/, to: 'allowedDevOrigins: ["localhost:3000"]' },
    { file: path.join("src","lib","auth","auth.ts"), rx: /trustedOrigins:\s*\[[\s\S]*?as string\[\],?/, to: 'trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000", "http://localhost:3001"].filter(Boolean) as string[],' },
  ];
  // Producción del cliente sin console.* (best practice) — dev los conserva
  const nfPath = path.join(releaseDir, "next.config.ts");
  if (fs.existsSync(nfPath)) {
    let nc = fs.readFileSync(nfPath, "utf-8");
    if (!nc.includes("removeConsole")) {
      nc = nc.replace(
        /const nextConfig: NextConfig = \{/,
        'const nextConfig: NextConfig = {\n\tcompiler: { removeConsole: { exclude: ["error", "warn"] } },'
      );
      fs.writeFileSync(nfPath, nc, "utf-8");
      log("🔒", "next.config: removeConsole activado (producción limpia)", C.green);
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


// ─── Verificador de imports huérfanos (gate de calidad) ─────────────────────

function walkCodeFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
      walkCodeFiles(full, out);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function verifyOrphanImports(releaseDir, enabledModules) {
  const tokens = [];
  for (const mod of Object.keys(MODULE_PATHS)) {
    if (enabledModules.includes(mod)) continue;
    if (mod === "whitelabel") {
      tokens.push("@/features/whiteLabel", "@/components/FloatingWidgets");
      continue;
    }
    const map = {
      landing: ["@/features/landing"],
      blocks: ["@/features/blocks"],
      leads: ["@/features/leads"],
      appointments: ["@/features/appointments"],
      analytics: ["@/features/analytics"],
      blog: ["@/featurebs/blogs"],
      billing: ["@/features/billing"],
      ecommerce: ["@/features/ecommerce", "@/features/products"],
    };
    (map[mod] || []).forEach((t) => tokens.push(t));
  }
  if (!tokens.length) return 0;

  const files = [
    ...walkCodeFiles(path.join(releaseDir, "src")),
    ...walkCodeFiles(path.join(releaseDir, "app")),
  ];

  let orphans = 0;
  for (const file of files) {
    const lines = fs.readFileSync(file, "utf-8").split("\n");
    lines.forEach((line, i) => {
      if (tokens.some((t) => line.includes(t))) {
        orphans++;
        log("❌", "Huérfano: " + path.relative(releaseDir, file) + ":" + (i + 1), C.red);
        log("   ", line.trim().slice(0, 90), C.red);
      }
    });
  }
  return orphans;
}

function main() {
  const args = process.argv.slice(2);
  const slug = args[0];

  console.log(`${C.bold}${C.cyan}`);
  console.log("â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—");
  console.log("â•‘   ðŸ”„ CARVIN UPDATE - Actualizar Release         â•‘");
  console.log("â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  console.log(C.reset);

  if (!slug) {
    log("âŒ", "Falta el slug. Uso: node scripts/update-release.js <slug>", C.red);
    process.exit(1);
  }

  const releaseDir = path.join(process.cwd(), "releases", slug);

  if (!fs.existsSync(releaseDir)) {
    log("âŒ", `No existe releases/${slug}/. Usá release:client para crear uno nuevo.`, C.red);
    process.exit(1);
  }

  // 1. Leer config actual del release
  log(C.bold, "\nðŸ“‹ [1/6] Leyendo config del release actual...", C.cyan);

  const envPath = path.join(releaseDir, ".env");
  const envLocalPath = path.join(releaseDir, ".env.local");
  const seedPath = path.join(releaseDir, "seed.config.json");
  const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : null;
  const envLocalContent = fs.existsSync(envLocalPath) ? fs.readFileSync(envLocalPath, "utf-8") : null;
  const seedContent = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, "utf-8") : null;

  // Manifiesto del release (fuente de verdad para tier + módulos)
  const manifestPath = path.join(releaseDir, "release.config.json");
  let manifest = null;
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      log(
        "âœ…",
        `release.config.json leído${manifest.tier ? ` (tier: ${manifest.tier})` : ""}`,
        C.green
      );
    } catch (err) {
      log("âŒ", `release.config.json corrupto: ${err.message}`, C.red);
      process.exit(1);
    }
  }

  // FUENTE DE VERDAD: estado actual del master
  // Lo que esta prendido en /admin/modules ES lo que viaja al release.
  const masterModulesPath = path.resolve(process.cwd(), "src", "config", "modules.ts");
  let enabledModules = [];

  if (fs.existsSync(masterModulesPath)) {
    const masterContent = fs.readFileSync(masterModulesPath, "utf-8");
    const match = masterContent.match(/export const enabledModules = \{([\s\S]*?)\} as const/);
    if (match) {
      const modLines = match[1].split("\n");
      for (const line of modLines) {
        const m = line.match(/^\s*(\w+):\s*(true|false)/);
        if (m && m[2] === "true" && !CORE_MODULES.includes(m[1])) {
          enabledModules.push(m[1]);
        }
      }
    }
  }

  if (enabledModules.length === 0) {
    log("\u274C", "El master no tiene ningun modulo opcional activado.", C.red);
    log("  ", "Activa modulos desde /admin/modules y reintenta.", C.yellow);
    process.exit(1);
  }

  log("âœ…", `Módulos detectados: ${enabledModules.join(", ")}`, C.green);
  if (envContent) log("âœ…", ".env preservado", C.green);
  if (envLocalContent) log("âœ…", ".env.local preservado", C.green);
  if (seedContent) log("âœ…", "seed.config.json preservado", C.green);

  // 2. Copiar proyecto maestro
  log(C.bold, "\nðŸ“¦ [2/6] Copiando proyecto maestro...", C.cyan);
  copyDirSync(process.cwd(), releaseDir, [...EXCLUDE_DIRS, ...EXCLUDE_FILES]);
  log("âœ…", "Copia completada", C.green);
    sanitizeReleaseSecurity(releaseDir);
    sanitizeClientBlockPalette(releaseDir);
    writeClientReadme(releaseDir, slug);

  // ── Copiar snapshot de DB del padre (idéntico a release-client) ───────────
  {
    const backupDir = path.join(process.cwd(), "db-backups");
    const candidates = [
      path.join(backupDir, "backup-original.json"),
    ];
    if (fs.existsSync(backupDir)) {
      const recent = fs
        .readdirSync(backupDir)
        .filter((f) => f.startsWith("backup-") && f.endsWith(".json") && f !== "backup-original.json")
        .sort()
        .reverse();
      if (recent.length > 0) candidates.push(path.join(backupDir, recent[0]));
    }

    const snapshotSrc = candidates.find((p) => fs.existsSync(p));

    if (snapshotSrc) {
      const releaseBackupDir = path.join(releaseDir, "db-backups");
      fs.mkdirSync(releaseBackupDir, { recursive: true });
      const snapshotDest = path.join(releaseBackupDir, "seed-snapshot.json");
      fs.copyFileSync(snapshotSrc, snapshotDest);
      log("✅", "Snapshot de DB copiado -> db-backups/seed-snapshot.json", C.green);

      try {
        const pkgReleasePath = path.join(releaseDir, "package.json");
        const pkgRelease = JSON.parse(fs.readFileSync(pkgReleasePath, "utf-8"));
        pkgRelease.scripts["db:seed"] = "tsx src/db/backup.ts restore db-backups/seed-snapshot.json";
        if (!pkgRelease.devDependencies) pkgRelease.devDependencies = {};
        pkgRelease.devDependencies.tsx = "^4.19.2";
        pkgRelease.scripts["db:backup"] = "tsx src/db/backup.ts create";
        pkgRelease.scripts["db:restore"] = "tsx src/db/backup.ts restore";
        fs.writeFileSync(pkgReleasePath, JSON.stringify(pkgRelease, null, 2) + "\n", "utf-8");
        log("✅", "db:seed del release actualizado", C.green);
      } catch (err) {
        log("⚠️", "No se pudo actualizar db:seed en package.json: " + err.message, C.yellow);
      }
    } else {
      log("⚠️", "Sin backup en el master — el release usará seed genérico", C.yellow);
    }
  }

  // 3. Restaurar .env, .env.local y seed.config.json
  log(C.bold, "\nðŸ“ [3/6] Restaurando configuración...", C.cyan);
  if (envContent) {
    fs.writeFileSync(envPath, envContent, "utf-8");
    log("âœ…", ".env restaurado", C.green);
  }
  if (envLocalContent) {
    fs.writeFileSync(envLocalPath, envLocalContent, "utf-8");
    log("âœ…", ".env.local restaurado", C.green);
  }
  if (seedContent) {
    fs.writeFileSync(seedPath, seedContent, "utf-8");
    log("âœ…", "seed.config.json restaurado", C.green);
  }
  if (manifest) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
    log("âœ…", "release.config.json restaurado", C.green);
  }

  // 4. Regenerar modules.ts
  log(C.bold, "\nâš™ï¸  [4/6] Regenerando modules.ts...", C.cyan);
  const modulesPath = path.join(releaseDir, "src", "config", "modules.ts");
  fs.writeFileSync(modulesPath, generateModulesTs(enabledModules), "utf-8");
  log("âœ…", "modules.ts regenerado", C.green);

  // 5. Purgar módulos deshabilitados
  log(C.bold, "\nðŸ—‘ï¸  [5/6] Purgando módulos deshabilitados...", C.cyan);
  const purged = purgeDisabledModules(releaseDir, enabledModules);
  log("âœ…", `${purged} archivos eliminados`, C.green);

  // 5b. Purgar referencias cross-module (sin stubs)
  log(C.bold, "\nðŸ“‹ [5b] Purgando referencias cross-module...", C.cyan);
  const crossPurged = purgeCrossModuleRefs(releaseDir, enabledModules);
  if (crossPurged > 0) {
    log("âœ…", `${crossPurged} archivos purgados (referencias cross-module eliminadas)`, C.green);
  } else {
    log("âœ…", "No hay referencias cross-module pendientes", C.green);
  }

  // 5c. Landing estática si blocks no se contrata (el master page.tsx es CMS)
  if (!enabledModules.includes("blocks")) {
    const pagePath = path.join(releaseDir, "app", "[domain]", "(public)", "page.tsx");
    fs.writeFileSync(pagePath, staticLandingPageSource(enabledModules.includes("leads")), "utf-8");
    log("âœ…", "Landing estática activa (sin CMS de bloques)", C.green);
  }

  // 6. Parchear imports y sidebar
  log(C.bold, "\nðŸ”§ [6/6] Parcheando imports y sidebar...", C.cyan);
  const patched = patchBrokenImports(releaseDir, enabledModules);
  if (patched > 0) {
    log("âœ…", `${patched} archivos parcheados (imports)`, C.green);
  }
  patchAdminOnlySidebarItems(releaseDir);

  // Limpiar admin/modules
  const adminModulesPaths = [
    path.join(releaseDir, "app", "[domain]", "admin", "modules"),
    path.join(releaseDir, "app", "%28admin%29", "modules"),
  ];
  for (const mp of adminModulesPaths) {
    if (fs.existsSync(mp)) {
      fs.rmSync(mp, { recursive: true, force: true });
      log("ðŸ—‘ï¸", "Eliminado: admin/modules", C.red);
    }
  }


  // Gate de calidad: cero imports huerfanos tras la purga
  const orphanCount = verifyOrphanImports(releaseDir, enabledModules);
  if (orphanCount > 0) {
    log("❌", "EMPACADO INVALIDO: " + orphanCount + " referencias a modulos purgados. Revisa PURGE_RULES.", C.red);
    process.exit(1);
  }
  log("✅", "Gate de calidad: cero referencias huerfanas", C.green);

  // Resumen
  console.log(`\n${C.bold}${C.green}`);
  console.log("â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—");
  console.log("â•‘   âœ… RELEASE ACTUALIZADO                         â•‘");
  console.log("â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  console.log(C.reset);

  log(C.cyan, "ðŸ“", `Carpeta: releases/${slug}/`);
  log(C.cyan, "ðŸ“¦", `Módulos: ${enabledModules.join(", ")}`);
  log(C.cyan, "ðŸ”„", "Code actualizado, config preservada");

  console.log(`\n${C.bold}Siguientes pasos:${C.reset}`);
  console.log(`  cd releases/${slug}`);
  console.log(`  pnpm install          # Solo si cambiaron dependencias`);
  console.log(`  pnpm dlx drizzle-kit push  # Si cambiaste el schema DB`);
  console.log(`  pnpm dev`);
}

main();

