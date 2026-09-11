"use client";

import { useEffect, useState } from "react";
import { getAuditLogsAction } from "../actions/audit.actions";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/components/ui/Table";
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/Card";
import toast from "react-hot-toast";

interface AuditLog {
	id: string;
	action: string;
	entity: string;
	entityId: string | null;
	metadata: any;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
	user: {
		name: string;
		email: string;
	} | null;
}

export function AuditLogTable() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getAuditLogsAction().then((res) => {
			if (res.error) {
				toast.error(res.error);
			} else if (res.logs) {
				setLogs(res.logs as any);
			}
			setIsLoading(false);
		});
	}, []);

	if (isLoading) {
		return <div className="text-center py-8">Cargando registros de auditoría...</div>;
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Auditoría del Sistema</CardTitle>
				<CardDescription>
					Registro histórico de las acciones realizadas por usuarios y procesos del sistema
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Fecha</TableHead>
							<TableHead>Usuario</TableHead>
							<TableHead>Acción</TableHead>
							<TableHead>Entidad</TableHead>
							<TableHead>ID Entidad</TableHead>
							<TableHead>IP</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{logs.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center text-muted-foreground py-8">
									No se encontraron registros de auditoría.
								</TableCell>
							</TableRow>
						) : (
							logs.map((log) => {
								let actionColor: "default" | "warning" | "destructive" | "success" = "default";
								if (log.action === "DELETE") actionColor = "destructive";
								if (log.action === "UPDATE") actionColor = "warning";
								if (log.action === "CREATE") actionColor = "success";

								return (
									<TableRow key={log.id}>
										<TableCell className="text-xs whitespace-nowrap">
											{new Date(log.createdAt).toLocaleString()}
										</TableCell>
										<TableCell>
											{log.user ? (
												<div>
													<p className="font-medium text-sm">{log.user.name}</p>
													<p className="text-xs text-muted-foreground">{log.user.email}</p>
												</div>
											) : (
												<span className="text-muted-foreground text-xs italic">Sistema</span>
											)}
										</TableCell>
										<TableCell>
											<Badge variant={actionColor}>{log.action}</Badge>
										</TableCell>
										<TableCell className="capitalize font-medium">{log.entity}</TableCell>
										<TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
											{log.entityId || "-"}
										</TableCell>
										<TableCell className="text-xs">{log.ipAddress || "-"}</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}


