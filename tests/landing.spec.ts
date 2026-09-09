import { test, expect, type Page } from "@playwright/test";

test.describe("Landing pública — El Calvo", () => {
	test.afterEach(async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 }).catch(() => {});
	});

	test("Navigation: brand, CTA y enlace al formulario", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.locator("nav h1").first()).toHaveText("El Calvo", { timeout: 30000 });
		await expect(page.locator("nav button", { hasText: "Pedir Presupuesto" }).first()).toBeVisible();
	});

	test("Hero: título, subtítulo y botón", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const heroTitle = page.getByRole("heading", { name: /Transformamos tus muebles/ }).first();
		await expect(heroTitle).toBeVisible({ timeout: 30000 });
		await expect(page.locator("text=Contáctanos ahora").first()).toBeVisible();
	});

	test("Servicios: grid de servicios visible", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.getByRole("heading", { name: /Servicios de Ebanister/i }).first()).toBeVisible({ timeout: 30000 });
	});

	test("Artesano: sección con badge y descripción", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.locator("[id=artesano]")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("[id=artesano]").getByText(/El Maestro Detr/i).first()).toBeVisible();
		await expect(page.locator("[id=artesano]").getByRole("heading", { name: /Conoce a El Calvo/i }).first()).toBeVisible();
	});

	test("Galería: título y subtítulo", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.locator("[id=galeria]")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("[id=galeria]").getByRole("heading", { name: /Nuestra Galer/i }).first()).toBeVisible();
	});

	test("Ubicación: mapa embebido, dirección y horario", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.locator("[id=ubicacion]")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("[id=ubicacion]").getByText(/Barrio Perla del Sur/i).first()).toBeVisible();
		await expect(page.locator('[id=ubicacion] iframe[title="Mapa de ubicación"]')).toHaveAttribute(
			"src",
			/google\.com\/maps\/embed/,
			{ timeout: 30000 }
		);
	});

	test("Contacto: formulario con campos y botón de envío", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.locator("[id=contacto]")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("[id=contacto]").getByRole("heading", { name: /Pide tu presupuesto/i }).first()).toBeVisible();
		await expect(page.locator('[id=contacto] input[name="nombre"]')).toBeVisible();
		await expect(page.locator('[id=contacto] input[name="telefono"]')).toBeVisible();
		await expect(page.locator('[id=contacto] textarea[name="mensaje"]')).toBeVisible();
		await expect(page.locator('[id=contacto] button[type="submit"]')).toHaveText(/Enviar Solicitud/);
	});

	test("Footer: marca y copyright real", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const footer = page.locator("footer").first();
		await expect(footer).toBeVisible({ timeout: 30000 });
		await expect(footer.getByText(/El Calvo/i).first()).toBeVisible();
		await expect(footer.getByText(/© 2024 Ebanistería El Calvo/i).first()).toBeVisible();
	});

	test("Widgets flotantes: WhatsApp y chatbot", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await expect(page.locator('a[aria-label="Contactar por WhatsApp"]')).toBeVisible({ timeout: 30000 });
		await expect(page.locator('button[aria-label="Abrir chat"]')).toBeVisible();
	});

	test("Chatbot: abre, saluda y responde con keywords", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.locator("text=Solo esenciales").click({ timeout: 5000 }).catch(() => {});
		await page.locator('button[aria-label="Abrir chat"]').click({ timeout: 30000 });
		await expect(page.locator("text=asistente virtual").first()).toBeVisible({ timeout: 15000 });

		// Responder un quick-answer
		const horarios = page.locator("button", { hasText: "Horarios" }).first();
		await expect(horarios).toBeVisible();
		await page.locator("input[placeholder='Escribe un mensaje...']").fill("¿Qué horarios tienen?");
		await page.locator('button[aria-label="Enviar mensaje"]').click();
		await expect(page.locator("form >>> div").filter({ hasText: /horario|atendemos|Lunes/i }).first().or(page.locator("text=/horario|atendemos|Lunes/i").first())).toBeVisible({ timeout: 30000 });
	});
});