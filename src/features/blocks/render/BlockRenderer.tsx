import { blockRegistry } from "@/features/blocks/registry";
import type { BlockInstance } from "@/features/blocks/types/schema";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

/**
 * Renderiza una instancia de bloque resolviendo su componente desde el registry de código.
 * Si el tipo no tiene componente registrado (p.ej. bloque custom definido solo en DB),
 * no renderiza nada (el renderer genérico de overrides se añadirá en futuras iteraciones).
 * Para bloques contenedores, renderiza recursivamente sus hijos.
 */
export async function BlockRenderer({ instance, tenantId }: { instance: BlockInstance; tenantId?: string }) {
 	const definition = blockRegistry[instance.blockType];
 	if (!definition) return null;

 	const Component = definition.Component;
 	const defaultProps = definition.defaultProps ?? {};
 	
 	// Fusionar props guardadas con las por defecto para evitar campos vacíos
 	let mergedProps = {
 		...defaultProps,
 		...(instance.props || {}),
 	};

 	// Para contenedores, renderizar hijos recursivamente
 	if (instance.blockType === "container" && instance.children?.length) {
 		return <Component props={mergedProps} tenantId={tenantId}>{instance.children.map((child) => (
 			<BlockRenderer key={child.id} instance={child} tenantId={tenantId} />
 		))}</Component>;
 	}

 	const componentNode = <Component props={mergedProps} tenantId={tenantId} />;

	if (instance.blockType === "navigation" || instance.blockType === "footer") {
		return componentNode;
	}

	return <ScrollReveal>{componentNode}</ScrollReveal>;
}

