import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { SettingsService } from "@/features/settings/services/settings.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Configuración General | Admin",
};

export default async function GeneralSettingsPage() {
	const tenantId = await getTenantIdFromHeaders();
	const settings = await SettingsService.getSettings(tenantId);


	return <GeneralSettingsForm initialData={settings} />;
}
