import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { SettingsService } from "@/features/settings/services/settings.service";
import { SocialSettingsForm } from "@/features/settings/components/SocialSettingsForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Redes Sociales | Admin",
};

export default async function SocialSettingsPage() {
	const tenantId = await getTenantIdFromHeaders();
	const social = await SettingsService.getSocial(tenantId);

	return <SocialSettingsForm initialData={social} />;
}

