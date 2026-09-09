import type { AttributeDefinition } from "@/db/schema/core";

export interface CatalogCategory {
	id?: string;
	name: string;
	slug: string;
	description?: string;
	imageUrl?: string;
	parentId?: string | null;
	attributes?: AttributeDefinition[];
	children?: CatalogCategory[];
}
