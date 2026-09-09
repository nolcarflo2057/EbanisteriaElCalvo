"use server";

import { requireAuth } from "@/lib/auth/auth-server";
import { RolesService } from "@/features/roles/services/roles.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { BlockService } from "@/features/blocks/services/block.service";
import { getAllBlockSchemas, resolveBlockSchema } from "@/features/blocks/registry";
import { revalidatePath } from "next/cache";
import type { BlockInstance } from "@/features/blocks/types/schema";

async function assertAdmin(): Promise<string | null> {
	const { session, isAuth } = await requireAuth();
	if (!isAuth || !session) return null;
	const isAdmin = await RolesService.hasRole(session.user.id, "admin");
	if (!isAdmin) return null;
	const tenantId = await getTenantIdFromHeaders();
	if (!tenantId) return null;
	return tenantId;
}

export async function getPageBlocksAction(pageKey = "home") {
	try {
		const tenantId = await assertAdmin();
		if (!tenantId) return { error: "No autorizado" };

		const [blocks, storeSchemas] = await Promise.all([
			BlockService.getPageBlocks(tenantId, pageKey),
			BlockService.getStoreBlockSchemas(tenantId),
		]);

		return { success: true, blocks, schemas: getAllBlockSchemas(storeSchemas) };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al obtener bloques" };
	}
}

export async function createBlockAction(data: {
	blockType: string;
	label?: string | null;
	props: Record<string, unknown>;
	visible?: boolean;
	pageKey?: string;
}) {
	try {
		const tenantId = await assertAdmin();
		if (!tenantId) return { error: "No autorizado" };

		const storeSchemas = await BlockService.getStoreBlockSchemas(tenantId);
		const schema = resolveBlockSchema(data.blockType, storeSchemas);
		if (!schema) return { error: `Bloque desconocido: ${data.blockType}` };

		const block = await BlockService.createBlock({
			tenantId,
			pageKey: data.pageKey ?? "home",
			blockType: data.blockType,
			label: data.label,
			props: data.props,
			visible: data.visible,
		});

		revalidatePath("/", "layout");
		return { success: true, block };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al crear bloque" };
	}
}

export async function updateBlockAction(
	id: string,
	data: { props: Record<string, unknown>; visible?: boolean; label?: string | null }
) {
	try {
		const tenantId = await assertAdmin();
		if (!tenantId) return { error: "No autorizado" };

		await BlockService.updateBlock(id, data);
		revalidatePath("/", "layout");
		return { success: true };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al actualizar bloque" };
	}
}

export async function reorderBlocksAction(pageKey: string, orderedIds: string[]) {
	try {
		const tenantId = await assertAdmin();
		if (!tenantId) return { error: "No autorizado" };

		await BlockService.reorderBlocks(tenantId, pageKey, orderedIds);
		revalidatePath("/", "layout");
		return { success: true };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al reordenar bloques" };
	}
}

export async function deleteBlockAction(id: string) {
	try {
		const tenantId = await assertAdmin();
		if (!tenantId) return { error: "No autorizado" };

		await BlockService.deleteBlock(id);
		revalidatePath("/", "layout");
		return { success: true };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al eliminar bloque" };
	}
}

export async function toggleBlockVisibilityAction(id: string, visible: boolean) {
	try {
		const tenantId = await assertAdmin();
		if (!tenantId) return { error: "No autorizado" };

		await BlockService.updateBlock(id, { visible });
		revalidatePath("/", "layout");
		return { success: true };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al cambiar visibilidad" };
	}
}
