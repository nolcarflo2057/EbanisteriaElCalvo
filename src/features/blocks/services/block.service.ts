import { db } from "@/db";
import { tenantPageBlocks, tenants } from "@/db/schema/core";
import { eq, and, asc } from "drizzle-orm";
import type { BlockInstance, BlockSchema } from "@/features/blocks/types/schema";
import { blockRegistry } from "../registry";

export interface PageBlockRow extends BlockInstance {}

/**
 * Elimina claves con valor `undefined` para que no aplasten los `defaultProps`
 * al hacer spread (clásico `{ ...defaultProps, ...props }`).
 */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj)) {
		if (v !== undefined) out[k] = v;
	}
	return out as T;
}

export class BlockService {
	/**
	 * Obtiene los bloques de una página del tenant, en orden.
	 */
	static async getPageBlocks(tenantId: string, pageKey = "home"): Promise<PageBlockRow[]> {
		const result = await db
			.select()
			.from(tenantPageBlocks)
			.where(and(
				eq(tenantPageBlocks.tenantId, tenantId),
				eq(tenantPageBlocks.pageKey, pageKey)
			))
			.orderBy(asc(tenantPageBlocks.order));

		return result.map((b) => {
			const def = blockRegistry[b.blockType];
			const defaultProps = (def?.defaultProps ?? {}) as Record<string, unknown>;
			const saved = (b.props ?? {}) as Record<string, unknown>;
			// Merge seguro: los valores `undefined` guardados NO deben pisar defaultProps.
			const merged: Record<string, unknown> = { ...defaultProps };
			for (const [k, v] of Object.entries(saved)) {
				if (v !== undefined) merged[k] = v;
			}
			return {
				id: b.id,
				tenantId: b.tenantId,
				pageKey: b.pageKey,
				blockType: b.blockType,
				label: b.label,
				props: merged,
				visible: b.visible,
				order: b.order,
				createdAt: b.createdAt,
				updatedAt: b.updatedAt,
			};
		});
	}

	/**
	 * Obtiene los overrides de schema de bloques del tenant (tenants.blockSchemas).
	 */
	static async getStoreBlockSchemas(tenantId: string): Promise<BlockSchema[]> {
		const [row] = await db
			.select({ blockSchemas: tenants.blockSchemas })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		const raw = row?.blockSchemas;
		const safe = Array.isArray(raw) ? raw : [];
		return safe as unknown as BlockSchema[];

	}

	/**
	 * Crea un bloque en una página. El order se asigna al final (max + 1).
	 */
	static async createBlock(data: {
		tenantId: string;
		pageKey?: string;
		blockType: string;
		label?: string | null;
		props: Record<string, unknown>;
		visible?: boolean;
	}): Promise<PageBlockRow> {
		const pageKey = data.pageKey ?? "home";
		const existing = await db
			.select({ order: tenantPageBlocks.order })
			.from(tenantPageBlocks)
			.where(and(
				eq(tenantPageBlocks.tenantId, data.tenantId),
				eq(tenantPageBlocks.pageKey, pageKey)
			))
			.orderBy(asc(tenantPageBlocks.order));

		const nextOrder = existing.length ? (existing[existing.length - 1].order ?? 0) + 1 : 0;

		const [created] = await db
			.insert(tenantPageBlocks)
			.			values({
				tenantId: data.tenantId,
				pageKey,
				blockType: data.blockType,
				label: data.label ?? null,
				props: stripUndefined(data.props ?? {}),
				visible: data.visible ?? true,
				order: nextOrder,
			})
			.returning();

		return {
			id: created.id,
			tenantId: created.tenantId,
			pageKey: created.pageKey,
			blockType: created.blockType,
			label: created.label,
			props: (created.props ?? {}) as Record<string, unknown>,
			visible: created.visible,
			order: created.order,
			createdAt: created.createdAt,
			updatedAt: created.updatedAt,
		};
	}

	/**
	 * Actualiza props / visibilidad / label de un bloque.
	 */
	static async updateBlock(
		id: string,
		data: { props?: Record<string, unknown>; visible?: boolean; label?: string | null }
	): Promise<void> {
		await db
			.update(tenantPageBlocks)
			.set({
				...(data.props !== undefined ? { props: stripUndefined(data.props) } : {}),
				...(data.visible !== undefined ? { visible: data.visible } : {}),
				...(data.label !== undefined ? { label: data.label } : {}),
				updatedAt: new Date(),
			})
			.where(eq(tenantPageBlocks.id, id));
	}

	/**
	 * Reordena los bloques de una página a partir de una lista de ids en orden.
	 */
	static async reorderBlocks(tenantId: string, pageKey: string, orderedIds: string[]): Promise<void> {
		await db.transaction(async (tx) => {
			for (let i = 0; i < orderedIds.length; i++) {
				await tx
					.update(tenantPageBlocks)
					.set({ order: i, updatedAt: new Date() })
					.where(and(
						eq(tenantPageBlocks.id, orderedIds[i]),
						eq(tenantPageBlocks.tenantId, tenantId),
						eq(tenantPageBlocks.pageKey, pageKey)
					));
			}
		});
	}

	/**
	 * Elimina un bloque.
	 */
	static async deleteBlock(id: string): Promise<void> {
		await db.delete(tenantPageBlocks).where(eq(tenantPageBlocks.id, id));
	}
}
