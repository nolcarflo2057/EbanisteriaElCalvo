"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, ChevronUp, ChevronDown, PencilIcon, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import {
	getPageBlocksAction,
	createBlockAction,
	updateBlockAction,
	deleteBlockAction,
	toggleBlockVisibilityAction,
	reorderBlocksAction,
} from "@/features/blocks/actions/block.actions";
import { DynamicForm } from "@/features/blocks/form/DynamicForm";
import { confirmClient } from "@/lib/confirm";
import { Button } from "@/shared/components/ui/Button";
import { Dialog } from "@/shared/components/ui/Dialog";
import { Input } from "@/shared/components/ui/Input";
import type { BlockInstance, BlockSchema } from "@/features/blocks/types/schema";

interface EditorState {
	id: string | null;
	blockType: string;
	label: string;
	props: Record<string, unknown>;
	visible: boolean;
}

export function BlockEditor({ pageKey = "home", isAdmin = false }: { pageKey?: string; isAdmin?: boolean }) {
	const [blocks, setBlocks] = useState<BlockInstance[]>([]);
	const [schemas, setSchemas] = useState<BlockSchema[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [open, setOpen] = useState(false);
	const [state, setState] = useState<EditorState>({ id: null, blockType: "", label: "", props: {}, visible: true });
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [overIndex, setOverIndex] = useState<number | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		const res = await getPageBlocksAction(pageKey);
		if (res.success) {
			setBlocks(res.blocks);
			setSchemas(res.schemas);
		} else {
			toast.error(res.error || "Error al cargar bloques");
		}
		setLoading(false);
	}, [pageKey]);

	useEffect(() => {
		Promise.resolve().then(() => load());
	}, [load]);

	const schemaFor = useCallback(
		(blockType: string) => schemas.find((s) => s.type === blockType),
		[schemas]
	);

	const openNew = (blockType: string) => {
		const schema = schemaFor(blockType);
		// Primero los defaultProps ricos de la definición del bloque (ej. servicesGrid.services,
		// gallery.images), luego sobreescribimos con los defaults explícitos de cada field.
		const defaults: Record<string, unknown> = { ...(schema?.defaultProps ?? {}) };
		if (schema) {
			for (const field of schema.fields) {
				if (field.default !== undefined) defaults[field.key] = field.default;
			}
		}
		// Nunca persistir claves con valor undefined: el spread {...defaultProps, ...props}
		// las usaría para aplastar el fallback por defecto.
		for (const key of Object.keys(defaults)) {
			if (defaults[key] === undefined) delete defaults[key];
		}
		setState({ id: null, blockType, label: "", props: defaults, visible: true });
		setOpen(true);
	};

	const openEdit = (block: BlockInstance) => {
		setState({
			id: block.id,
			blockType: block.blockType,
			label: block.label ?? "",
			props: { ...block.props },
			visible: block.visible,
		});
		setOpen(true);
	};

	const handleSave = async () => {
		setSaving(true);
		const res = state.id
			? await updateBlockAction(state.id, { props: state.props, label: state.label || null, visible: state.visible })
			: await createBlockAction({
					blockType: state.blockType,
					label: state.label || null,
					props: state.props,
					visible: state.visible,
					pageKey,
			  });
		if (res.success) {
			toast.success(state.id ? "Bloque actualizado" : "Bloque agregado");
			setOpen(false);
			await load();
		} else {
			toast.error(res.error || "Error al guardar");
		}
		setSaving(false);
	};

	const handleDelete = async (id: string) => {
		if (!confirmClient("¿Seguro que quieres eliminar este bloque?")) return;
		const res = await deleteBlockAction(id);
		if (res.success) {
			toast.success("Bloque eliminado");
			await load();
		} else {
			toast.error(res.error || "Error al eliminar");
		}
	};

	const handleToggle = async (block: BlockInstance) => {
		const res = await toggleBlockVisibilityAction(block.id, !block.visible);
		if (res.success) await load();
		else toast.error(res.error || "Error");
	};

	const handleMove = async (index: number, dir: -1 | 1) => {
		const next = [...blocks];
		const target = index + dir;
		if (target < 0 || target >= next.length) return;
		[next[index], next[target]] = [next[target], next[index]];
		setBlocks(next);
		const res = await reorderBlocksAction(pageKey, next.map((b) => b.id));
		if (res.success) await load();
		else toast.error(res.error || "Error al reordenar");
	};

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
		setDragIndex(index);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", String(index));
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
		e.preventDefault();
		if (dragIndex === null || dragIndex === index) return;
		setOverIndex(index);
	};

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
		e.preventDefault();
		const from = dragIndex;
		setDragIndex(null);
		setOverIndex(null);
		if (from === null || from === targetIndex) return;
		const next = [...blocks];
		const [moved] = next.splice(from, 1);
		next.splice(targetIndex, 0, moved);
		setBlocks(next);
		const res = await reorderBlocksAction(pageKey, next.map((b) => b.id));
		if (res.success) await load();
		else toast.error(res.error || "Error al reordenar");
	};

	const handleDragEnd = () => {
		setDragIndex(null);
		setOverIndex(null);
	};

	if (loading) {
		return (
			<div className="flex justify-center py-10">
				<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const visibleBlocks = isAdmin ? blocks : blocks.filter((b) => b.visible);

	return (
		<div className="space-y-6">
			{/* Paleta de bloques — solo super admin */}
			{isAdmin && (
				<div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
						<h2 className="text-base font-semibold text-foreground">Paleta de Diseño (Agregar Bloque)</h2>
						<span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground w-fit">
							Solo Super Admin
						</span>
					</div>
					<p className="text-xs text-muted-foreground mb-4">
						El cliente final NO verá esta sección. Usa esta paleta para inyectar nuevos componentes en la landing.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{schemas.map((schema) => (
							<button
								key={schema.type}
								type="button"
								onClick={() => openNew(schema.type)}
								className="border border-border rounded-xl p-4 text-left hover:border-primary hover:shadow-sm transition-all cursor-pointer bg-card"
							>
								<div className="text-2xl mb-2">{schema.icon ?? "🧱"}</div>
								<div className="text-sm font-semibold text-foreground">{schema.label}</div>
								<div className="text-xs text-muted-foreground mt-1">{schema.description}</div>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Lista de bloques */}
			<div>
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
					<h2 className="text-base font-semibold text-foreground">
						{isAdmin ? "Bloques de la página (Editor de Contenido)" : "Bloques habilitados"}
					</h2>
					{isAdmin && (
						<span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 w-fit">
							Accesible por el Cliente
						</span>
					)}
				</div>
				<p className="text-xs text-muted-foreground mb-4">
					{isAdmin 
						? "Esta es la vista que tendrá el cliente final. Solo podrán editar la información (lápiz) de los bloques que tú dejes activados."
						: "Haz clic en el lápiz para editar la información que aparecerá en tu página."}
				</p>
				{visibleBlocks.length === 0 ? (
					<div className="border border-dashed border-border rounded-xl py-10 text-center text-xs text-muted-foreground">
						{isAdmin
							? "No hay bloques configurados. Se usa la landing por defecto."
							: "No hay bloques habilitados para editar."}
					</div>
				) : (
					<div className="space-y-2">
						{visibleBlocks.map((block, index) => {
							const schema = schemaFor(block.blockType);
							return (
								<div
									key={block.id}
									draggable={isAdmin}
									onDragStart={isAdmin ? (e) => handleDragStart(e, index) : undefined}
									onDragOver={isAdmin ? (e) => handleDragOver(e, index) : undefined}
									onDrop={isAdmin ? (e) => handleDrop(e, index) : undefined}
									onDragEnd={isAdmin ? handleDragEnd : undefined}
									className={`flex items-center gap-3 border rounded-xl p-3 bg-card transition-all ${
										isAdmin && overIndex === index
											? "border-primary ring-2 ring-primary/30"
											: "border-border"
									} ${isAdmin && dragIndex === index ? "opacity-60 border-primary" : ""} ${!block.visible ? "opacity-60" : ""}`}
								>
									{isAdmin && (
										<span className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground" title="Arrastrar para reordenar">
											<GripVertical className="h-4 w-4" />
										</span>
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="text-lg">{schema?.icon ?? "🧱"}</span>
											<span className="text-sm font-semibold text-foreground truncate">
												{block.label || schema?.label || block.blockType}
											</span>
										</div>
										<div className="text-[11px] text-muted-foreground mt-0.5">#{block.order} · {block.blockType}</div>
									</div>
									<div className="flex items-center gap-1">
										{isAdmin && (
											<>
												<button
													type="button"
													onClick={() => handleMove(index, -1)}
													disabled={index === 0}
													className="p-1.5 hover:bg-accent rounded-md text-muted-foreground disabled:opacity-30 cursor-pointer"
													title="Subir"
												>
													<ChevronUp className="h-4 w-4" />
												</button>
												<button
													type="button"
													onClick={() => handleMove(index, 1)}
													disabled={index === visibleBlocks.length - 1}
													className="p-1.5 hover:bg-accent rounded-md text-muted-foreground disabled:opacity-30 cursor-pointer"
													title="Bajar"
												>
													<ChevronDown className="h-4 w-4" />
												</button>
												<button
													type="button"
													onClick={() => handleToggle(block)}
													className="p-1.5 hover:bg-accent rounded-md text-muted-foreground cursor-pointer"
													title={block.visible ? "Ocultar" : "Mostrar"}
												>
													{block.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
												</button>
											</>
										)}
										<button
											type="button"
											onClick={() => openEdit(block)}
											className="p-1.5 hover:bg-accent rounded-md text-muted-foreground cursor-pointer"
											title="Editar"
										>
											<PencilIcon className="h-3.5 w-3.5" />
										</button>
										{isAdmin && (
											<button
												type="button"
												onClick={() => handleDelete(block.id)}
												className="p-1.5 hover:bg-destructive/10 text-destructive rounded-md cursor-pointer"
												title="Eliminar"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Dialog de edición */}
			<Dialog isOpen={open} onClose={() => setOpen(false)}>
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-bold text-foreground">
							{state.id ? "Editar bloque" : "Nuevo bloque"}
						</h3>
						<p className="text-sm text-muted-foreground">{schemaFor(state.blockType)?.label}</p>
					</div>

					{!schemaFor(state.blockType) ? (
						<div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20">
							Bloque no permitido
						</div>
					) : (
						<>
							{isAdmin && (
								<div>
									<label className="block text-xs font-medium text-muted-foreground mb-1">Etiqueta (opcional)</label>
									<Input
										value={state.label}
										onChange={(e) => setState((p) => ({ ...p, label: e.target.value }))}
										placeholder="Ej: Hero principal"
									/>
								</div>
							)}

							{isAdmin && (
								<div className="flex items-center gap-2 py-2">
									<input
										id="block-visibility-toggle"
										type="checkbox"
										checked={state.visible}
										onChange={(e) => setState((p) => ({ ...p, visible: e.target.checked }))}
										className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
									/>
									<label htmlFor="block-visibility-toggle" className="text-sm font-medium text-foreground cursor-pointer select-none">
										Activar bloque (Visible en la web)
									</label>
								</div>
							)}

							{schemaFor(state.blockType)!.fields && schemaFor(state.blockType)!.fields.length > 0 ? (
								<DynamicForm
									fields={schemaFor(state.blockType)!.fields}
									value={state.props}
									onChange={(props) => setState((p) => ({ ...p, props }))}
								/>
							) : (
								<p className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg border border-border">
									Este bloque no requiere campos de información adicionales, solo activar o desactivar.
								</p>
							)}
						</>
					)}

					<div className="flex items-center gap-2 pt-2">
						{schemaFor(state.blockType) && (
							<Button type="button" size="sm" onClick={handleSave} disabled={saving}>
								{saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
								{state.id ? "Actualizar" : "Agregar"}
							</Button>
						)}
						<Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
							Cancelar
						</Button>
					</div>
				</div>
			</Dialog>
		</div>
	);
}


