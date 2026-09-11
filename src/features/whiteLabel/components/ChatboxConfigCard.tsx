"use client";

import { useEffect, useRef } from "react";
import { Controller, type Control, type UseFormRegister, type UseFormWatch, type FieldErrors, useFieldArray } from "react-hook-form";
import { Switch } from "@/shared/components/ui/Switch";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/Select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { cn } from "@/shared/utils/cn";
import type { WhiteLabelConfigInput } from "../schema/white-label.schema";
import { buildDefaultChatbotTags } from "../constants/chatbot.constants";

interface Props {
	control: Control<WhiteLabelConfigInput>;
	register: UseFormRegister<WhiteLabelConfigInput>;
	watch: UseFormWatch<WhiteLabelConfigInput>;
	errors: FieldErrors<WhiteLabelConfigInput>;
	allowSimple?: boolean;
	allowAdvanced?: boolean;
}

export function ChatboxConfigCard({ control, register, watch, errors, allowSimple = true, allowAdvanced = true }: Props) {
	const showChatbot = watch("showChatbot");
	const chatbotMode = watch("chatbotMode");

	return (
		<Card className="border border-border">
			<CardHeader>
				<CardTitle>Chatbot de Asistente IA</CardTitle>
				<CardDescription>
					Activa un chatbot inteligente que responderá preguntas sobre tu negocio automáticamente.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Toggle activar/desactivar */}
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold text-foreground">Activar Chatbot</h3>
						<p className="text-xs text-muted-foreground">Muestra u oculta el widget de chat en la landing.</p>
					</div>
					<Controller
						control={control}
						name="showChatbot"
						render={({ field }) => (
							<Switch
								id="showChatbot"
								checked={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>

				{/* Selector de modo - solo se muestra si el chatbot está activo */}
				{showChatbot && (
					<>
						<div className="border-t border-border pt-4">
							<div className="space-y-2">
								<Label>Modo del Chatbot</Label>
								<Controller
									control={control}
									name="chatbotMode"
									render={({ field }) => {
										const opts = [
											...(allowSimple
												? [{ value: "simple", label: "Simple (sin IA)", desc: "Respuestas predefinidas por palabras clave." }]
												: []),
											...(allowAdvanced
												? [{ value: "advanced", label: "Avanzado (con IA)", desc: "Integra un proveedor de IA para respuestas inteligentes." }]
												: []),
										];
										const active = field.value ?? "advanced";
										return (
											<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
												{opts.map((opt) => {
													const isActive = active === opt.value;
													return (
														<button
															type="button"
															key={opt.value}
															onClick={() => field.onChange(opt.value)}
															className={cn(
																"rounded-lg border p-3 text-left transition-colors",
																isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
															)}
														>
															<div className="flex items-center justify-between gap-2">
																<span className="text-sm font-medium text-foreground">{opt.label}</span>
																{isActive && (
																	<span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
																		ACTIVO
																	</span>
																)}
															</div>
															<p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
														</button>
													);
												})}
											</div>
										);
									}}
								/>
							</div>
						</div>

						{/* Formulario condicional según modo */}
						{chatbotMode === "simple" ? (
							<SimpleChatbotFields control={control} register={register} watch={watch} errors={errors} />
						) : (
							<AdvancedChatbotFields control={control} register={register} errors={errors} />
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

function SimpleChatbotFields({
	control,
	register,
	watch,
	errors,
}: {
	control: Control<WhiteLabelConfigInput>;
	register: UseFormRegister<WhiteLabelConfigInput>;
	watch: UseFormWatch<WhiteLabelConfigInput>;
	errors: FieldErrors<WhiteLabelConfigInput>;
}) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "chatbotTags",
	});

	// Al entrar al modo simple sin tags configurados, precargar los tags
	// por defecto (Horarios, Ubicación, Precios, Contacto) con respuestas
	// basadas en la info ya existente del negocio. Se ejecuta una sola vez.
	const seeded = useRef(false);
	useEffect(() => {
		if (seeded.current) return;
		seeded.current = true;
		if (fields.length === 0) {
			const v = watch();
			append(
				buildDefaultChatbotTags({
					businessName: v.businessName,
					hours: v.hours,
					address: v.address,
					phone: v.phone,
					whatsappNumber: v.whatsappNumber,
				}),
			);
		}
	}, [append, fields.length, watch]);

	return (
		<div className="border-t border-border pt-4 space-y-4">
			<h3 className="text-sm font-semibold text-foreground">Configuración Simple</h3>
			<p className="text-xs text-muted-foreground">
				Define el saludo y las instrucciones del chatbot. Las respuestas se generan por palabras clave sin usar IA.
			</p>

			<div className="space-y-2">
				<Label htmlFor="chatbotGreeting">Saludo del Chatbot</Label>
				<Input
					id="chatbotGreeting"
					{...register("chatbotGreeting")}
					placeholder="¡Bienvenido! ¿En qué puedo ayudarte?"
				/>
				{errors.chatbotGreeting && (
					<p className="text-sm text-destructive">{errors.chatbotGreeting.message?.toString()}</p>
				)}
			</div>

			<div className="space-y-4 pt-4 border-t border-border">
				<div className="flex items-center justify-between">
					<div>
						<h4 className="text-sm font-semibold text-foreground">Preguntas Frecuentes (Tags)</h4>
						<p className="text-xs text-muted-foreground">Configura botones rápidos para que los usuarios obtengan respuestas instantáneas.</p>
					</div>
					<button
						type="button"
						onClick={() => append({ id: crypto.randomUUID(), tag: "", response: "" })}
						className="text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md font-medium transition-colors"
					>
						+ Agregar Pregunta
					</button>
				</div>

				<div className="space-y-4">
					{fields.map((field, index) => (
						<div key={field.id} className="relative p-4 border border-border rounded-lg bg-card/50 space-y-3">
							<button
								type="button"
								onClick={() => remove(index)}
								className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors p-1"
								aria-label="Eliminar pregunta"
							>
								✕
							</button>

							<div className="space-y-1.5">
								<Label className="text-xs">Pregunta / Etiqueta del botón</Label>
								<Input
									{...register(`chatbotTags.${index}.tag`)}
									placeholder="Ej: ¿Cuáles son sus horarios?"
									className="h-8 text-sm"
								/>
								{errors.chatbotTags?.[index]?.tag && (
									<p className="text-xs text-destructive">{errors.chatbotTags[index]?.tag?.message?.toString()}</p>
								)}
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs">Respuesta automática</Label>
								<Textarea
									{...register(`chatbotTags.${index}.response`)}
									placeholder="Ej: Nuestro horario de atención es de Lunes a Viernes de 9am a 6pm."
									className="min-h-[60px] text-sm"
								/>
								{errors.chatbotTags?.[index]?.response && (
									<p className="text-xs text-destructive">{errors.chatbotTags[index]?.response?.message?.toString()}</p>
								)}
							</div>
						</div>
					))}
					{fields.length === 0 && (
						<div className="text-center py-6 border border-dashed border-border rounded-lg text-muted-foreground text-sm">
							No hay preguntas frecuentes configuradas.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function AdvancedChatbotFields({
	control,
	register,
	errors,
}: {
	control: Control<WhiteLabelConfigInput>;
	register: UseFormRegister<WhiteLabelConfigInput>;
	errors: FieldErrors<WhiteLabelConfigInput>;
}) {
	return (
		<div className="border-t border-border pt-4 space-y-4">
			<h3 className="text-sm font-semibold text-foreground">Configuración de IA</h3>
			<p className="text-xs text-muted-foreground">
				Configura el proveedor de inteligencia artificial y los parámetros del modelo.
			</p>

			{/* Provider */}
			<div className="space-y-2">
				<Label>Proveedor de IA</Label>
				<Controller
					control={control}
					name="aiProvider"
					render={({ field }) => (
						<Select
							value={field.value ?? ""}
							onChange={field.onChange}
							options={[
								{ value: "openai", label: "OpenAI" },
								{ value: "anthropic", label: "Anthropic" },
							]}
							placeholder="Selecciona proveedor"
							className="w-full"
						/>
					)}
				/>
			</div>

			{/* Model */}
			<div className="space-y-2">
				<Label htmlFor="aiModel">Modelo de IA</Label>
				<Input
					id="aiModel"
					{...register("aiModel")}
					placeholder="gpt-4o-mini"
				/>
				{errors.aiModel && (
					<p className="text-sm text-destructive">{errors.aiModel.message?.toString()}</p>
				)}
			</div>

			{/* System Prompt */}
			<div className="space-y-2">
				<Label htmlFor="aiSystemPrompt">Prompt del Sistema</Label>
				<Textarea
					id="aiSystemPrompt"
					{...register("aiSystemPrompt")}
					placeholder="Eres un asistente de atención al cliente que responde preguntas sobre el negocio, horarios, precios y servicios..."
					className="min-h-[100px]"
				/>
				{errors.aiSystemPrompt && (
					<p className="text-sm text-destructive">{errors.aiSystemPrompt.message?.toString()}</p>
				)}
			</div>

			{/* Prompt de respaldo (fallback del sistema) */}
			<div className="space-y-2">
				<Label htmlFor="chatbotPrompt">Prompt de respaldo del Chatbot</Label>
				<Textarea
					id="chatbotPrompt"
					{...register("chatbotPrompt")}
					placeholder="Instrucciones adicionales que el asistente usará si el Prompt del Sistema está vacío..."
					className="min-h-[100px]"
				/>
				<p className="text-xs text-muted-foreground">
					Se usa como respaldo cuando el Prompt del Sistema (IA) no está definido.
				</p>
			</div>

			{/* Temperature */}
			<div className="space-y-2">
				<Label htmlFor="aiTemperature">Temperatura (0 - 1)</Label>
				<Input
					id="aiTemperature"
					type="number"
					step="0.1"
					min="0"
					max="1"
					{...register("aiTemperature")}
					placeholder="0.7"
				/>
				<p className="text-xs text-muted-foreground">
					Valores bajos = respuestas más precisas. Valores altos = más creatividad.
				</p>
				{errors.aiTemperature && (
					<p className="text-sm text-destructive">{errors.aiTemperature.message?.toString()}</p>
				)}
			</div>
		</div>
	);
}


