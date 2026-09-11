import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { SettingsService } from "@/features/settings/services/settings.service";
import { LegalesSettingsForm } from "@/features/settings/components/LegalesSettingsForm";

export default async function LegalesSettingsPage() {
	const tenantId = await getTenantIdFromHeaders();
	const legales = await SettingsService.getLegales(tenantId);

	return <LegalesSettingsForm initialData={legales} />;
}

