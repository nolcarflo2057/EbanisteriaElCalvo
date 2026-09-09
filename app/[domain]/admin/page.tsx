import { getServerSession } from "@/lib/auth/session";
import { RolesService } from "@/features/roles/services/roles.service";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { getStoreConfigSafe } from "@/features/stores/services/store-config.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
	const session = await getServerSession();

	if (session?.user) {
		const isAdmin = await RolesService.hasRole(session.user.id, "admin");
		if (isAdmin) {
			redirect("/dashboard");
		} else {
			redirect("/");
		}
	}

	// La marca es opcional: si la BD está lenta, el login debe seguir funcionando.
	let storeConfig: { name: string; logoUrl?: string };
	try {
		const tenantId = await getTenantIdFromHeaders();
		storeConfig = await getStoreConfigSafe(tenantId);
	} catch {
		storeConfig = { name: "Mi Tienda", logoUrl: undefined };
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="w-full max-w-md">
				<div className="mb-8 flex flex-col items-center gap-4 text-center">
					{storeConfig.logoUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={storeConfig.logoUrl}
							alt={storeConfig.name}
							className="h-16 w-auto object-contain"
						/>
					) : (
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
							{storeConfig.name.charAt(0).toUpperCase()}
						</div>
					)}
					<div>
						<h1 className="font-headline-md text-headline-md text-foreground">{storeConfig.name}</h1>
						<p className="text-muted-foreground mt-1">Inicia sesión para gestionar tu landing page</p>
					</div>
				</div>
				<div className="bg-card p-6 rounded-lg border border-border shadow-xs">
					<LoginForm redirectTo="/dashboard" showRegisterLink={false} />
				</div>
			</div>
		</div>
	);
}
