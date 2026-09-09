"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { whiteLabelConfigSchema, type WhiteLabelConfigInput } from "../schema/white-label.schema";
import { updateWhiteLabelConfigAction } from "../actions/white-label.actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { WhatsAppConfigCard } from "./WhatsAppConfigCard";
import { ChatboxConfigCard } from "./ChatboxConfigCard";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { isModuleEnabled } from "@/config/modules";

interface Props {
	initialData?: Partial<WhiteLabelConfigInput> | null;
}

export function WhiteLabelConfigForm({ initialData }: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<WhiteLabelConfigInput>({
		resolver: zodResolver(whiteLabelConfigSchema),
		defaultValues: {
			slug: initialData?.slug || "",
			businessName: initialData?.businessName || "",
			hours: initialData?.hours || "",
			phone: initialData?.phone || "",
			address: initialData?.address || "",
			extraInfo: initialData?.extraInfo || "",
			logo: initialData?.logo || "",
			primaryColor: initialData?.primaryColor || "",
			secondaryColor: initialData?.secondaryColor || "",
			fontFamily: initialData?.fontFamily || "",
			whatsappNumber: initialData?.whatsappNumber || "",
			whatsappMessage: initialData?.whatsappMessage || "",
			showWhatsapp: initialData?.showWhatsapp ?? false,
			showChatbot: initialData?.showChatbot ?? false,
			chatbotMode: initialData?.chatbotMode || "advanced",
			chatbotGreeting: initialData?.chatbotGreeting ?? "",
			chatbotPrompt: initialData?.chatbotPrompt ?? "",
			chatbotTags: initialData?.chatbotTags ?? [],
			aiProvider: initialData?.aiProvider ?? "",
			aiModel: initialData?.aiModel ?? "",
			aiSystemPrompt: initialData?.aiSystemPrompt ?? "",
			aiTemperature: initialData?.aiTemperature ?? "",
		},
	});

	const onSubmit = (data: WhiteLabelConfigInput) => {
		startTransition(async () => {
			const result = await updateWhiteLabelConfigAction(data);
			if (result.success) {
				toast.success("Configuración de Marca Blanca actualizada exitosamente");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar la configuración");
			}
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{/* Información General del Negocio */}
			<Card className="border border-border">
				<CardHeader>
					<CardTitle>Información del Negocio</CardTitle>
					<CardDescription>
						Configura la información pública de tu negocio para la Landing Page.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="slug">Slug (Identificador en URL)</Label>
							<Input id="slug" {...register("slug")} placeholder="ebanisteria-el-calvo" />
							{errors.slug && <p className="text-sm text-destructive">{errors.slug.message?.toString()}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="businessName">Nombre del Negocio</Label>
							<Input id="businessName" {...register("businessName")} placeholder="Ebanistería El Calvo" />
							{errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message?.toString()}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Teléfono del Negocio</Label>
							<Input id="phone" {...register("phone")} placeholder="+34 600 000 000" />
							{errors.phone && <p className="text-sm text-destructive">{errors.phone.message?.toString()}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="contactEmail">Email de Notificaciones (leads / presupuestos)</Label>
							<Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="notificaciones@tunegocio.com" />
							{errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message?.toString()}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="hours">Horario de Atención</Label>
							<Input id="hours" {...register("hours")} placeholder="Lunes a Viernes: 9:00 - 18:00" />
							{errors.hours && <p className="text-sm text-destructive">{errors.hours.message?.toString()}</p>}
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="address">Dirección</Label>
							<Input id="address" {...register("address")} placeholder="Calle 123 #45-67, Barrio Perla del Sur" />
							{errors.address && <p className="text-sm text-destructive">{errors.address.message?.toString()}</p>}
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="extraInfo">Información Adicional (Slogan / Descripción Corta)</Label>
							<Input id="extraInfo" {...register("extraInfo")} placeholder="Restauración y carpintería fina artesanal de confianza" />
							{errors.extraInfo && <p className="text-sm text-destructive">{errors.extraInfo.message?.toString()}</p>}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* WhatsApp — componente separado */}
			{isModuleEnabled("whitelabel_whatsapp") && (
				<WhatsAppConfigCard control={control} register={register} errors={errors} />
			)}

			{/* Chatbox — componente separado */}
			{(isModuleEnabled("whitelabel_chatbot_simple") || isModuleEnabled("whitelabel_chatbot_advanced")) && (
				<ChatboxConfigCard 
					control={control} 
					register={register} 
					watch={watch} 
					errors={errors} 
					allowSimple={isModuleEnabled("whitelabel_chatbot_simple")}
					allowAdvanced={isModuleEnabled("whitelabel_chatbot_advanced")}
				/>
			)}

			<Button type="submit" disabled={isPending} className="w-full cursor-pointer">
				{isPending ? "Guardando..." : "Guardar Configuración de Marca Blanca"}
			</Button>
		</form>
	);
}
