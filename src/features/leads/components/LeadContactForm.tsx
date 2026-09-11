"use client";

import { useState, useTransition } from "react";
import { submitLeadAction } from "@/features/leads/actions/lead.actions";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";

interface Props {
	buttonLabel: string;
	services?: { name: string }[];
}

export function LeadContactForm({ buttonLabel, services }: Props) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [selectedService, setSelectedService] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [sent, setSent] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		startTransition(async () => {
			const finalMessage = selectedService 
				? `[Servicio de interés: ${selectedService}]\n\n${message}` 
				: message;
				
			const result = await submitLeadAction({ name, email, phone, message: finalMessage });
			if (result.success) {
				setSent(true);
			} else {
				setError(result.error || "No se pudo enviar el mensaje");
			}
		});
	}

	if (sent) {
		return (
			<div className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm">
				<div className="size-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-5">✓</div>
				<h3 className="font-bold text-foreground">¡Mensaje enviado!</h3>
				<p className="mt-2 text-sm text-muted-foreground">Te contactaremos lo antes posible.</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col rounded-2xl bg-card p-6 text-left shadow-sm space-y-3"
		>
			<div className="space-y-1.5">
				<Label htmlFor="lead-name">Nombre</Label>
				<Input
					id="lead-name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Tu nombre"
					required
					minLength={2}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label htmlFor="lead-email">Correo</Label>
					<Input
						id="lead-email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="hola@correo.com"
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="lead-phone">Teléfono</Label>
					<Input
						id="lead-phone"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="3001234567"
					/>
				</div>
			</div>
			{services && services.length > 0 && (
				<div className="space-y-1.5">
					<Label htmlFor="lead-service">Servicio de interés</Label>
					<select
						id="lead-service"
						value={selectedService}
						onChange={(e) => setSelectedService(e.target.value)}
						className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					>
						<option value="">Selecciona una opción (opcional)</option>
						{services.map((service, index) => (
							<option key={index} value={service.name}>
								{service.name}
							</option>
						))}
					</select>
				</div>
			)}
			<div className="space-y-1.5">
				<Label htmlFor="lead-message">Mensaje</Label>
				<textarea
					id="lead-message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="¿En qué podemos ayudarte?"
					required
					minLength={3}
					rows={4}
					className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>
			{error && <p className="text-sm text-destructive">{error}</p>}
			<button
				type="submit"
				disabled={isPending}
				className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
			>
				{isPending ? "Enviando..." : buttonLabel}
			</button>
		</form>
	);
}


