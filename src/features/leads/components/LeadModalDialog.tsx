"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { submitLeadAction } from "@/features/leads/actions/lead.actions";
import { Dialog } from "@/shared/components/ui/Dialog";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";

const MOTIVOS = [
	"Rehabilitación oral",
	"Diseño de sonrisa",
	"Carillas de porcelana",
	"Implantes",
	"Otro",
];

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export function LeadModalDialog({ isOpen, onClose }: Props) {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [motivo, setMotivo] = useState(MOTIVOS[0]);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		startTransition(async () => {
			const result = await submitLeadAction({
				name,
				email,
				phone,
				message: `Motivo: ${motivo}`,
			});
			if (result.success) {
				toast.success("Solicitud enviada correctamente. Nos contactaremos pronto.");
				setName("");
				setPhone("");
				setEmail("");
				setMotivo(MOTIVOS[0]);
				onClose();
			} else {
				setError(result.error || "No se pudo enviar su solicitud");
			}
		});
	}

	const inputClass =
		"border-0 border-b border-b-white/25 rounded-none bg-transparent px-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-10";

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			className="bg-[#15130F] text-white border-white/10 p-7 md:p-8 sm:max-w-md rounded-lg"
		>
			<span className="block text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
				Valoración privada
			</span>
			<h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white uppercase mb-2">
				Inicie su proyecto
			</h3>
			<p className="text-sm text-white/50 leading-relaxed mb-7">
				Complete sus datos y un especialista le contactará con absoluta
				confidencialidad.
			</p>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<Label
						htmlFor="lead-name"
						className="text-xs uppercase tracking-[0.2em] text-white/60"
					>
						Nombre
					</Label>
					<Input
						id="lead-name"
						type="text"
						required
						minLength={2}
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Su nombre"
						className={inputClass}
					/>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<div className="flex flex-col gap-2">
						<Label
							htmlFor="lead-phone"
							className="text-xs uppercase tracking-[0.2em] text-white/60"
						>
							Teléfono
						</Label>
						<Input
							id="lead-phone"
							type="tel"
							required
							minLength={6}
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="3001234567"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label
							htmlFor="lead-email"
							className="text-xs uppercase tracking-[0.2em] text-white/60"
						>
							Correo
						</Label>
						<Input
							id="lead-email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="hola@correo.com"
							className={inputClass}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<Label
						htmlFor="lead-motivo"
						className="text-xs uppercase tracking-[0.2em] text-white/60"
					>
						Motivo de consulta
					</Label>
					<select
						id="lead-motivo"
						value={motivo}
						onChange={(e) => setMotivo(e.target.value)}
						className="w-full rounded-md border border-white/15 bg-[#201C16] px-3 py-2 text-sm text-white focus:border-white/40 outline-none"
					>
						{MOTIVOS.map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>
</div>
			{error && <p className="text-sm text-[#E7BDB1]">{error}</p>}
			<button
				type="submit"
				disabled={isPending}
				className="mt-2 w-full cursor-pointer bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#E7C25F] disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isPending ? "Enviando..." : "Enviar solicitud"}
			</button>
			</form>
		</Dialog>
	);
}

