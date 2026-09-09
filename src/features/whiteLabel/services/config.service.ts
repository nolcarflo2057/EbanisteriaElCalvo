import { db } from "@/db";
import { whiteLabelConfig } from "@/db/schema/white_label_config";
import { eq } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type WhiteLabelConfig = InferSelectModel<typeof whiteLabelConfig>;
export type NewWhiteLabelConfig = InferInsertModel<typeof whiteLabelConfig>;

/**
 * Get the configuration for a tenant.
 */
export async function getWhiteLabelConfig(tenantId: string): Promise<WhiteLabelConfig | null> {
  const rows = await db
    .select()
    .from(whiteLabelConfig)
    .where(eq(whiteLabelConfig.tenantId, tenantId))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Get the configuration by slug (used by public landing widgets).
 */
export async function getWhiteLabelConfigBySlug(slug: string): Promise<WhiteLabelConfig | null> {
  const rows = await db
    .select()
    .from(whiteLabelConfig)
    .where(eq(whiteLabelConfig.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Insert or update the configuration for a tenant.
 */
export async function upsertWhiteLabelConfig(
  tenantId: string,
  data: Partial<Omit<WhiteLabelConfig, "id" | "tenantId" | "createdAt" | "updatedAt">>
): Promise<WhiteLabelConfig> {
  const existing = await getWhiteLabelConfig(tenantId);
  if (existing) {
    const [updated] = await db
      .update(whiteLabelConfig)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(whiteLabelConfig.tenantId, tenantId))
      .returning();
    return updated;
  } else {
    const [inserted] = await db
      .insert(whiteLabelConfig)
      .values({ tenantId, ...data } as NewWhiteLabelConfig)
      .returning();
    return inserted;
  }
}
