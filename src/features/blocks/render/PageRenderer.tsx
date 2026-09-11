import { BlockService } from "@/features/blocks/services/block.service";
import { BlockRenderer } from "./BlockRenderer";
import { blockRegistry } from "@/features/blocks/registry";

interface Props {
	tenantId: string;
	pageKey?: string;
	/**
	 * Render de fallback cuando la tienda no tiene bloques configurados.
	 * Por defecto muestra un placeholder con los bloques disponibles.
	 */
	fallback?: React.ReactNode;
}

function EmptyBlocksPlaceholder() {
	const availableBlocks = Object.values(blockRegistry).map((def) => def.schema);

	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
			<div className="max-w-3xl w-full text-center">
				<div className="mb-8">
					<svg className="mx-auto h-16 w-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
					</svg>
					<h1 className="mt-6 text-3xl font-bold text-foreground">No hay bloques configurados</h1>
					<p className="mt-2 text-muted-foreground">
						Esta tienda aún no tiene una landing page personalizada.
					</p>
				</div>
				<div className="text-left">
					<h2 className="text-lg font-semibold text-foreground mb-4">Bloques disponibles en el sistema:</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{availableBlocks.map((schema) => (
							<div
								key={schema.type}
								className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
							>
								<div className="flex items-center gap-3">
									<span className="text-2xl">{schema.icon}</span>
									<div>
										<p className="font-medium text-foreground">{schema.label}</p>
										<p className="text-sm text-muted-foreground">{schema.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
					<p className="text-sm text-muted-foreground">
						Ve al panel de administración → <strong>Bloques</strong> para crear tu landing page.
					</p>
				</div>
			</div>
		</div>
	);
}

/**
 * Renderiza la página de bloques de un tenant en orden, respetando visibilidad.
 * Si no hay bloques configurados, muestra un placeholder con los bloques disponibles.
 */
export async function PageRenderer({ tenantId, pageKey = "home", fallback }: Props) {
	const blocks = await BlockService.getPageBlocks(tenantId, pageKey);
	const visibleBlocks = blocks.filter((b) => b.visible);

	if (visibleBlocks.length === 0) {
		return fallback ? <>{fallback}</> : <EmptyBlocksPlaceholder />;
	}

	return (
		<>
			{visibleBlocks.map((instance) => (
				<BlockRenderer key={instance.id} instance={instance} tenantId={tenantId} />
			))}
		</>
	);
}


