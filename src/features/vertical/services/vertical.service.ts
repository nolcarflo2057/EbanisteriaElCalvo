import { db } from "@/db";
import { tenants, categories, tenantVerticals } from "@/db/schema/core";
import { eq, and } from "drizzle-orm";
import type { CatalogCategoryTree } from "@/db/schema/core";
import type { CatalogCategory } from "@/config/catalog/categories.config";

export class VerticalService {
	/**
	 * Carga el árbol de categorías desde la configuración vertical del tenant en la DB
	 */
	static async loadCategoryTree(tenantId: string, verticalKey?: string): Promise<CatalogCategory[]> {
		const whereConditions = [eq(tenantVerticals.tenantId, tenantId), eq(tenantVerticals.isActive, true)];
		
		if (verticalKey) {
			whereConditions.push(eq(tenantVerticals.verticalKey, verticalKey));
		}

		const vertical = await db
			.select()
			.from(tenantVerticals)
			.where(and(...whereConditions))
			.limit(1);

		if (!vertical.length) {
			return [];
		}

		return vertical[0].categoryTree as unknown as CatalogCategory[];
	}

	/**
	 * Guarda o actualiza una configuración vertical para un tenant
	 */
	static async upsertVertical(
		tenantId: string,
		verticalKey: string,
		name: string,
		categoryTree: CatalogCategory[]
	) {
		const [result] = await db
			.insert(tenantVerticals)
			.values({
				tenantId,
				verticalKey,
				name,
				categoryTree: categoryTree as unknown as CatalogCategoryTree[],
			})
			.onConflictDoUpdate({
				target: [tenantVerticals.tenantId, tenantVerticals.verticalKey],
				set: {
					name,
					categoryTree: categoryTree as unknown as CatalogCategoryTree[],
				},
			})
			.returning();

		return result;
	}

	/**
	 * Obtiene todas las verticales de un tenant
	 */
	static async getVerticals(tenantId: string) {
		return await db
			.select()
			.from(tenantVerticals)
			.where(and(eq(tenantVerticals.tenantId, tenantId), eq(tenantVerticals.isActive, true)))
			.orderBy(tenantVerticals.createdAt);
	}

	/**
	 * Sincroniza las categorías de la DB con la configuración vertical
	 * (idempotent - usa onConflictDoUpdate)
	 */
	static async syncCategoriesFromVertical(
		tenantId: string,
		verticalKey: string,
		categoryTree: CatalogCategory[],
		parentId?: string | null
	): Promise<void> {
		for (const cat of categoryTree) {
			const attributes = (cat.attributes ?? []).map((attr) => ({
				...attr,
				allowedValues: attr.allowedValues ?? [],
			}));

			const [row] = await db
				.insert(categories)
				.values({
					tenantId,
					name: cat.name,
					slug: cat.slug,
					parentId: parentId ?? null,
					attributes,
				})
				.onConflictDoUpdate({
					target: [categories.tenantId, categories.slug],
					set: {
						name: cat.name,
						parentId: parentId ?? null,
						attributes,
					},
				})
				.returning();

			const id = row?.id;

			if (id && cat.children?.length) {
				await VerticalService.syncCategoriesFromVertical(tenantId, verticalKey, cat.children, id);
			}
		}
	}
}