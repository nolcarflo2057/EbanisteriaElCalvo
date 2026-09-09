"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TenantSettingsInput, tenantSettingsSchema } from "../schema/settings.schema";
import { updateSettingsAction } from "../actions/settings.actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { Select, type SelectOption } from "@/shared/components/ui/Select";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";

const CURRENCY_OPTIONS: SelectOption[] = [
	{ value: "USD", label: "USD — Dólar estadounidense" },
	{ value: "COP", label: "COP — Peso colombiano" },
	{ value: "EUR", label: "EUR — Euro" },
	{ value: "MXN", label: "MXN — Peso mexicano" },
	{ value: "ARS", label: "ARS — Peso argentino" },
	{ value: "CLP", label: "CLP — Peso chileno" },
	{ value: "PEN", label: "PEN — Sol peruano" },
	{ value: "BRL", label: "BRL — Real brasileño" },
];

const LOCALE_OPTIONS: SelectOption[] = [
	{ value: "es-CO", label: "Español (Colombia) — es-CO" },
	{ value: "es-ES", label: "Español (España) — es-ES" },
	{ value: "es-MX", label: "Español (México) — es-MX" },
	{ value: "en-US", label: "English (US) — en-US" },
	{ value: "en-GB", label: "English (UK) — en-GB" },
	{ value: "pt-BR", label: "Português (Brasil) — pt-BR" },
];

const TIMEZONE_OPTIONS: SelectOption[] = [
	{ value: "America/Bogota", label: "America/Bogota (UTC-5)" },
	{ value: "America/Mexico_City", label: "America/Mexico_City (UTC-6)" },
	{ value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (UTC-3)" },
	{ value: "America/Santiago", label: "America/Santiago (UTC-4)" },
	{ value: "America/Lima", label: "America/Lima (UTC-5)" },
	{ value: "America/Sao_Paulo", label: "America/Sao_Paulo (UTC-3)" },
	{ value: "Europe/Madrid", label: "Europe/Madrid (UTC+1)" },
	{ value: "UTC", label: "UTC" },
];

interface Props {
	initialData?: Partial<TenantSettingsInput> | null;
}

export function GeneralSettingsForm({ initialData }: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(tenantSettingsSchema),
		defaultValues: {
			name: initialData?.name || "",
			currency: initialData?.currency || "USD",
			locale: initialData?.locale || "en-US",
			timezone: initialData?.timezone || "UTC",
			taxRate: initialData?.taxRate || "0.00",
			shippingCost: initialData?.shippingCost || 0,
			contactEmail: initialData?.contactEmail || "",
			contactPhone: initialData?.contactPhone || "",
		},
	});

	const onSubmit = (data: any) => {
		startTransition(async () => {
			const result = await updateSettingsAction(data);
			if (result.success) {
				toast.success("Configuración general actualizada exitosamente");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	return (
		<Card className="border border-border">
			<CardHeader>
				<CardTitle>Configuración General</CardTitle>
				<CardDescription>
					Ajusta los detalles básicos de tu tienda, como la moneda de facturación y los impuestos por defecto.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Nombre de la tienda */}
						<div className="space-y-2">
							<Label htmlFor="name">Nombre de la Tienda</Label>
							<Input id="name" {...register("name")} placeholder="Mi Tienda" />
							{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
						</div>

						{/* Moneda */}
						<div className="space-y-2">
							<Label htmlFor="currency">Moneda</Label>
							<Controller
								control={control}
								name="currency"
								render={({ field }) => (
									<Select
										id="currency"
										value={field.value}
										onChange={field.onChange}
										options={CURRENCY_OPTIONS}
										ariaLabel="Moneda de facturación"
									/>
								)}
							/>
							{errors.currency && <p className="text-sm text-destructive">{errors.currency.message}</p>}
						</div>

						{/* Idioma / Locale */}
						<div className="space-y-2">
							<Label htmlFor="locale">Idioma / Locale</Label>
							<Controller
								control={control}
								name="locale"
								render={({ field }) => (
									<Select
										id="locale"
										value={field.value}
										onChange={field.onChange}
										options={LOCALE_OPTIONS}
										ariaLabel="Locale"
									/>
								)}
							/>
							{errors.locale && <p className="text-sm text-destructive">{errors.locale.message}</p>}
						</div>

						{/* Zona Horaria */}
						<div className="space-y-2">
							<Label htmlFor="timezone">Zona Horaria</Label>
							<Controller
								control={control}
								name="timezone"
								render={({ field }) => (
									<Select
										id="timezone"
										value={field.value}
										onChange={field.onChange}
										options={TIMEZONE_OPTIONS}
										ariaLabel="Zona horaria"
									/>
								)}
							/>
							{errors.timezone && <p className="text-sm text-destructive">{errors.timezone.message}</p>}
						</div>

						{/* Tasa de Impuesto */}
						<div className="space-y-2">
							<Label htmlFor="taxRate">Tasa de Impuesto</Label>
							<Input id="taxRate" {...register("taxRate")} placeholder="0.19" />
							{errors.taxRate && <p className="text-sm text-destructive">{errors.taxRate.message}</p>}
							<p className="text-xs text-muted-foreground">Valor decimal. 0.19 equivale al 19% de IVA.</p>
						</div>

						{/* Costo de Envío */}
						<div className="space-y-2">
							<Label htmlFor="shippingCost">Costo de Envío Estándar</Label>
							<Input id="shippingCost" {...register("shippingCost")} type="number" placeholder="15000" />
							{errors.shippingCost && <p className="text-sm text-destructive">{errors.shippingCost.message}</p>}
						</div>

						{/* Email de Contacto */}
						<div className="space-y-2">
							<Label htmlFor="contactEmail">Email de Contacto</Label>
							<Input id="contactEmail" {...register("contactEmail")} type="email" placeholder="soporte@mitienda.com" />
							{errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
						</div>

						{/* Teléfono de Contacto */}
						<div className="space-y-2">
							<Label htmlFor="contactPhone">Teléfono de Contacto</Label>
							<Input id="contactPhone" {...register("contactPhone")} placeholder="+57 300 000 0000" />
							{errors.contactPhone && <p className="text-sm text-destructive">{errors.contactPhone.message}</p>}
						</div>
					</div>

					<Button type="submit" disabled={isPending} className="w-full cursor-pointer">
						{isPending ? "Guardando..." : "Guardar Configuración"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
