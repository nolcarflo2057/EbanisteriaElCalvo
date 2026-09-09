import { test, expect } from '@playwright/test';

test('Dashboard - Citas (Appointments) page elements', async ({ page }) => {
  // Navegar directamente a la página de citas (sesión compartida de global-setup)
  await page.goto('/dashboard/appointments');
  await page.waitForLoadState('load');

  // Verificar título de la página
  await expect(page.locator('h1')).toContainText('Citas Agendadas', { timeout: 15000 });

  // Verificar tarjetas de métricas
  await expect(page.locator('p', { hasText: 'Pendientes' }).first()).toBeVisible();
  await expect(page.locator('p', { hasText: 'Confirmadas' }).first()).toBeVisible();
  await expect(page.locator('p', { hasText: 'Canceladas' }).first()).toBeVisible();
  await expect(page.locator('p', { hasText: 'Total' }).first()).toBeVisible();

  // Verificar encabezados de tabla solo si hay citas (la tabla no se renderiza sin datos)
  const emptyState = page.locator('text=Sin citas todavía');
  const hasEmpty = await emptyState.isVisible({ timeout: 3000 }).catch(() => false);

  if (hasEmpty) {
    await expect(emptyState).toBeVisible();
  } else {
    await expect(page.locator('th', { hasText: 'Cliente' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Fecha' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Hora' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Estado' })).toBeVisible();
  }
});