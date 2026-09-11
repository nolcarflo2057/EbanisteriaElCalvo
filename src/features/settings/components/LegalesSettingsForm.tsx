"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tenantLegalesSchema, type TenantLegalesInput } from "../schema/legales.schema";
import { updateLegalesAction } from "../actions/settings.actions";
import { Button } from "@/shared/components/ui/Button";
import { Label } from "@/shared/components/ui/Label";
import { MarkdownRenderer } from "@/shared/components/ui/MarkdownRenderer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { COLOMBIAN_PRIVACY_TEMPLATE, COLOMBIAN_TERMS_TEMPLATE, COLOMBIAN_LEGAL_NOTICE_TEMPLATE } from "../constants/legal-templates";

interface Props {
	initialData?: {
		privacyMarkdown?: string | null;
		termsMarkdown?: string | null;
		legalNoticeMarkdown?: string | null;
	} | null;
}

const DOC_CONFIGS = [
	{
		field: "privacyMarkdown" as const,
		editorLabel: "Política de Privacidad (Markdown)",
		previewLabel: "Previsualización de Privacidad",
		placeholder: "# Política de Privacidad\n\nEn **[Nombre]** valoramos tu privacidad...",
	},
	{
		field: "termsMarkdown" as const,
		editorLabel: "Términos y Condiciones (Markdown)",
		previewLabel: "Previsualización de Términos",
		placeholder: "# Términos y Condiciones\n\nAl usar este sitio aceptas los siguientes términos...",
	},
	{
		field: "legalNoticeMarkdown" as const,
		editorLabel: "Aviso Legal (Markdown)",
		previewLabel: "Previsualización de Aviso Legal",
		placeholder: "# Aviso Legal\n\nIdentificación del titular del sitio y condiciones de uso...",
	},
];

export function LegalesSettingsForm({ initialData }: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [current, setCurrent] = useState(0);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm<TenantLegalesInput>({
		resolver: zodResolver(tenantLegalesSchema),
		defaultValues: {
			privacyMarkdown: initialData?.privacyMarkdown || "",
			termsMarkdown: initialData?.termsMarkdown || "",
			legalNoticeMarkdown: initialData?.legalNoticeMarkdown || "",
		},
	});

	const currentDoc = DOC_CONFIGS[current];
	const activeMarkdown = useWatch({ control, name: currentDoc.field });

	const onSubmit = (data: TenantLegalesInput) => {
		startTransition(async () => {
			const result = await updateLegalesAction(data);
			if (result.success) {
				toast.success("Páginas legales actualizadas exitosamente");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	const loadColombianTemplates = () => {
		if (window.confirm("¿Estás seguro de sobrescribir los textos actuales con las plantillas para Colombia (SIC)?")) {
			setValue("privacyMarkdown", COLOMBIAN_PRIVACY_TEMPLATE, { shouldValidate: true, shouldDirty: true });
			setValue("termsMarkdown", COLOMBIAN_TERMS_TEMPLATE, { shouldValidate: true, shouldDirty: true });
			setValue("legalNoticeMarkdown", COLOMBIAN_LEGAL_NOTICE_TEMPLATE, { shouldValidate: true, shouldDirty: true });
			toast.success("Plantillas cargadas. Revisa los datos en corchetes y haz clic en Guardar.");
		}
	};

	return (
		<div className="space-y-8">
			{/* Page header (full width) */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Páginas Legales</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Edita el contenido de las páginas legales en formato Markdown.
					</p>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={loadColombianTemplates}
					className="shrink-0 cursor-pointer text-xs"
				>
					<span className="material-symbols-outlined text-sm mr-1">gavel</span>
					Cargar Plantillas (SIC Colombia)
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Editor Column */}
				<Card className="border border-border h-fit">
					<CardContent className="pt-6">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Todos los campos se registran para no perder datos al cambiar de página;
							    solo el documento actual es visible. */}
							{DOC_CONFIGS.map((doc, i) => (
								<div key={doc.field} className={i === current ? "space-y-2" : "hidden"}>
									<Label htmlFor={doc.field}>{doc.editorLabel}</Label>
									<textarea
										id={doc.field}
										{...register(doc.field)}
										rows={12}
										placeholder={doc.placeholder}
										className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									/>
									{errors[doc.field] && (
										<p className="text-sm text-destructive">{errors[doc.field]?.message}</p>
									)}
								</div>
							))}

							<div className="flex items-center justify-between gap-3">
								<p className="text-sm text-muted-foreground">
									Página <span className="font-semibold text-foreground">{current + 1}</span> de{" "}
									<span className="font-semibold text-foreground">{DOC_CONFIGS.length}</span>:{" "}
									{currentDoc.editorLabel}
								</p>
								<Button type="submit" disabled={isPending} className="cursor-pointer">
									{isPending ? "Guardando..." : "Guardar Legales"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				{/* Preview Column */}
				<Card className="border border-border h-fit">
					<CardContent className="pt-6">
						<h2 className="mb-4 border-b border-border pb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
							{currentDoc.previewLabel}
						</h2>
						<div className="max-h-[600px] overflow-y-auto">
							{activeMarkdown ? (
								<MarkdownRenderer content={activeMarkdown} />
							) : (
								<p className="text-sm text-muted-foreground italic text-center py-8">
									Escribe Markdown para ver la vista previa aquí
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Paginator */}
			<div className="flex items-center justify-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setCurrent((c) => Math.max(0, c - 1))}
					disabled={current === 0}
					className="cursor-pointer"
				>
					<span className="material-symbols-outlined text-sm mr-1">chevron_left</span>
					Anterior
				</Button>

				{DOC_CONFIGS.map((doc, i) => (
					<button
						key={doc.field}
						type="button"
						onClick={() => setCurrent(i)}
						aria-label={doc.editorLabel}
						aria-current={i === current}
						className={`h-8 w-8 rounded-full text-sm font-medium transition-colors cursor-pointer ${
							i === current
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:bg-muted/80"
						}`}
					>
						{i + 1}
					</button>
				))}

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setCurrent((c) => Math.min(DOC_CONFIGS.length - 1, c + 1))}
					disabled={current === DOC_CONFIGS.length - 1}
					className="cursor-pointer"
				>
					Siguiente
					<span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
				</Button>
			</div>
		</div>
	);
}


