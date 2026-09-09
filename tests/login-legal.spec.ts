import { test, expect } from "@playwright/test";

test.describe("Páginas legales públicas", () => {
	test("Politica de Privacidad", async ({ page }) => {
		await page.goto("/privacy", { waitUntil: "domcontentloaded" });
		await expect(page.locator("h1")).toHaveText("Política de Privacidad", { timeout: 30000 });
		await expect(page.locator("a", { hasText: "Volver al inicio" }).first()).toBeVisible();
		await expect(page.locator("text=Cookies y analítica")).toBeVisible({ timeout: 30000 });
	});

	test("Terminos y Condiciones", async ({ page }) => {
		await page.goto("/terms", { waitUntil: "domcontentloaded" });
		await expect(page.locator("h1")).toHaveText("Términos y Condiciones", { timeout: 30000 });
		await expect(page.locator("a", { hasText: "Volver al inicio" }).first()).toBeVisible();
	});
});

test.describe("Login — flujo de autenticacion", () => {
	// Sin sesión previa (no usar storageState de admin de global-setup)
	test.use({ storageState: { cookies: [], origins: [] } });

	test("Login con credenciales invalidas muestra error", async ({ page }) => {
		await page.goto("/login", { waitUntil: "domcontentloaded" });
		await expect(page.locator("input#email")).toBeVisible({ timeout: 30000 });
		await page.locator("input#email").fill("nadie@nada.com");
		await page.locator("input#password").fill("password-invalida");
		await page.locator('button[type="submit"]').click();
		await expect(page.locator("text=/Credenciales incorrectas|Invalid email or password/i").first()).toBeVisible({ timeout: 30000 });
	});

	test("Dashboard sin sesion redirige al inicio", async ({ page }) => {
		await page.goto("/dashboard/leads", { waitUntil: "domcontentloaded" });
		await page.waitForURL("http://localhost:3000/", { timeout: 30000 });
	});
});