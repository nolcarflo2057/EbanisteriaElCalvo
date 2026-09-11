import { getServerSession } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { OnboardingWizard } from "@/features/auth/components/OnboardingWizard";

export default async function OnboardingPage() {
	const session = await getServerSession();
	if (!session?.user?.id) {
		redirect("/login");
	}

	const [user] = await db
		.select({ activeTenantId: users.activeTenantId })
		.from(users)
		.where(eq(users.id, session.user.id))
		.limit(1);

	if (user?.activeTenantId) {
		redirect("/admin");
	}

	return (
		<div className="flex flex-col min-h-screen pt-20 sm:pt-36 px-4 max-w-lg mx-auto w-full pb-10">
			<div className="text-center mb-8">
				<h1 className="antialiased font-bold text-3xl mb-2 text-foreground">Configuración Inicial</h1>
				<p className="text-muted-foreground text-sm">Bienvenido. Configura los detalles de tu nuevo negocio.</p>
			</div>
			<OnboardingWizard />
		</div>
	);
}

