import { AdminSidebar } from "@/features/dashboard/components/AdminSidebar";
import { AdminSidebarMobile } from "@/features/dashboard/components/AdminSidebarMobile";
import { DashboardTopbar } from "@/features/dashboard/components/DashboardTopbar";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { SettingsService } from "@/features/settings/services/settings.service";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const tenantId = await getTenantIdFromHeaders();

	let storeName = "Panel de control";
	let primaryColor = "#F97316";
	let logoUrl: string | null = null;

	try {
		const [settings, appearance] = await Promise.all([
			SettingsService.getSettings(tenantId),
			SettingsService.getAppearance(tenantId),
		]);
		if (settings?.name) {
			storeName = settings.name;
		}
		if (appearance) {
			primaryColor = appearance.primaryColor || "#F97316";
			logoUrl = appearance.logoUrl || null;
		}
	} catch (error) {
		// Fallback silencioso en build time
	}

	return (
		<>
			<div className="min-h-screen bg-background">
				<AdminSidebar
					initialStoreName={storeName}
					initialPrimaryColor={primaryColor}
					initialLogoUrl={logoUrl}
				/>
				<AdminSidebarMobile
					initialStoreName={storeName}
					initialPrimaryColor={primaryColor}
					initialLogoUrl={logoUrl}
				/>

				<main className="desktop-main min-h-screen dashboard-ui">
					<DashboardTopbar />
					<div className="mx-auto w-full max-w-none space-y-6">
						{children}
					</div>
				</main>
			</div>
		</>
	);
}

