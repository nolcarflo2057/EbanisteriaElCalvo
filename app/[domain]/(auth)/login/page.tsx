import { LoginForm } from "@/features/auth/components/LoginForm";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { getStoreConfigSafe } from "@/features/stores/services/store-config.service";

interface LoginPageProps {
	searchParams: Promise<{ redirect?: string }>;
}

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { redirect: redirectTo = "/dashboard" } = await searchParams;

	// La marca es opcional: si la BD está lenta, el login debe seguir funcionando.
	let storeConfig;
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
						<p className="text-muted-foreground mt-1">Inicia sesión en tu panel de administración</p>
					</div>
				</div>
				<LoginForm redirectTo={redirectTo} showRegisterLink={false} />
			</div>
		</div>
	);
}

