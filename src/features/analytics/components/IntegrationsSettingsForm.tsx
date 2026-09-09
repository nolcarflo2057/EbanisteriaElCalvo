"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntegrationsInput, integrationsSchema } from "../../settings/schema/integrations.schema";
import { tenantTrackingSchema } from "../../settings/schema/tracking.schema";
import type { TenantTrackingInput } from "../../settings/schema/tracking.schema";
import { updateIntegrationsAction } from "../actions/integrations.actions";
import { updateTrackingAction } from "../../settings/actions/settings.actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { Switch } from "@/shared/components/ui/Switch";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { isModuleEnabled } from "@/config/modules";

interface Props {
	initialData?: IntegrationsInput | null;
	trackingData?: {
		googleAdsId?: string | null;
		facebookPixelId?: string | null;
		gtmId?: string | null;
		ga4MeasurementId?: string | null;
	} | null;
}

export function IntegrationsSettingsForm({ initialData, trackingData }: Props) {
	const [isPending, startTransition] = useTransition();
	const [trackingPending, startTrackingTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(integrationsSchema),
		defaultValues: {
			ga4Enabled: initialData?.ga4Enabled ?? false,
			ga4MeasurementId: initialData?.ga4MeasurementId || "",
			metaPixelEnabled: initialData?.metaPixelEnabled ?? false,
			metaPixelId: initialData?.metaPixelId || "",
			gtmEnabled: initialData?.gtmEnabled ?? false,
			gtmContainerId: initialData?.gtmContainerId || "",
		},
	});

	const ga4Enabled = useWatch({ control, name: "ga4Enabled" });
	const metaPixelEnabled = useWatch({ control, name: "metaPixelEnabled" });
	const gtmEnabled = useWatch({ control, name: "gtmEnabled" });

	const onSubmit = (data: IntegrationsInput) => {
		startTransition(async () => {
			const result = await updateIntegrationsAction(data);
			if (result.success) {
				toast.success("Integraciones de analytics actualizadas");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	const hasTraffic = isModuleEnabled("analytics_traffic");
	const hasConversions = isModuleEnabled("analytics_conversions");
	const hasBehavior = isModuleEnabled("analytics_behavior");

	if (!hasTraffic && !hasConversions && !hasBehavior) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-card text-muted-foreground mt-8">
				<svg className="w-12 h-12 mb-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<p className="text-sm font-medium">El módulo de Analíticas está desactivado</p>
				<p className="text-xs mt-1 max-w-sm mx-auto">Activa métricas de tráfico, conversiones o comportamiento en la configuración de módulos para ver las integraciones.</p>
			</div>
		);
	}

	return (
		<>
			<div id="pixeles" className="scroll-mt-24">
			<Card className="border border-border">
				<CardHeader>
					<CardTitle>Integraciones de Analytics</CardTitle>
				<CardDescription>
					Configura Google Analytics 4, Meta Pixel y Google Tag Manager para medir el rendimiento de tu tienda.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{/* GA4 */}
					{hasTraffic && (
					<div className="space-y-6 pt-4 border-t border-border">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<h3 className="text-md font-bold text-foreground">Google Analytics 4</h3>
								<p className="text-xs text-muted-foreground">
									Mide tráfico, comportamiento de usuarios y conversiones con GA4.
								</p>
							</div>
							<Controller
								control={control}
								name="ga4Enabled"
								render={({ field }) => (
									<Switch checked={!!field.value} onChange={field.onChange} />
								)}
							/>
						</div>

						{ga4Enabled && (
							<div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-primary/50">
								<div className="space-y-2">
									<Label htmlFor="ga4MeasurementId">Measurement ID</Label>
									<Input
										id="ga4MeasurementId"
										{...register("ga4MeasurementId")}
										placeholder="G-XXXXXXXXXX"
									/>
									<p className="text-xs text-muted-foreground">
										Lo encuentras en Admin &gt; Flujo de datos &gt; Web.
									</p>
									{errors.ga4MeasurementId && (
										<p className="text-sm text-destructive">{errors.ga4MeasurementId.message}</p>
									)}
								</div>
							</div>
						)}
					</div>
					)}

					{/* Meta Pixel */}
					{hasConversions && (
					<div className="space-y-6 pt-4 border-t border-border">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<h3 className="text-md font-bold text-foreground">Meta Pixel (Facebook/Instagram)</h3>
								<p className="text-xs text-muted-foreground">
									Rastrea conversiones y crea audiencias personalizadas para campañas de Meta Ads.
								</p>
							</div>
							<Controller
								control={control}
								name="metaPixelEnabled"
								render={({ field }) => (
									<Switch checked={!!field.value} onChange={field.onChange} />
								)}
							/>
						</div>

						{metaPixelEnabled && (
							<div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-primary/50">
								<div className="space-y-2">
									<Label htmlFor="metaPixelId">Pixel ID</Label>
									<Input
										id="metaPixelId"
										{...register("metaPixelId")}
										placeholder="1234567890123456"
									/>
									<p className="text-xs text-muted-foreground">
										Lo encuentras en Meta Events Manager &gt; Datos del Pixel.
									</p>
									{errors.metaPixelId && (
										<p className="text-sm text-destructive">{errors.metaPixelId.message}</p>
									)}
								</div>
							</div>
						)}
					</div>
					)}

					{/* GTM */}
					{hasBehavior && (
					<div className="space-y-6 pt-4 border-t border-border">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<h3 className="text-md font-bold text-foreground">Google Tag Manager</h3>
								<p className="text-xs text-muted-foreground">
									Gestiona todos tus tags de tracking desde un solo panel centralizado.
								</p>
							</div>
							<Controller
								control={control}
								name="gtmEnabled"
								render={({ field }) => (
									<Switch checked={!!field.value} onChange={field.onChange} />
								)}
							/>
						</div>

						{gtmEnabled && (
							<div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-primary/50">
								<div className="space-y-2">
									<Label htmlFor="gtmContainerId">Container ID</Label>
									<Input
										id="gtmContainerId"
										{...register("gtmContainerId")}
										placeholder="GTM-XXXXXXX"
									/>
									<p className="text-xs text-muted-foreground">
										Lo encuentras en la consola de Google Tag Manager.
									</p>
									{errors.gtmContainerId && (
										<p className="text-sm text-destructive">{errors.gtmContainerId.message}</p>
									)}
								</div>
							</div>
						)}
					</div>
					)}

					<Button type="submit" disabled={isPending} className="w-full cursor-pointer">
						{isPending ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</form>
			</CardContent>
			</Card>
			</div>

			{hasConversions && (
			<TrackingConfigCard initialData={trackingData} isPending={trackingPending} startTransition={startTrackingTransition} router={router} />
			)}
		</>
	);
}

function TrackingConfigCard({
	initialData,
	isPending,
	startTransition,
	router,
}: {
	initialData?: Props["trackingData"];
	isPending: boolean;
	startTransition: (cb: () => void) => void;
	router: ReturnType<typeof useRouter>;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(tenantTrackingSchema),
		defaultValues: {
			googleAdsId: initialData?.googleAdsId || "",
			facebookPixelId: initialData?.facebookPixelId || "",
			gtmId: initialData?.gtmId || "",
			ga4MeasurementId: initialData?.ga4MeasurementId || "",
		},
	});

	const onSubmit = (data: TenantTrackingInput) => {
		startTransition(async () => {
			const result = await updateTrackingAction(data);
			if (result.success) {
				toast.success("Tracking de conversión actualizado");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	return (
			<div id="google-ads" className="scroll-mt-24">
			<Card className="border border-border mt-6">
			<CardHeader>
				<CardTitle>Google Ads (Conversión)</CardTitle>
				<CardDescription>
					Configura el tracking de conversión de Google Ads y Meta Pixel. Los IDs se validan
					automáticamente (solo letras, números, guiones y guiones bajos) para evitar inyecciones.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="googleAdsId">Google Ads Conversion ID</Label>
						<Input
							id="googleAdsId"
							{...register("googleAdsId")}
							placeholder="AW-XXXXXXXXXX"
						/>
						<p className="text-xs text-muted-foreground">
							Lo encuentras en Google Ads &gt; Conversiones &gt; Configuración de etiquetas.
						</p>
						{errors.googleAdsId && <p className="text-sm text-destructive">{errors.googleAdsId.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="facebookPixelId">Meta Pixel ID</Label>
						<Input
							id="facebookPixelId"
							{...register("facebookPixelId")}
							placeholder="1234567890123456"
						/>
						<p className="text-xs text-muted-foreground">
							Opcional si ya lo configuraste arriba. Se inyecta vía next/script en la home pública.
						</p>
						{errors.facebookPixelId && <p className="text-sm text-destructive">{errors.facebookPixelId.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="gtmId">Google Tag Manager Container ID</Label>
						<Input
							id="gtmId"
							{...register("gtmId")}
							placeholder="GTM-XXXXXXX"
						/>
						{errors.gtmId && <p className="text-sm text-destructive">{errors.gtmId.message}</p>}
					</div>

					<Button type="submit" disabled={isPending} className="w-full cursor-pointer">
						{isPending ? "Guardando..." : "Guardar Tracking"}
					</Button>
				</form>
			</CardContent>
		</Card>
		</div>
	);
}
