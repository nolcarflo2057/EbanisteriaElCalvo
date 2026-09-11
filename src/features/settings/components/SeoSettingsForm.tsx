"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tenantSeoSchema } from "../schema/seo.schema";
import type { TenantSeoInput } from "../schema/seo.schema";
import { updateSeoAction } from "../actions/settings.actions";
import { Button } from "@/shared/components/ui/Button";
import { Label } from "@/shared/components/ui/Label";
import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/Select";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";

interface Props {
	initialData?: {
		title?: string | null;
		description?: string | null;
		keywords?: string | null;
		canonicalUrl?: string | null;
		robots?: string | null;
		jsonLd?: string | null;
	} | null;
}

const MAX_TITLE = 70;
const MAX_DESC = 160;

const ROBOTS_OPTIONS = [
	{ value: "index,follow", label: "Indexar y seguir enlaces (recomendado)" },
	{ value: "noindex,follow", label: "No indexar, pero seguir enlaces" },
	{ value: "index,nofollow", label: "Indexar, pero no seguir enlaces" },
	{ value: "noindex,nofollow", label: "No indexar ni seguir enlaces" },
];

export function SeoSettingsForm({ initialData }: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(tenantSeoSchema),
		defaultValues: {
			title: initialData?.title || "",
			description: initialData?.description || "",
			keywords: initialData?.keywords || "",
			canonicalUrl: initialData?.canonicalUrl || "",
			robots: (initialData?.robots as TenantSeoInput["robots"]) || "index,follow",
			jsonLd: initialData?.jsonLd || "",
		},
	});

	const title = useWatch({ control, name: "title" });
	const description = useWatch({ control, name: "description" });

	const onSubmit = (data: TenantSeoInput) => {
		startTransition(async () => {
			const result = await updateSeoAction(data);
			if (result.success) {
				toast.success("SEO actualizado exitosamente");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	return (
		<Card className="border border-border">
			<CardHeader>
				<CardTitle>Posicionamiento en buscadores (SEO)</CardTitle>
				<CardDescription>
					Controla cómo te encuentra y rankea Google. Esto afecta el posicionamiento de la
					landing en los resultados de búsqueda. Si dejas los campos vacíos, se usan los valores
					por defecto de la plataforma.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="seo-title">Título SEO</Label>
						<Input
							id="seo-title"
							{...register("title")}
							placeholder="Mi Tienda — Productos de calidad"
							maxLength={MAX_TITLE}
						/>
						<p className="text-xs text-muted-foreground">
							Aparece como título en Google. Máximo {MAX_TITLE} caracteres.
							<span className="ml-1 font-medium text-foreground">
								{(title || "").length}/{MAX_TITLE}
							</span>
						</p>
						{errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="seo-description">Meta descripción</Label>
						<Textarea
							id="seo-description"
							{...register("description")}
							rows={3}
							maxLength={MAX_DESC}
							placeholder="Describe brevemente tu tienda y qué ofreces."
						/>
						<p className="text-xs text-muted-foreground">
							<span className="mr-1">{(description || "").length}/{MAX_DESC}</span>
							Los primeros 155 se muestran en Google.
						</p>
						{errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="seo-keywords">Palabras clave</Label>
						<Input
							id="seo-keywords"
							{...register("keywords")}
							placeholder="ropa, moda, tienda online"
						/>
						<p className="text-xs text-muted-foreground">
							Separadas por comas. Opcional y de menor prioridad para Google.
						</p>
						{errors.keywords && <p className="text-sm text-destructive">{errors.keywords.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="seo-canonical">URL canónica (canonical)</Label>
						<Input
							id="seo-canonical"
							type="url"
							{...register("canonicalUrl")}
							placeholder="https://mitienda.com/"
						/>
						<p className="text-xs text-muted-foreground">
							Indica a Google la versión preferida de la página para evitar contenido duplicado.
						</p>
						{errors.canonicalUrl && <p className="text-sm text-destructive">{errors.canonicalUrl.message}</p>}
					</div>

					<div className="space-y-2">
						<Label>Indexación (robots)</Label>
						<Controller
							control={control}
							name="robots"
							render={({ field }) => (
								<Select
									value={field.value || "index,follow"}
									onChange={field.onChange}
									options={ROBOTS_OPTIONS}
									ariaLabel="Indexación robots"
								/>
							)}
						/>
						<p className="text-xs text-muted-foreground">
							Controla si los buscadores indexan y siguen los enlaces de la landing.
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="seo-jsonld">Datos estructurados (JSON-LD)</Label>
						<Textarea
							id="seo-jsonld"
							{...register("jsonLd")}
							rows={6}
							placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Mi Tienda"\n}'}
							className="font-mono text-xs"
						/>
						<p className="text-xs text-muted-foreground">
							JSON-LD opcional que ayuda a Google a entender tu negocio (Product, LocalBusiness, etc.).
						</p>
						{errors.jsonLd && <p className="text-sm text-destructive">{errors.jsonLd.message}</p>}
					</div>

					<Button type="submit" disabled={isPending} className="w-full cursor-pointer">
						{isPending ? "Guardando..." : "Guardar SEO"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}


