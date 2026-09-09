"use client";

import React, { useState, useTransition } from "react";
import { setupTenantAction } from "../actions/onboarding.actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const NICHES = [
	{ id: "carpinteria", name: "Carpintería y Ebanistería" },
	{ id: "odontologia", name: "Odontología y Salud" },
	{ id: "belleza", name: "Belleza y Peluquería" },
	{ id: "consultoria", name: "Consultoría y Finanzas" },
	{ id: "limpieza", name: "Servicios de Limpieza" },
	{ id: "educacion", name: "Educación y Tutorías" },
];

const COLORS = [
	{ name: "Naranja Carvin", value: "#F97316" },
	{ name: "Azul Océano", value: "#0284C7" },
	{ name: "Verde Esmeralda", value: "#059669" },
	{ name: "Púrpura Elegante", value: "#7C3AED" },
	{ name: "Rojo Carmesí", value: "#DC2626" },
];

export function OnboardingWizard() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [niche, setNiche] = useState("");
	const [customNiche, setCustomNiche] = useState("");
	const [color, setColor] = useState("#F97316");

	const handleNextStep = () => {
		if (step === 1) {
			if (!name.trim()) {
				toast.error("El nombre del negocio es requerido");
				return;
			}
			const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
			if (!cleanSlug) {
				toast.error("El subdominio web es requerido");
				return;
			}
			setSlug(cleanSlug);
			setStep(2);
		} else if (step === 2) {
			if (!niche) {
				toast.error("Selecciona un rubro/nicho");
				return;
			}
			setStep(3);
		}
	};

	const handleNameChange = (val: string) => {
		setName(val);
		// Auto-generate slug suggestion
		const suggestedSlug = val
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
		setSlug(suggestedSlug);
	};

	const handleSubmit = () => {
		startTransition(async () => {
			const finalNiche = niche === "otro" ? customNiche : NICHES.find(n => n.id === niche)?.name || niche;
			if (!finalNiche.trim()) {
				toast.error("Por favor, especifica el rubro de tu negocio");
				return;
			}

			const result = await setupTenantAction({
				name,
				slug,
				niche: finalNiche,
				primaryColor: color,
			});

			if (result.success) {
				toast.success("¡Configuración inicial completada!");
				// Force a full router refresh and redirect to admin panel
				router.push("/admin");
				router.refresh();
			} else {
				toast.error(result.error || "Error al configurar el tenant");
			}
		});
	};

	return (
		<div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl max-w-lg w-full mx-auto space-y-6">
			{/* Progress Indicator */}
			<div className="flex justify-between items-center text-xs text-muted-foreground font-semibold border-b border-border pb-4">
				<span>Paso {step} de 3</span>
				<div className="flex gap-1.5">
					<div className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
					<div className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
					<div className={`h-2 w-8 rounded-full transition-colors ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
				</div>
			</div>

			{/* Step 1: Basic Info */}
			{step === 1 && (
				<div className="space-y-4">
					<div className="space-y-1">
						<h2 className="text-xl font-bold text-foreground">Tu Negocio</h2>
						<p className="text-sm text-muted-foreground">Configura los datos principales de tu landing page.</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="business-name">Nombre de tu Negocio / Empresa</Label>
						<Input
							id="business-name"
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder="ej. Ebanistería El Calvo"
							className="text-base"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="business-slug">Subdominio Web de tu Tienda</Label>
						<div className="flex items-center">
							<Input
								id="business-slug"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								placeholder="ej. el-calvo"
								className="rounded-r-none border-r-0 text-base"
							/>
							<span className="bg-secondary/20 border border-input border-l-0 px-3 py-2 text-sm text-muted-foreground rounded-r-md h-full flex items-center select-none">
								.carvin.dev
							</span>
						</div>
						<p className="text-xs text-muted-foreground">Dirección temporal para acceder a tu sitio.</p>
					</div>

					<Button onClick={handleNextStep} className="w-full cursor-pointer mt-4">
						Continuar
					</Button>
				</div>
			)}

			{/* Step 2: Niche Selection */}
			{step === 2 && (
				<div className="space-y-4">
					<div className="space-y-1">
						<h2 className="text-xl font-bold text-foreground">Rubro del Negocio</h2>
						<p className="text-sm text-muted-foreground">Selecciona el rubro de actividad para adecuar tu landing page.</p>
					</div>

					<div className="grid grid-cols-2 gap-3">
						{NICHES.map((item) => (
							<button
								key={item.id}
								onClick={() => setNiche(item.id)}
								className={`p-4 border rounded-xl text-left transition-all text-sm font-semibold cursor-pointer ${
									niche === item.id
										? "border-primary bg-primary/5 text-primary"
										: "border-border hover:border-foreground/50 text-foreground"
								}`}
							>
								{item.name}
							</button>
						))}
						<button
							onClick={() => setNiche("otro")}
							className={`p-4 border rounded-xl text-left transition-all text-sm font-semibold cursor-pointer ${
								niche === "otro"
									? "border-primary bg-primary/5 text-primary"
									: "border-border hover:border-foreground/50 text-foreground"
							}`}
						>
							Otro Rubro
						</button>
					</div>

					{niche === "otro" && (
						<div className="space-y-2 pt-2">
							<Label htmlFor="custom-niche">Especifica tu Rubro</Label>
							<Input
								id="custom-niche"
								value={customNiche}
								onChange={(e) => setCustomNiche(e.target.value)}
								placeholder="ej. Fotografía Profesional"
							/>
						</div>
					)}

					<div className="flex gap-2 pt-4">
						<Button variant="outline" onClick={() => setStep(1)} className="w-1/3 cursor-pointer">
							Atrás
						</Button>
						<Button onClick={handleNextStep} className="w-2/3 cursor-pointer">
							Continuar
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Brand Color */}
			{step === 3 && (
				<div className="space-y-4">
					<div className="space-y-1">
						<h2 className="text-xl font-bold text-foreground">Identidad Visual</h2>
						<p className="text-sm text-muted-foreground">Elige el color principal de acento para tu portal público.</p>
					</div>

					<div className="grid grid-cols-5 gap-3">
						{COLORS.map((c) => (
							<button
								key={c.value}
								onClick={() => setColor(c.value)}
								className={`h-12 w-full rounded-full border-4 cursor-pointer transition-transform ${
									color === c.value ? "border-foreground scale-110" : "border-transparent"
								}`}
								style={{ backgroundColor: c.value }}
								title={c.name}
							/>
						))}
					</div>

					<div className="flex gap-2 pt-6">
						<Button variant="outline" onClick={() => setStep(2)} className="w-1/3 cursor-pointer">
							Atrás
						</Button>
						<Button onClick={handleSubmit} disabled={isPending} className="w-2/3 cursor-pointer">
							{isPending ? "Configurando..." : "Completar Onboarding"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
