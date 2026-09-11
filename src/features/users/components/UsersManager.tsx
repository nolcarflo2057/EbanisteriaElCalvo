"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";

interface TenantUser {
	id: string;
	name: string;
	email: string;
	role: string;
	tenantId: string | null;
}

interface Props {
	initialUsers: TenantUser[];
}

export function UsersManager({ initialUsers }: Props) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
				<p className="text-muted-foreground">
					Listado de usuarios registrados en el tenant.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Listado de Usuarios</CardTitle>
					<CardDescription>
						Usuarios asociados al tenant actual.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nombre / Correo</TableHead>
								<TableHead>Rol</TableHead>
								<TableHead className="text-center">Tenant Asociado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{initialUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="font-medium">{user.name}</div>
										<div className="text-sm text-muted-foreground">{user.email}</div>
									</TableCell>
									<TableCell>
										<Badge variant={user.role === "admin" ? "destructive" : user.role === "super_admin" ? "default" : "secondary"}>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										{user.tenantId ? "Sí" : "No"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}


