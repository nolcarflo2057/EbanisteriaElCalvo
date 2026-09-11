import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { getServerSession } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { tenants } from "@/db/schema/core";
import { eq, and } from "drizzle-orm";

interface Props {
	params: Promise<{
		domain: string;
	}>;
}

export default async function RegisterPage({ params }: Props) {
	const { domain } = await params;

	// Check if this domain is a registered tenant (customer store)
	const tenant = await db
		.select({ id: tenants.id })
		.from(tenants)
		.where(and(eq(tenants.slug, domain), eq(tenants.active, true)))
		.limit(1);

	const isCustomerTenant = tenant.length > 0;

	if (isCustomerTenant) {
		// Registration disabled in store context
		redirect("/");
	}

	const session = await getServerSession();
	if (session?.user?.id) {
		const [user] = await db
			.select({ activeTenantId: users.activeTenantId })
			.from(users)
			.where(eq(users.id, session.user.id))
			.limit(1);

		if (user?.activeTenantId) {
			redirect("/admin");
		} else {
			redirect("/onboarding");
		}
	}

	return (
		<div className="flex flex-col min-h-screen pt-32 sm:pt-52 px-4 max-w-md mx-auto w-full">
			<h1 className="antialiased font-bold text-4xl mb-5">Nueva cuenta</h1>
			<RegisterForm />
		</div>
	);
}

