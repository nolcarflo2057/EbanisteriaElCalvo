"use server";

import { requireAuth } from "@/lib/auth/auth-server";
import { RolesService } from "@/features/roles/services/roles.service";
import { getErrorMessage } from "@/lib/errors";
import { MODULES_META } from "@/config/modules";
import type { ModuleName } from "@/config/modules";
import tiersConfig from "@/config/tiers.json";
import fs from "node:fs/promises";
import path from "node:path";

const CLIENTS_DIR = path.resolve("clients");

async function verifySuperAdmin() {
  const authResult = await requireAuth();
  if (!authResult.isAuth || !authResult.session) {
    throw new Error("No autenticado");
  }
  const isAdmin = await RolesService.hasRole(
    authResult.session.user.id,
    "admin",
  );
  if (!isAdmin) {
    throw new Error("No autorizado — se requiere rol de administrador");
  }
  return { userId: authResult.session.user.id };
}

export async function getModulesAction() {
  try {
    await verifySuperAdmin();

    const modules = Object.entries(MODULES_META).map(([key, meta]) => ({
      name: key as ModuleName,
      ...meta,
    }));

    return { success: true, data: modules };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateModuleAction(
  moduleName: ModuleName,
  enabled: boolean,
) {
  try {
    await verifySuperAdmin();

    const meta = MODULES_META[moduleName];
    if (!meta) {
      return { success: false, error: `Módulo "${moduleName}" no existe` };
    }
    if (meta.core) {
      return {
        success: false,
        error: `El módulo "${meta.label}" es Core y no se puede desactivar`,
      };
    }

    const modulesFile = path.resolve("src/config/modules.ts");
    let content = await fs.readFile(modulesFile, "utf-8");

    const regex = new RegExp(`(^\\s+${moduleName}:\\s*)(true|false)(,)`, "m");
    const match = content.match(regex);
    if (!match) {
      return {
        success: false,
        error: `No se encontró la línea "${moduleName}" en modules.ts`,
      };
    }

    content = content.replace(regex, `$1${enabled}$3`);
    await fs.writeFile(modulesFile, content, "utf-8");

    return {
      success: true,
      data: { moduleName, enabled },
      warning:
        "Módulo actualizado. Ejecutá `pnpm build` para aplicar los cambios.",
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ─── Generador de Specs (Centro de Control de Empaquetado) ──────────────────

export interface ClientSpecInput {
  slug: string;
  tier: string | null;
  modules: string[];
}

export async function saveClientSpecAction(input: ClientSpecInput) {
  try {
    await verifySuperAdmin();

    // Slug: única pieza que toca el filesystem — validar estrictamente
    if (!/^[a-z0-9-]+$/.test(input.slug)) {
      return {
        success: false as const,
        error:
          "Slug inválido. Solo minúsculas, números y guiones (ej: ebanisteria-el-calvo)",
      };
    }

    const optionalNames = Object.keys(MODULES_META).filter(
      (k) => !MODULES_META[k as ModuleName].core,
    );

    // Módulos: válidos, sin duplicados
    const modulesSet = new Set(input.modules);
    for (const mod of modulesSet) {
      if (!optionalNames.includes(mod)) {
        return {
          success: false as const,
          error: `Módulo desconocido o core: "${mod}". Opcionales válidos: ${optionalNames.join(", ")}`,
        };
      }
    }
    const modules = [...modulesSet];

    if (modules.length === 0) {
      return {
        success: false as const,
        error: "Debes habilitar al menos un módulo",
      };
    }

    // Tier: si se declara, debe existir, estar disponible y coincidir con modules
    let tier: string | null = null;
    if (input.tier !== null && input.tier !== "") {
      const tierMeta =
        tiersConfig.tiers[input.tier as keyof typeof tiersConfig.tiers];
      if (!tierMeta || !("available" in tierMeta)) {
        return {
          success: false as const,
          error: `Tier desconocido: "${input.tier}"`,
        };
      }
      if (!tierMeta.available) {
        return {
          success: false as const,
          error: `El tier "${tierMeta.label}" aún no está disponible para empaquetar`,
        };
      }
      const expected =
        tierMeta.modules === "*"
          ? optionalNames
          : (tierMeta.modules as string[]);
      const same =
        expected.length === modules.length &&
        expected.every((m) => modules.includes(m));
      if (!same) {
        return {
          success: false as const,
          error: `Los módulos no coinciden con el tier "${input.tier}". Desactiva el tier o ajusta los switches.`,
        };
      }
      tier = input.tier;
    }

    const spec = {
      slug: input.slug,
      tier,
      modules,
      updatedAt: new Date().toISOString(),
    };

    await fs.mkdir(CLIENTS_DIR, { recursive: true });
    const specPath = path.join(CLIENTS_DIR, `${input.slug}.json`);
    await fs.writeFile(specPath, JSON.stringify(spec, null, 2) + "\n", "utf-8");

    // ─── PREVISUALIZACIÓN EN VIVO ─────────────────────────────────────────────
    // Actualizar src/config/modules.ts para que el dashboard y la landing se
    // actualicen en tiempo real usando el Hot Reload de Next.js
    try {
      const modulesTsPath = path.resolve("src", "config", "modules.ts");
      let modulesContent = await fs.readFile(modulesTsPath, "utf-8");

      for (const mod of optionalNames) {
        const isEnabled = modules.includes(mod);
        // Busca algo como "  leads: true," y lo reemplaza
        const regex = new RegExp(`(\\s+${mod}:\\s*)(true|false)(,)`, "g");
        modulesContent = modulesContent.replace(regex, `$1${isEnabled}$3`);
      }

      await fs.writeFile(modulesTsPath, modulesContent, "utf-8");
    } catch (updateError) {
      console.error("No se pudo actualizar modules.ts para la vista previa:", updateError);
    }
    // ──────────────────────────────────────────────────────────────────────────

    return {
      success: true as const,
      data: { specPath: `clients/${input.slug}.json`, spec },
    };
  } catch (error: unknown) {
    return { success: false as const, error: getErrorMessage(error) };
  }
}

export async function getClientSpecsAction() {
  try {
    await verifySuperAdmin();

    let files: string[] = [];
    try {
      files = await fs.readdir(CLIENTS_DIR);
    } catch {
      return { success: true as const, data: [] };
    }

    const specs = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = JSON.parse(
          await fs.readFile(path.join(CLIENTS_DIR, file), "utf-8"),
        );
        if (typeof raw?.slug === "string" && Array.isArray(raw?.modules)) {
          specs.push({
            slug: raw.slug as string,
            tier: typeof raw.tier === "string" ? raw.tier : null,
            modules: raw.modules as string[],
            updatedAt:
              typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
          });
        }
      } catch {
        continue;
      }
    }

    specs.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
    return { success: true as const, data: specs };
  } catch (error: unknown) {
    return { success: false as const, error: getErrorMessage(error) };
  }
}

export async function deleteClientSpecAction(slug: string) {
  try {
    await verifySuperAdmin();

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return { success: false as const, error: "Slug inválido" };
    }

    const specPath = path.join(CLIENTS_DIR, `${slug}.json`);
    await fs.unlink(specPath);

    return { success: true as const, data: { slug } };
  } catch (error: unknown) {
    return { success: false as const, error: getErrorMessage(error) };
  }
}
