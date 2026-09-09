"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tenantSocialSchema } from "../schema/social.schema";
import type { TenantSocialInput } from "../schema/social.schema";
import { updateSocialAction } from "../actions/settings.actions";
import { Button } from "@/shared/components/ui/Button";
import { Label } from "@/shared/components/ui/Label";
import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/Select";
import { UploadImageUrlField } from "./UploadImageUrlField";
import { siteConfig } from "@/config/site";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";

interface Props {
	initialData?: {
		ogTitle?: string | null;
		ogDescription?: string | null;
		ogImage?: string | null;
		twitterCard?: string | null;
	} | null;
}

const TWITTER_OPTIONS = [
	{ value: "summary_large_image", label: "Summary large image (recomendado)" },
	{ value: "summary", label: "Summary (small)" },
];

export function SocialSettingsForm({ initialData }: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(tenantSocialSchema),
		defaultValues: {
			ogTitle: initialData?.ogTitle || "",
			ogDescription: initialData?.ogDescription || "",
			ogImage: initialData?.ogImage || "",
			twitterCard: (initialData?.twitterCard as TenantSocialInput["twitterCard"]) || "summary_large_image",
		},
	});

	const onSubmit = (data: TenantSocialInput) => {
		startTransition(async () => {
			const result = await updateSocialAction(data);
			if (result.success) {
				toast.success("Redes sociales actualizado exitosamente");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	return (
		<Card className="border border-border">
			<CardHeader>
				<CardTitle>Compartir en redes (Open Graph)</CardTitle>
				<CardDescription>
					Controla la vista previa de tu tienda al compartirla en WhatsApp, Facebook o Twitter.
					Esto NO afecta el posicionamiento en Google; es solo la tarjeta social. Si dejas los
					campos vacíos se usan los valores por defecto de la plataforma.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="social-ogtitle">Título para compartir (og:title)</Label>
						<Input
							id="social-ogtitle"
							{...register("ogTitle")}
							placeholder="Mi Tienda — Ofertas exclusivas"
							maxLength={70}
						/>
						{errors.ogTitle && <p className="text-sm text-destructive">{errors.ogTitle.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="social-ogdesc">Descripción para compartir (og:description)</Label>
						<Textarea
							id="social-ogdesc"
							{...register("ogDescription")}
							rows={3}
							maxLength={160}
							placeholder="Descubre nuestra tienda y productos."
						/>
						{errors.ogDescription && <p className="text-sm text-destructive">{errors.ogDescription.message}</p>}
					</div>

					<div className="space-y-2">
						<Controller
							control={control}
							name="ogImage"
							render={({ field }) => (
								<UploadImageUrlField
									label="Imagen para compartir (Open Graph)"
									value={field.value || ""}
									onChange={field.onChange}
									placeholder="https://..."
									hint="Imagen que aparece al compartir tu tienda en redes (1200x630 recomendado)."
									fallbackPreview={siteConfig.defaultOgImage}
								/>
							)}
						/>
						{errors.ogImage && <p className="text-sm text-destructive">{errors.ogImage.message}</p>}
					</div>

					<div className="space-y-2">
						<Label>Twitter Card</Label>
						<Controller
							control={control}
							name="twitterCard"
							render={({ field }) => (
								<Select
									value={field.value || "summary_large_image"}
									onChange={field.onChange}
									options={TWITTER_OPTIONS}
									ariaLabel="Twitter card"
								/>
							)}
						/>
						<p className="text-xs text-muted-foreground">
							Formato de la tarjeta al compartir en Twitter/X.
						</p>
					</div>

					<Button type="submit" disabled={isPending} className="w-full cursor-pointer">
						{isPending ? "Guardando..." : "Guardar redes sociales"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
