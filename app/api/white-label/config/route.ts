import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import {
  getWhiteLabelConfig,
  getWhiteLabelConfigBySlug,
  upsertWhiteLabelConfig,
} from "@/features/whiteLabel/services/config.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/white-label/config?slug=mi-tienda
 * GET /api/white-label/config (usa el tenantId resuelto por hostname)
 */
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");

    if (slug) {
      const config = await getWhiteLabelConfigBySlug(slug);
      if (config) {
        return NextResponse.json(config, { status: 200 });
      }
      // Fallback: si el slug no matchea (drift de datos), resolver por tenantId
      // del host. Evita que los widgets desaparezcan por inconsistencia de slugs.
      const tenantId = await getTenantIdFromHeaders();
      const byTenant = tenantId ? await getWhiteLabelConfig(tenantId) : null;
      return NextResponse.json(byTenant ?? { error: "Config not found" }, {
        status: byTenant ? 200 : 404,
      });
    }

    const tenantId = await getTenantIdFromHeaders();
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const config = await getWhiteLabelConfig(tenantId);
    return NextResponse.json(config ?? {});
  } catch (error) {
    console.error("[white-label/config] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/white-label/config — crea (o actualiza) la config del tenant.
 */
export async function POST(req: NextRequest) {
  try {
    const tenantId = await getTenantIdFromHeaders();
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const body = await req.json();
    const config = await upsertWhiteLabelConfig(tenantId, body);
    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    console.error("[white-label/config] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/white-label/config — actualiza la config del tenant.
 */
export async function PUT(req: NextRequest) {
  try {
    const tenantId = await getTenantIdFromHeaders();
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const body = await req.json();
    const config = await upsertWhiteLabelConfig(tenantId, body);
    return NextResponse.json(config);
  } catch (error) {
    console.error("[white-label/config] PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}