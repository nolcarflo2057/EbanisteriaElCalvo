import React from "react";
import { requireAuth } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { RolesService } from "@/features/roles/services/roles.service";
import { SettingsSidebar } from "@/features/settings/components/SettingsSidebar";

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
	const authResult = await requireAuth();
	if (!authResult.isAuth || !authResult.session) {
		redirect("/");
	}

	const isAdmin = await RolesService.hasRole(authResult.session.user.id, "admin");
	if (!isAdmin) {
		redirect("/dashboard");
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-foreground">Configuración de Tienda</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Administra la información general, apariencia visual y SEO de tu landing page.
				</p>
			</div>

			<div className="flex flex-col gap-0">
				{/* Top Browser-like Tab bar */}
				<SettingsSidebar />

				{/* Content area */}
				<main className="flex-1 min-w-0 bg-card border border-border shadow-sm rounded-b-xl p-6 md:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}
