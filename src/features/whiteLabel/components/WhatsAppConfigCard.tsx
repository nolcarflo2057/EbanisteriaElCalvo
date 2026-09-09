"use client";

import { Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Switch } from "@/shared/components/ui/Switch";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import type { WhiteLabelConfigInput } from "../schema/white-label.schema";

interface Props {
	control: Control<WhiteLabelConfigInput>;
	register: UseFormRegister<WhiteLabelConfigInput>;
	errors: FieldErrors<WhiteLabelConfigInput>;
}

export function WhatsAppConfigCard({ control, register, errors }: Props) {
	return (
		<Card className="border border-border">
			<CardHeader>
				<CardTitle>Botón de WhatsApp Flotante</CardTitle>
				<CardDescription>
					Permite a los usuarios enviarte un mensaje directo a un solo clic.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold text-foreground">Activar WhatsApp</h3>
						<p className="text-xs text-muted-foreground">Muestra u oculta el botón flotante de WhatsApp.</p>
					</div>
					<Controller
						control={control}
						name="showWhatsapp"
						render={({ field }) => (
							<Switch
								id="showWhatsapp"
								checked={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
					<div className="space-y-2">
						<Label htmlFor="whatsappNumber">Número de WhatsApp (Con indicativo de país)</Label>
						<Input
							id="whatsappNumber"
							{...register("whatsappNumber")}
							placeholder="34600000000"
						/>
						<p className="text-xs text-muted-foreground">Ej: 573001234567 (sin el signo + ni espacios).</p>
						{errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message?.toString()}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="whatsappMessage">Mensaje Inicial Automático</Label>
						<Input
							id="whatsappMessage"
							{...register("whatsappMessage")}
							placeholder="Hola, me gustaría pedir un presupuesto..."
						/>
						{errors.whatsappMessage && <p className="text-sm text-destructive">{errors.whatsappMessage.message?.toString()}</p>}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
