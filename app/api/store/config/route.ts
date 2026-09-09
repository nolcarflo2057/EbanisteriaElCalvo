import { NextResponse } from "next/server";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { getStoreConfig } from "@/features/stores/services/store-config.service";

export async function GET() {
	try {
		const tenantId = await getTenantIdFromHeaders();
		const config = await getStoreConfig(tenantId);
		return NextResponse.json(config);
	} catch (error) {
		console.error("Failed to fetch store config:", error);
		return NextResponse.json(
			{ error: "Failed to fetch store config" },
			{ status: 500 }
		);
	}
}
