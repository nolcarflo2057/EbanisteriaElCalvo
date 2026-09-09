import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth/auth-server";
import { RolesService } from "@/features/roles/services/roles.service";
import { Title } from "@/shared/components/Title";
import { LeadService } from "@/features/leads/services/lead.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { LeadsTable } from "./LeadsTable";
const STATUS_LABEL: Record<string, string> = {
	new: "Nuevo",
	contacted: "Contactado",
	converted: "Convertido",
	ignored: "Ignorado",
};

export const dynamic = "force-dynamic";

export default async function LeadsPage() {

	const session = await getServerSession();
	if (!session) redirect("/");

	const isAdmin = await RolesService.hasRole(session.user.id, "admin");
	if (!isAdmin) redirect("/dashboard");

	const tenantId = await getTenantIdFromHeaders();
	const leads = await LeadService.list(tenantId);

	const counts = leads.reduce<Record<string, number>>((acc, lead) => {
		acc[lead.status] = (acc[lead.status] || 0) + 1;
		return acc;
	}, {});

	return (
		<div className="flex flex-col w-full max-w-7xl mx-auto px-5">
			<Title title="Leads de Contacto" />
			<p className="text-muted-foreground mt-1 mb-6">
				Mensajes recibidos desde el formulario de contacto de la landing.
			</p>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<div className="rounded-xl border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Nuevos</p>
					<p className="text-2xl font-bold text-foreground">{counts["new"] || 0}</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Contactados</p>
					<p className="text-2xl font-bold text-foreground">{counts["contacted"] || 0}</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Convertidos</p>
					<p className="text-2xl font-bold text-foreground">{counts["converted"] || 0}</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Total</p>
					<p className="text-2xl font-bold text-foreground">{leads.length}</p>
				</div>
			</div>

			<LeadsTable
				leads={leads.map((lead) => ({
					id: lead.id,
					name: lead.name,
					email: lead.email,
					phone: lead.phone,
					message: lead.message,
					status: lead.status,
					createdAt: lead.createdAt,
				}))}
				statusLabels={STATUS_LABEL}
			/>
		</div>
	);
}
