import { IntegrationsSettingsForm } from "@/features/analytics/components/IntegrationsSettingsForm";
import { getIntegrationsAction } from "@/features/analytics/actions/integrations.actions";
import { SettingsService } from "@/features/settings/services/settings.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Integraciones de Analytics | Admin",
};

export default async function IntegrationsSettingsPage() {
	const integrations = await getIntegrationsAction();
	const tenantId = await getTenantIdFromHeaders();
	const tracking = await SettingsService.getTracking(tenantId);

	return <IntegrationsSettingsForm initialData={integrations} trackingData={tracking} />;
}
