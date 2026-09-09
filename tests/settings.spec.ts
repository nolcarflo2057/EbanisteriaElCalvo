import { test, expect } from "@playwright/test";

test.describe("Dashboard — Settings (todos los tabs cargan)", () => {
	test("Sidebar de settings con los 8 tabs", async ({ page }) => {
		await page.goto("/dashboard/settings/general", { waitUntil: "domcontentloaded" });
		await expect(page.locator("text=Configuración General").first()).toBeVisible({ timeout: 30000 });
		for (const label of ["General", "Personalización", "SEO", "Menús", "Dominios", "Legales", "Analytics", "Marca Blanca"]) {
			await expect(page.locator(`a[href*="/dashboard/settings/"]`).filter({ hasText: label }).first()).toBeVisible();
		}
	});

	test("General: form con nombre, moneda, impuestos y Guardar", async ({ page }) => {
		await page.goto("/dashboard/settings/general", { waitUntil: "domcontentloaded" });
		await expect(page.locator("input#name")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("input#taxRate")).toBeVisible();
		await expect(page.locator("button[type=submit]")).toContainText("Guardar Configuración");
		// La moneda de El Calvo es COP
		await expect(page.locator("select#currency, [id=currency]")).toContainText("COP");
	});

	test("Personalización (Appearance): campos de color y Guardar", async ({ page }) => {
		await page.goto("/dashboard/settings/appearance", { waitUntil: "domcontentloaded" });
		await expect(page.locator("text=Personalización").first()).toBeVisible({ timeout: 30000 });
		await expect(page.locator("button[type=submit]").first()).toBeVisible();
	});

	test("SEO: form con título y Guardar SEO", async ({ page }) => {
		await page.goto("/dashboard/settings/seo", { waitUntil: "domcontentloaded" });
		await expect(page.locator("input#seo-title")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("button[type=submit]")).toContainText("Guardar SEO");
	});

	test("Dominios: form de dominio personalizado", async ({ page }) => {
		await page.goto("/dashboard/settings/domain", { waitUntil: "domcontentloaded" });
		await expect(page.locator("text=Dominio Personalizado").first()).toBeVisible({ timeout: 30000 });
		await expect(page.locator("input#custom-domain").first()).toBeVisible();
	});

	test("Legales: textareas de Privacidad/Términos con preview", async ({ page }) => {
		await page.goto("/dashboard/settings/legales", { waitUntil: "domcontentloaded" });
		await expect(page.locator("textarea#privacyMarkdown")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("textarea#termsMarkdown")).toBeVisible();
		await expect(page.locator("button[type=submit]")).toContainText("Guardar Legales");
	});

	test("Analytics (Integraciones): switches GA4/Pixel/GTM y Guardar", async ({ page }) => {
		await page.goto("/dashboard/settings/integrations", { waitUntil: "domcontentloaded" });
		await expect(page.locator("text=Integraciones de Analytics").first()).toBeVisible({ timeout: 30000 });
		await expect(page.locator("text=Google Analytics 4").first()).toBeVisible();
		await expect(page.locator("text=Meta Pixel").first()).toBeVisible();
		await expect(page.locator("text=Google Tag Manager").first()).toBeVisible();
	});

	test("Marca Blanca: form de negocio + WhatsApp/Chatbot", async ({ page }) => {
		await page.goto("/dashboard/settings/white-label", { waitUntil: "domcontentloaded" });
		await expect(page.locator("input#businessName")).toBeVisible({ timeout: 30000 });
		await expect(page.locator("text=Configuración de Marca Blanca").first()).toBeVisible();
	});
});

test.describe("Admin — Notificaciones", () => {
	test("Página de notificaciones del admin", async ({ page }) => {
		await page.goto("/admin/notifications", { waitUntil: "domcontentloaded" });
		await expect(page.locator("h1")).toHaveText("Notificaciones", { timeout: 30000 });
		await expect(page.locator("a", { hasText: "Volver al Panel" }).first()).toBeVisible();
	});
});