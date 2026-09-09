import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, tenantAppearance } from "@/db/schema/core";
import { eq, and } from "drizzle-orm";
import { DEFAULT_THEME_CONFIG } from "@/core/tenant/tenant-theme.types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(DEFAULT_THEME_CONFIG);
    }

    // Buscar tenant por slug
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(and(eq(tenants.slug, slug), eq(tenants.active, true)))
      .limit(1);

    if (!tenant) {
      return NextResponse.json(DEFAULT_THEME_CONFIG);
    }

    // Obtener themeConfig de appearance
    const [appearance] = await db
      .select({ themeConfig: tenantAppearance.themeConfig })
      .from(tenantAppearance)
      .where(eq(tenantAppearance.tenantId, tenant.id))
      .limit(1);

    return NextResponse.json(appearance?.themeConfig ?? DEFAULT_THEME_CONFIG);
  } catch (error) {
    console.error("[TenantTheme API]", error);
    return NextResponse.json(DEFAULT_THEME_CONFIG);
  }
}
