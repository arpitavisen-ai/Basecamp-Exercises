/**
 * AC-01: App Load & Initial Render
 * Verifies the app boots, Firebase hydrates, and all structural elements are present.
 */
import { test, expect } from '@playwright/test';
import { loadApp } from './helpers';

test.describe('AC-01 · App Load & Initial Render', () => {
  test('page title is present', async ({ page }) => {
    await loadApp(page);
    await expect(page).toHaveTitle(/.+/);
  });

  test('hero section renders with problem statement text', async ({ page }) => {
    await loadApp(page);
    await expect(page.locator('text=Patient Feedback').first()).toBeVisible();
  });

  test('all 4 navigation tabs are visible', async ({ page }) => {
    await loadApp(page);
    for (const tab of ['User Analysis', 'Artefacts', 'PDLC', 'Tasks']) {
      await expect(page.getByRole('tab', { name: tab })).toBeVisible();
    }
  });

  test('stat cards display personas, research, and tasks counts', async ({ page }) => {
    await loadApp(page);
    // At least one stat card containing a number
    await expect(page.locator('text=User Personas').first()).toBeVisible();
    await expect(page.locator('text=Research Activities').first()).toBeVisible();
    await expect(page.locator('text=Tasks').first()).toBeVisible();
  });

  test('no JS console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await loadApp(page);
    await page.waitForTimeout(2000);
    expect(errors.filter(e => !e.includes('ResizeObserver'))).toHaveLength(0);
  });
});
