import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { getWhiteLabelConfig } from "@/features/whiteLabel/services/config.service";
import { WhiteLabelConfigForm } from "@/features/whiteLabel/components/WhiteLabelConfigForm";
import { KnowledgeBaseCard } from "@/features/whiteLabel/components/KnowledgeBaseCard";
import type { Metadata } from "next";
import type { WhiteLabelConfigInput } from "@/features/whiteLabel/schema/white-label.schema";

export const metadata: Metadata = {
	title: "Configuración de Marca Blanca | Admin",
};

export default async function WhiteLabelSettingsPage() {
	const tenantId = await getTenantIdFromHeaders();
	if (!tenantId) {
		return (
			<div className="p-6 text-center text-destructive font-medium">
				Tenant no encontrado.
			</div>
		);
	}

	const config = await getWhiteLabelConfig(tenantId);

	// Cast DB result to form input type, ensuring chatbotMode matches enum
	const initialData = config ? (config as unknown as WhiteLabelConfigInput) : null;

	return (
		<div className="space-y-6">
			<WhiteLabelConfigForm initialData={initialData} />
			<KnowledgeBaseCard />
		</div>
	);
}
