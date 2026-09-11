import { AppearanceSettingsForm } from "@/features/settings/components/AppearanceSettingsForm";
import { SettingsService } from "@/features/settings/services/settings.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Personalización Visual | Admin",
};

export default async function AppearanceSettingsPage() {
	const tenantId = await getTenantIdFromHeaders();
	const appearance = await SettingsService.getAppearance(tenantId);

	return <AppearanceSettingsForm initialData={appearance} />;
}

