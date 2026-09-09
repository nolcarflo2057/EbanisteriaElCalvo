import { SeoSettingsForm } from "@/features/settings/components/SeoSettingsForm";
import { SettingsService } from "@/features/settings/services/settings.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "SEO | Admin",
};

export default async function SeoSettingsPage() {
	const tenantId = await getTenantIdFromHeaders();
	const seo = await SettingsService.getSeo(tenantId);

	return <SeoSettingsForm initialData={seo} />;
}
