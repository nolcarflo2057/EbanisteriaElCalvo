import { test, expect } from '@playwright/test';

test('Dashboard verificación completa (sesión compartida de global-setup)', async ({ page }) => {
  // La sesión de admin la crea global-setup.ts (que valida el login real una sola vez)
  await page.goto('/dashboard/leads');

  await page.waitForURL('**/dashboard/leads', { timeout: 30000 });
  await expect(page.locator('h1')).toContainText('Leads de Contacto', { timeout: 15000 });

  // 3. Verificar las tarjetas de métricas (Counters)
  await expect(page.locator('p', { hasText: 'Nuevos' }).first()).toBeVisible();
  await expect(page.locator('p', { hasText: 'Contactados' }).first()).toBeVisible();
  await expect(page.locator('p', { hasText: 'Convertidos' }).first()).toBeVisible();
  await expect(page.locator('p', { hasText: 'Total' }).first()).toBeVisible();

  // 4. Verificar encabezados de tabla solo si hay leads (la tabla solo se renderiza con datos)
  const emptyState = page.locator('text=Sin leads todavía');
  const hasEmpty = await emptyState.isVisible({ timeout: 3000 }).catch(() => false);

  if (hasEmpty) {
    await expect(emptyState).toBeVisible();
  } else {
    await expect(page.locator('th', { hasText: 'Cliente' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Mensaje' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Recibido' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Estado' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Acciones' })).toBeVisible();

    // Verificar que existe el dropdown de estado y al menos una fila
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('tbody tr').first()).toBeVisible();
    // Eliminar por fila se representa con icono (title="Eliminar lead")
    await expect(page.locator('button[title="Eliminar lead"]').first()).toBeVisible();
  }
});