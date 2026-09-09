"use server";

import { db } from "@/db";
import { tenants, tenantSettings, tenantAppearance, tenantMembers, tenantPageBlocks } from "@/db/schema/core";
import { users } from "@/db/schema/auth";
import { requireAuth } from "@/lib/auth/auth-server";
import { getErrorMessage } from "@/lib/errors";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function setupTenantAction(data: {
	name: string;
	slug: string;
	niche: string;
	primaryColor?: string;
}) {
	try {
		const authResult = await requireAuth();
		if (!authResult.isAuth || !authResult.session) {
			throw new Error("No autenticado");
		}
		const userId = authResult.session.user.id;

		const cleanSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
		if (!cleanSlug) {
			throw new Error("Slug de subdominio inválido");
		}

		// 1. Crear el Tenant
		const [newTenant] = await db
			.insert(tenants)
			.values({
				name: data.name.trim(),
				slug: cleanSlug,
				description: `Landing page para ${data.name.trim()} - Nicho: ${data.niche}`,
				active: true,
			})
			.returning();

		const tenantId = newTenant.id;

		// 2. Crear configuración general
		await db.insert(tenantSettings).values({
			tenantId,
			currency: "USD",
			locale: "es-CO",
			timezone: "America/Bogota",
		});

		// 3. Crear apariencia
		await db.insert(tenantAppearance).values({
			tenantId,
			primaryColor: data.primaryColor || "#F97316",
			secondaryColor: "#F4F4F5",
			accentColor: "#EA580C",
			borderRadius: "0.375rem",
			shadowStyle: "shadow-xs",
		});

		// 4. Crear miembro admin del tenant
		await db.insert(tenantMembers).values({
			tenantId,
			userId,
			role: "admin",
		});

		// 5. Actualizar activeTenantId del usuario
		await db
			.update(users)
			.set({
				activeTenantId: tenantId,
			})
			.where(eq(users.id, userId));

		// 6. Sembrar bloques iniciales para la landing page
		const defaultBlocks = [
			{
				tenantId,
				pageKey: "home",
				blockType: "navigation",
				label: "Navegación Principal",
				visible: true,
				order: 0,
				props: {
					brand: data.name,
					links: [
						{ label: "Inicio", href: "#" },
						{ label: "Servicios", href: "#servicios" },
						{ label: "Contacto", href: "#contacto" },
					],
					ctaLabel: "Solicitar Cita",
					ctaHref: "#contacto",
				},
			},
			{
				tenantId,
				pageKey: "home",
				blockType: "hero",
				label: "Portada",
				visible: true,
				order: 1,
				props: {
					title: `Bienvenido a ${data.name}`,
					subtitle: `Ofrecemos servicios premium de ${data.niche} adaptados a tus necesidades.`,
					ctaLabel: "Ver Servicios",
					ctaHref: "#servicios",
					badge: "Nuevo Negocio",
				},
			},
			{
				tenantId,
				pageKey: "home",
				blockType: "features",
				label: "Características/Servicios",
				visible: true,
				order: 2,
				props: {
					title: "Nuestros Servicios",
					subtitle: "Conoce lo que podemos hacer por ti.",
					features: [
						{ title: "Servicio Profesional", description: "Atención de alta calidad y personalizada.", icon: "star" },
						{ title: "Garantía de Satisfacción", description: "Tu felicidad es nuestra máxima prioridad.", icon: "check_circle" },
						{ title: "Soporte Rápido", description: "Contáctanos ante cualquier inquietud.", icon: "support_agent" },
					],
				},
			},
			{
				tenantId,
				pageKey: "home",
				blockType: "cta",
				label: "Llamado a la acción",
				visible: true,
				order: 3,
				props: {
					title: "¿Listo para empezar?",
					subtitle: "Agenda tu primera cita hoy mismo y descubre la diferencia.",
					buttonText: "Agendar Cita",
					buttonHref: "#contacto",
				},
			},
			{
				tenantId,
				pageKey: "home",
				blockType: "footer",
				label: "Pie de página",
				visible: true,
				order: 4,
				props: {
					brand: data.name,
					tagline: "Muebles con alma, hechos a mano.",
					copyright: `© ${new Date().getFullYear()} ${data.name}. Todos los derechos reservados.`,
					linkGroups: [
						{
							title: "Navegación",
							links: [
								{ label: "Servicios", href: "#servicios" },
								{ label: "Contacto", href: "#contacto" },
							],
						},
						{
							title: "Legal",
							links: [
								{ label: "Privacidad", href: "/p/privacidad" },
								{ label: "Términos", href: "/p/terminos" },
							],
						},
					],
					iconButtons: [
						{ icon: "share", href: "#", label: "Compartir" },
						{ icon: "call", href: "#contacto", label: "Llamar" },
					],
				},
			},
		];

		for (const block of defaultBlocks) {
			await db.insert(tenantPageBlocks).values(block);
		}

		revalidatePath("/", "layout");
		return { success: true, tenantId };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}
