"use server";

import type { MenuItem } from "@/features/navigation/types/navigation.types";

/**
 * Server Action que obtiene el árbol de navegación.
 * En este proyecto (landing marca blanca) retorna datos mock.
 * En el proyecto completo (carvin-ecommerce) usaría CategoryService.
 */
export async function getNavigationMenuAction(): Promise<MenuItem[]> {
  try {
    // Mock data for landing page - replace with real data when categories feature exists
		return [
			{
				id: "1",
				name: "Restauración",
				slug: "restauracion",
				parentId: null,
				attributes: [],
				inheritedAttributes: [],
				children: [],
			},
			{
				id: "2",
				name: "Pintura y Lacado",
				slug: "pintura",
				parentId: null,
				attributes: [],
				inheritedAttributes: [],
				children: [],
			},
			{
				id: "3",
				name: "Tapicería",
				slug: "tapiceria",
				parentId: null,
				attributes: [],
				inheritedAttributes: [],
				children: [],
			},
			{
				id: "4",
				name: "Puertas",
				slug: "puertas",
				parentId: null,
				attributes: [],
				inheritedAttributes: [],
				children: [],
			},
		];
  } catch (error) {
    console.error("[Navigation] Error fetching menu tree:", error);
    return [];
  }
}