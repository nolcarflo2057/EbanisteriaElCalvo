"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatusAction, deleteLeadAction, deleteLeadsAction, markLeadNotificationsAsReadAction } from "@/features/leads/actions/lead.actions";
import toast from "react-hot-toast";
import { Dialog } from "@/shared/components/ui/Dialog";
import { useSession } from "@/lib/auth/auth-client";
import Pusher from "pusher-js";
import { Trash2, Download } from "lucide-react";
import { toCsv, downloadCsv, timestampForFile } from "@/shared/utils/csv";

interface LeadRow {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	message: string;
	status: string;
	createdAt: Date;
}

interface Props {
	leads: LeadRow[];
	statusLabels: Record<string, string>;
}

const STATUS_OPTIONS = ["new", "contacted", "converted", "ignored"];

const STATUS_COLOR: Record<string, string> = {
	new: "bg-amber-100 text-amber-800 border-amber-200",
	contacted: "bg-blue-100 text-blue-800 border-blue-200",
	converted: "bg-emerald-100 text-emerald-800 border-emerald-200",
	ignored: "bg-gray-100 text-gray-800 border-gray-200",
};

function formatDate(d: Date | string): string {
	const dateObj = typeof d === "string" ? new Date(d) : d;
	if (!dateObj || isNaN(dateObj.getTime())) {
		return "Fecha inválida";
	}
	return new Intl.DateTimeFormat("es-CO", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(dateObj);
}


export function LeadsTable({ leads, statusLabels }: Props) {
	const router = useRouter();
	const { data: session } = useSession();
	const [isPending, startTransition] = useTransition();
	const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; ids: string[] }>({ isOpen: false, ids: [] });

	// Force fresh data on component mount (bypasses client-side router cache) and mark lead notifications as read
	useEffect(() => {
		router.refresh();
		markLeadNotificationsAsReadAction();
	}, [router]);

	// Live refresh when a new lead notification is broadcasted
	useEffect(() => {
		if (!session?.user?.id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return;

		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
		});

		const channelName = `notification-channel-${session.user.id}`;
		const channel = pusher.subscribe(channelName);

		channel.bind("new-notification", (newNotif: { title: string }) => {
			if (newNotif && newNotif.title === "Nuevo Lead de Contacto") {
				router.refresh();
			}
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
		};
	}, [session?.user?.id, router]);

	function changeStatus(leadId: string, status: string) {
		startTransition(async () => {
			const result = await updateLeadStatusAction(
				leadId,
				status as "new" | "contacted" | "converted" | "ignored"
			);
			if (result.success) {
				toast.success("Estado actualizado");
				router.refresh();
			} else {
				toast.error(result.error || "Error al actualizar");
			}
		});
	}

	function handleConfirmDelete() {
		const ids = confirmDelete.ids;
		if (ids.length === 0) return;
		startTransition(async () => {
			const result = await deleteLeadsAction(ids);
			if (result.success) {
				toast.success(ids.length === 1 ? "Lead eliminado" : "Leads eliminados");
				setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
				setConfirmDelete({ isOpen: false, ids: [] });
				router.refresh();
			} else {
				toast.error(result.error || "Error al eliminar");
			}
		});
	}

	const allSelected = leads.length > 0 && selectedIds.length === leads.length;
	const toggleSelectAll = () => {
		if (allSelected) {
			setSelectedIds([]);
		} else {
			setSelectedIds(leads.map(l => l.id));
		}
	};

	const toggleSelectOne = (id: string) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(prev => prev.filter(item => item !== id));
		} else {
			setSelectedIds(prev => [...prev, id]);
		}
	};

	function exportCsv() {
		const headers = ["Nombre", "Email", "Teléfono", "Mensaje", "Estado", "Recibido"];
		const rows = leads.map((lead) => [
			lead.name,
			lead.email || "",
			lead.phone || "",
			lead.message,
			statusLabels[lead.status] || lead.status,
			formatDate(lead.createdAt),
		]);
		downloadCsv(`leads_${timestampForFile()}.csv`, toCsv(headers, rows));
		toast.success("CSV exportado");
	}

	if (leads.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
				<p className="text-lg font-semibold text-foreground">Sin leads todavía</p>
				<p className="text-sm text-muted-foreground mt-1">
					Los mensajes del formulario de contacto de tu landing aparecerán aquí.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-end mb-4">
				<button
					onClick={exportCsv}
					className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border hover:bg-muted text-sm font-semibold rounded-xl transition-all cursor-pointer button-shine"
				>
					<Download className="w-4 h-4 text-muted-foreground" />
					Exportar CSV
				</button>
			</div>
			{selectedIds.length > 0 && (
				<div className="flex items-center justify-between bg-primary-container/20 border border-primary/25 rounded-xl p-4 mb-4 transition-all duration-200">
					<span className="text-sm font-medium text-foreground">
						{selectedIds.length} {selectedIds.length === 1 ? "lead seleccionado" : "leads seleccionados"}
					</span>
					<button
						onClick={() => setConfirmDelete({ isOpen: true, ids: selectedIds })}
						disabled={isPending}
						className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
					>
						Eliminar seleccionados
					</button>
				</div>
			)}

			<div className="overflow-hidden rounded-xl border border-border bg-card">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-border">
						<thead className="bg-muted/40">
							<tr>
								<th scope="col" className="px-6 py-4 text-left w-10">
									<input
										type="checkbox"
										checked={allSelected}
										onChange={toggleSelectAll}
										className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4 cursor-pointer"
									/>
								</th>
								<th scope="col" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 text-left">Cliente</th>
								<th scope="col" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 text-left">Mensaje</th>
								<th scope="col" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 text-left">Recibido</th>
								<th scope="col" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 text-left">Estado</th>
								<th scope="col" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4 text-right">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							{leads.map((lead) => (
								<tr key={lead.id} className="transition duration-150 ease-in-out hover:bg-muted/30 align-middle">
									<td className="px-6 py-4 w-10">
										<input
											type="checkbox"
											checked={selectedIds.includes(lead.id)}
											onChange={() => toggleSelectOne(lead.id)}
											className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4 cursor-pointer"
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm font-semibold text-foreground">{lead.name}</p>
										{lead.email && (
											<p className="text-xs text-muted-foreground truncate max-w-[200px]">{lead.email}</p>
										)}
										{lead.phone && (
											<p className="text-xs text-muted-foreground">{lead.phone}</p>
										)}
									</td>
									<td className="px-6 py-4">
										<div className="max-w-[320px]">
											<p className="text-sm text-foreground whitespace-pre-wrap line-clamp-3 leading-relaxed">
												{lead.message}
											</p>
											{(lead.message.length > 100 || lead.message.includes("\n")) && (
												<button
													onClick={() => setSelectedLead(lead)}
													className="mt-1 text-xs text-primary hover:underline font-medium cursor-pointer"
												>
													Ver completo...
												</button>
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground" suppressHydrationWarning>
										{formatDate(lead.createdAt)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<select
											value={lead.status}
											onChange={(e) => changeStatus(lead.id, e.target.value)}
											disabled={isPending}
											className={`rounded-full border px-3 py-1 text-xs font-medium cursor-pointer disabled:opacity-50 transition-all ${STATUS_COLOR[lead.status] || "bg-gray-100 text-gray-800"}`}
										>
											{STATUS_OPTIONS.map((s) => (
												<option key={s} value={s} className="bg-white text-foreground">
													{statusLabels[s]}
												</option>
											))}
										</select>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										<button
											onClick={() => setConfirmDelete({ isOpen: true, ids: [lead.id] })}
											disabled={isPending}
											className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center"
											title="Eliminar lead"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<Dialog
				isOpen={selectedLead !== null}
				onClose={() => setSelectedLead(null)}
				title={`Mensaje de ${selectedLead?.name}`}
				description={selectedLead ? `Recibido el ${formatDate(selectedLead.createdAt)}` : undefined}
			>
				{selectedLead && (
					<div className="space-y-4">
						<div className="rounded-lg bg-secondary/35 p-4 border border-border">
							<p className="text-sm font-semibold text-foreground">Detalles del contacto:</p>
							<div className="mt-2 space-y-1 text-xs text-muted-foreground">
								{selectedLead.email && <p><strong>Email:</strong> {selectedLead.email}</p>}
								{selectedLead.phone && <p><strong>Teléfono:</strong> {selectedLead.phone}</p>}
							</div>
						</div>
						
						<div className="space-y-2">
							<p className="text-sm font-semibold text-foreground">Mensaje completo:</p>
							<p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto bg-card p-3 rounded-lg border border-border">
								{selectedLead.message}
							</p>
						</div>

						<div className="flex justify-end pt-2">
							<button
								onClick={() => setSelectedLead(null)}
								className="rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
							>
								Cerrar
							</button>
						</div>
					</div>
				)}
			</Dialog>

			<Dialog
				isOpen={confirmDelete.isOpen}
				onClose={() => setConfirmDelete({ isOpen: false, ids: [] })}
				title="Confirmar eliminación"
			>
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						¿Estás seguro de que deseas eliminar {confirmDelete.ids.length === 1 ? "este lead" : `estos ${confirmDelete.ids.length} leads`}? Esta acción no se puede deshacer.
					</p>

					<div className="flex justify-end space-x-3 pt-2">
						<button
							onClick={() => setConfirmDelete({ isOpen: false, ids: [] })}
							className="rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
						>
							Cancelar
						</button>
						<button
							onClick={handleConfirmDelete}
							disabled={isPending}
							className="rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
						>
							Eliminar
						</button>
					</div>
				</div>
			</Dialog>
		</div>
	);
}
