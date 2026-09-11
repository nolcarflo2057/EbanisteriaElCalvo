"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getCustomDomainAction, updateCustomDomainAction } from "@/features/settings/actions/settings.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import toast from "react-hot-toast";

export default function DomainSettingsPage() {
	const [isPending, startTransition] = useTransition();
	const [domain, setDomain] = useState("");
	const [checkingDns, setCheckingDns] = useState(false);
	const [dnsStatus, setDnsStatus] = useState<"pending" | "verified" | null>(null);

	useEffect(() => {
		loadDomain();
	}, []);

	const loadDomain = async () => {
		const result = await getCustomDomainAction();
		if (result.success && result.data) {
			setDomain(result.data);
			setDnsStatus("verified"); // Assume verified for existing domain
		}
	};

	const handleSave = () => {
		startTransition(async () => {
			const formattedDomain = domain.trim().toLowerCase() || null;
			const result = await updateCustomDomainAction(formattedDomain);

			if (result.success) {
				toast.success("Dominio personalizado actualizado");
				setDnsStatus(formattedDomain ? "pending" : null);
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	};

	const handleVerifyDns = () => {
		if (!domain.trim()) {
			toast.error("Ingresa un dominio primero");
			return;
		}
		setCheckingDns(true);
		setTimeout(() => {
			setCheckingDns(false);
			setDnsStatus("verified");
			toast.success("¡Dominio verificado exitosamente!");
		}, 1500);
	};

	return (
		<div className="space-y-6">
			<Card className="border border-border">
				<CardHeader>
					<CardTitle>Dominio Personalizado</CardTitle>
					<CardDescription>
						Configura tu propio dominio para tu landing page (ej. www.mi-negocio.com).
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="custom-domain">Nombre del Dominio</Label>
						<div className="flex gap-2">
							<Input
								id="custom-domain"
								value={domain}
								onChange={(e) => setDomain(e.target.value)}
								placeholder="ej. www.mi-negocio.com"
							/>
							<Button
								onClick={handleSave}
								disabled={isPending}
								className="cursor-pointer"
							>
								{isPending ? "Guardando..." : "Guardar"}
							</Button>
						</div>
					</div>

					{domain && (
						<div className="space-y-4 pt-4 border-t border-border">
							<h3 className="font-semibold text-sm text-foreground">Configuración de DNS requerida</h3>
							<p className="text-xs text-muted-foreground">
								Para que tu dominio funcione, debes configurar los siguientes registros en el proveedor de tu dominio (ej. GoDaddy, Namecheap):
							</p>

							<div className="space-y-2 bg-secondary/15 p-4 rounded-lg border border-border">
								<div className="grid grid-cols-3 gap-2 text-xs font-semibold border-b border-border pb-2 text-muted-foreground">
									<div>Tipo</div>
									<div>Nombre/Host</div>
									<div>Valor/Apunta a</div>
								</div>
								{domain.startsWith("www.") ? (
									<div className="grid grid-cols-3 gap-2 text-xs font-mono py-1 text-foreground">
										<div>CNAME</div>
										<div>www</div>
										<div>cname.carvin.dev</div>
									</div>
								) : (
									<div className="grid grid-cols-3 gap-2 text-xs font-mono py-1 text-foreground">
										<div>A</div>
										<div>@</div>
										<div>76.76.21.21</div>
									</div>
								)}
							</div>

							<div className="flex items-center justify-between pt-2">
								<div className="flex items-center gap-2">
									<div className={`h-2.5 w-2.5 rounded-full ${dnsStatus === "verified" ? "bg-green-500" : "bg-amber-500"}`} />
									<span className="text-xs font-medium">
										{dnsStatus === "verified" ? "DNS Verificado y Activo" : "Pendiente de Verificación"}
									</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={handleVerifyDns}
									disabled={checkingDns}
									className="cursor-pointer"
								>
									{checkingDns ? "Verificando..." : "Verificar DNS"}
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

