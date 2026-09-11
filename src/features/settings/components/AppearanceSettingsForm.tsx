"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TenantAppearanceInput, tenantAppearanceSchema } from "../schema/settings.schema";
import { updateAppearanceAction } from "../actions/settings.actions";
import { Button } from "@/shared/components/ui/Button";
import { Label } from "@/shared/components/ui/Label";
import { Select, type SelectOption } from "@/shared/components/ui/Select";
import { ColorPicker } from "@/shared/components/ui/ColorPicker";
import { UploadImageUrlField } from "./UploadImageUrlField";
import { ThemePreview } from "./ThemePreview";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";

const RADIUS_OPTIONS: SelectOption[] = [
	{ value: "0px", label: "0px — Esquinas rectas" },
	{ value: "0.25rem", label: "0.25rem — Sutil" },
	{ value: "0.375rem", label: "0.375rem — Suave" },
	{ value: "0.5rem", label: "0.5rem — Redondeado" },
	{ value: "0.75rem", label: "0.75rem — Muy redondeado" },
	{ value: "1rem", label: "1rem — Pastilla" },
];

const SHADOW_OPTIONS: SelectOption[] = [
	{ value: "shadow-xs", label: "Sombra mínima (xs)" },
	{ value: "shadow-sm", label: "Sombra pequeña (sm)" },
	{ value: "shadow", label: "Sombra media (base)" },
	{ value: "shadow-md", label: "Sombra media-alta (md)" },
	{ value: "shadow-lg", label: "Sombra alta (lg)" },
	{ value: "shadow-xl", label: "Sombra muy alta (xl)" },
];

const FONT_OPTIONS: SelectOption[] = [
	{ value: "var(--font-outfit)", label: "Outfit (por defecto)" },
	{ value: "var(--font-inter)", label: "Inter" },
	{ value: "var(--font-montserrat)", label: "Montserrat Alternates" },
];

const FONT_SERIF_OPTIONS: SelectOption[] = [
	{ value: "", label: "Sin fuente serif (por defecto)" },
	{ value: "Georgia", label: "Georgia" },
	{ value: "Times New Roman", label: "Times New Roman" },
	{ value: "Garamond", label: "Garamond" },
];

const FONT_MONO_OPTIONS: SelectOption[] = [
	{ value: "", label: "Sin fuente mono (por defecto)" },
	{ value: "monospace", label: "Monospace genérico" },
	{ value: "Consolas", label: "Consolas" },
	{ value: "Courier New", label: "Courier New" },
];

const BUTTON_STYLE_OPTIONS: SelectOption[] = [
	{ value: "rounded", label: "Redondeado (rounded)" },
	{ value: "pill", label: "Pastilla (pill)" },
	{ value: "sharp", label: "Cuadrado (sharp)" },
];

const NAVBAR_STYLE_OPTIONS: SelectOption[] = [
	{ value: "glass", label: "Cristal (glass)" },
	{ value: "solid", label: "Sólido (solid)" },
	{ value: "transparent", label: "Transparente" },
];

const WIDGET_SHAPE_OPTIONS: SelectOption[] = [
	{ value: "circle", label: "Circular" },
	{ value: "rounded", label: "Redondeado" },
	{ value: "square", label: "Cuadrado" },
];

interface Props {
	initialData?: any;
}

export function AppearanceSettingsForm({ initialData }: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(tenantAppearanceSchema),
		defaultValues: {
			logoUrl: initialData?.logoUrl || "",
			logoDarkUrl: initialData?.logoDarkUrl || "",
			faviconUrl: initialData?.faviconUrl || "",
			primaryColor: initialData?.primaryColor || "#F97316",
			secondaryColor: initialData?.secondaryColor || "#F4F4F5",
			accentColor: initialData?.accentColor || "#EA580C",
			borderRadius: initialData?.borderRadius || "0.375rem",
			shadowStyle: initialData?.shadowStyle || "shadow-xs",
			fontSettings: initialData?.fontSettings || {},
			themeConfig: {
				buttonStyle: initialData?.themeConfig?.buttonStyle || "rounded",
				navbarStyle: initialData?.themeConfig?.navbarStyle || "glass",
				widgetShape: initialData?.themeConfig?.widgetShape || "circle",
			},
		},
	});

	const onSubmit = (data: any) => {
		startTransition(async () => {
			const result = await updateAppearanceAction(data);
			if (result.success) {
				toast.success("Identidad visual actualizada exitosamente");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	const watched = useWatch({ control });

	return (
		<Card className="border border-border">
			<CardHeader>
				<CardTitle>Personalización Visual</CardTitle>
				<CardDescription>
					Define los logotipos, favicon y la paleta de colores corporativos para el portal público.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Preview en vivo */}
					<div className="space-y-2">
						<span className="text-sm font-semibold">Vista previa</span>
						<ThemePreview
							primaryColor={watched.primaryColor}
							secondaryColor={watched.secondaryColor}
							accentColor={watched.accentColor}
							borderRadius={watched.borderRadius}
							shadowStyle={watched.shadowStyle}
							logoUrl={watched.logoUrl ?? undefined}
							fontSettings={watched.fontSettings ?? undefined}
							buttonStyle={watched.themeConfig?.buttonStyle}
							navbarStyle={watched.themeConfig?.navbarStyle}
							widgetShape={watched.themeConfig?.widgetShape}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Color Primario */}
						<Controller
							control={control}
							name="primaryColor"
							render={({ field }) => (
								<ColorPicker
									label="Color Primario"
									value={field.value || "#F97316"}
									onChange={field.onChange}
								/>
							)}
						/>
						{errors.primaryColor && <p className="text-sm text-destructive">{errors.primaryColor.message?.toString()}</p>}

						{/* Color Secundario */}
						<Controller
							control={control}
							name="secondaryColor"
							render={({ field }) => (
								<ColorPicker
									label="Color Secundario"
									value={field.value || "#F4F4F5"}
									onChange={field.onChange}
								/>
							)}
						/>
						{errors.secondaryColor && <p className="text-sm text-destructive">{errors.secondaryColor.message?.toString()}</p>}

						{/* Color de Acento */}
						<Controller
							control={control}
							name="accentColor"
							render={({ field }) => (
								<ColorPicker
									label="Color de Acento"
									value={field.value || "#EA580C"}
									onChange={field.onChange}
								/>
							)}
						/>
						{errors.accentColor && <p className="text-sm text-destructive">{errors.accentColor.message?.toString()}</p>}

						{/* Radio de Bordes */}
						<div className="space-y-2">
							<Label htmlFor="borderRadius">Radio de Bordes</Label>
							<Controller
								control={control}
								name="borderRadius"
								render={({ field }) => (
									<Select
										id="borderRadius"
										value={field.value}
										onChange={field.onChange}
										options={RADIUS_OPTIONS}
										ariaLabel="Radio de bordes"
									/>
								)}
							/>
							{errors.borderRadius && <p className="text-sm text-destructive">{errors.borderRadius.message?.toString()}</p>}
						</div>

						{/* Estilo de Sombra */}
						<div className="space-y-2">
							<Label htmlFor="shadowStyle">Sombra por Defecto</Label>
							<Controller
								control={control}
								name="shadowStyle"
								render={({ field }) => (
									<Select
										id="shadowStyle"
										value={field.value}
										onChange={field.onChange}
										options={SHADOW_OPTIONS}
										ariaLabel="Estilo de sombra"
									/>
								)}
							/>
							{errors.shadowStyle && <p className="text-sm text-destructive">{errors.shadowStyle.message?.toString()}</p>}
						</div>

						{/* Estilo de Componentes */}
						<div className="space-y-2 md:col-span-2">
							<Label className="text-base font-semibold">Estilo de Componentes</Label>
							<p className="text-xs text-muted-foreground">Controla la forma de botones, barra de navegación y widgets flotantes en la landing pública.</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
								<div className="space-y-2">
									<Label htmlFor="buttonStyle">Botón CTA</Label>
									<Controller
										control={control}
										name="themeConfig.buttonStyle"
										render={({ field }) => (
											<Select
												id="buttonStyle"
												value={field.value || "rounded"}
												onChange={field.onChange}
												options={BUTTON_STYLE_OPTIONS}
												ariaLabel="Estilo del botón CTA"
											/>
										)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="navbarStyle">Barra de Navegación</Label>
									<Controller
										control={control}
										name="themeConfig.navbarStyle"
										render={({ field }) => (
											<Select
												id="navbarStyle"
												value={field.value || "glass"}
												onChange={field.onChange}
												options={NAVBAR_STYLE_OPTIONS}
												ariaLabel="Estilo de la barra de navegación"
											/>
										)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="widgetShape">Widgets Flotantes</Label>
									<Controller
										control={control}
										name="themeConfig.widgetShape"
										render={({ field }) => (
											<Select
												id="widgetShape"
												value={field.value || "circle"}
												onChange={field.onChange}
												options={WIDGET_SHAPE_OPTIONS}
												ariaLabel="Forma de widgets flotantes"
											/>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Logo URL */}
						<div className="md:col-span-2">
							<Controller
								control={control}
								name="logoUrl"
								render={({ field }) => (
									<UploadImageUrlField
										label="Logotipo (Claro / Light Mode)"
										value={field.value || ""}
										onChange={field.onChange}
										placeholder="https://..."
										hint="Sube tu logotipo o pega una URL."
										proportionsHint="Ideal: 2:1 a 4:1 (horizontal), altura ≤ 160px, fondo transparente. Se mostrará a 32px de alto en la barra de navegación."
									/>
								)}
							/>
							{errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl.message?.toString()}</p>}
						</div>

						{/* Logo Dark URL */}
						<div className="md:col-span-2">
							<Controller
								control={control}
								name="logoDarkUrl"
								render={({ field }) => (
									<UploadImageUrlField
										label="Logotipo (Oscuro / Dark Mode)"
										value={field.value || ""}
										onChange={field.onChange}
										placeholder="https://..."
										hint="Opcional. Se usa cuando el tema oscuro está activo."
										proportionsHint="Mismas proporciones que el logotipo claro (2:1 a 4:1), pensado para verse bien sobre fondo oscuro."
									/>
								)}
							/>
							{errors.logoDarkUrl && <p className="text-sm text-destructive">{errors.logoDarkUrl.message?.toString()}</p>}
						</div>

						{/* Favicon URL */}
						<div className="md:col-span-2">
							<Controller
								control={control}
								name="faviconUrl"
								render={({ field }) => (
									<UploadImageUrlField
										label="Favicon (.ico o .png)"
										value={field.value || ""}
										onChange={field.onChange}
										placeholder="https://..."
										hint="Icono de la pestaña del navegador."
										fallbackPreview="/favicon.ico"
									/>
								)}
							/>
							{errors.faviconUrl && <p className="text-sm text-destructive">{errors.faviconUrl.message?.toString()}</p>}
						</div>

						{/* Tipografía */}
						<div className="space-y-2 md:col-span-2 mt-2">
							<Label className="text-base font-semibold">Tipografía</Label>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="fontSans">Fuente Principal</Label>
									<Controller
										control={control}
										name="fontSettings.sans"
										render={({ field }) => (
											<Select
												id="fontSans"
												value={field.value || ""}
												onChange={field.onChange}
												options={FONT_OPTIONS}
												ariaLabel="Fuente principal"
											/>
										)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="fontSerif">Fuente de Títulos</Label>
									<Controller
										control={control}
										name="fontSettings.serif"
										render={({ field }) => (
											<Select
												id="fontSerif"
												value={field.value || ""}
												onChange={field.onChange}
												options={FONT_SERIF_OPTIONS}
												ariaLabel="Fuente de títulos"
											/>
										)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="fontMono">Fuente Mono</Label>
									<Controller
										control={control}
										name="fontSettings.mono"
										render={({ field }) => (
											<Select
												id="fontMono"
												value={field.value || ""}
												onChange={field.onChange}
												options={FONT_MONO_OPTIONS}
												ariaLabel="Fuente mono"
											/>
										)}
									/>
								</div>
							</div>
						</div>
					</div>

					<Button type="submit" disabled={isPending} className="w-full cursor-pointer">
						{isPending ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}


