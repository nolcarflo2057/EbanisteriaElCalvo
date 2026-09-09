import { test, expect } from '@playwright/test';

test('Dashboard - Bloques (Blocks) page elements', async ({ page }) => {
  // Sesión compartida de global-setup
  await page.goto('/dashboard/blocks');

  // Verificar título de la página
  await expect(page.locator('h1')).toContainText('Editor de Bloques', { timeout: 15000 });

  // Verificar que el componente BlockEditor se muestra
  await expect(page.locator('text=Construye la home de tu tienda')).toBeVisible({ timeout: 15000 });

  // Verificar que se muestra la sección de agregar bloques
  await expect(page.locator('text=Agregar bloque')).toBeVisible({ timeout: 15000 });

  // Verificar la sección de bloques de la página
  await expect(page.locator('text=Bloques de la página')).toBeVisible({ timeout: 15000 });
});