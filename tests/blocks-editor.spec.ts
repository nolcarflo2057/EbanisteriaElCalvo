import { test, expect } from "@playwright/test";

test("Dashboard Bloques — chevrons ↑/↓, drag & drop y topbar", async ({ page }) => {
	// Sesión compartida de global-setup
	await page.goto("/dashboard/blocks");

	await expect(page.locator("h1")).toContainText("Editor de Bloques", { timeout: 15000 });
	await expect(page.locator("text=Agregar bloque")).toBeVisible({ timeout: 15000 });
	await expect(page.locator("text=Bloques de la página")).toBeVisible();

	// Chevrons presentes (sin PlusIcon)
	const up = page.locator('button[title="Subir"] svg');
	const down = page.locator('button[title="Bajar"] svg');
	const firstUp = up.first();
	await expect(firstUp).toBeVisible();
	expect(await firstUp.getAttribute("class")).toContain("lucide-chevron-up");
	expect(await down.first().getAttribute("class")).toContain("lucide-chevron-down");

	// Items draggable
	const items = page.locator("div[draggable=true]");
	await expect(items.first()).toBeVisible();

	// Topbar: logout solo en mobile; Volver a Tienda solo en mobile (topbar)
	await expect(page.locator('header a:has-text("Volver a Tienda")')).toBeHidden();
	await expect(page.locator('header button[title="Cerrar Sesión"]')).toBeHidden();
	// Desktop: Volver a Tienda está en el sidebar
	await expect(page.locator('aside a:has-text("Volver a Tienda")')).toBeVisible();
	await page.setViewportSize({ width: 375, height: 812 });
	await expect(page.locator('header a:has-text("Volver a Tienda")')).toBeVisible();
	await expect(page.locator('header button[title="Cerrar Sesión"]')).toBeVisible();
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.locator('aside a:has-text("Volver a Tienda")').click();
	await page.waitForURL("http://localhost:3000/", { timeout: 15000 });
});
