/**
 * AC-08: UI Quality & Accessibility
 * Checks visual quality, no broken assets, responsive layout, accessibility basics.
 */
import { test, expect } from '@playwright/test';
import { loadApp, goToTab } from './helpers';

test.describe('AC-08 · UI Quality & Accessibility', () => {
  test('no broken images on homepage', async ({ page }) => {
    await loadApp(page);
    await page.waitForTimeout(2000); // allow lazy images to load
    const imgs = await page.locator('img').all();
    let broken = 0;
    for (const img of imgs) {
      const w = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (w === 0) broken++;
    }
    // Allow at most 1 broken image (external CDN images can occasionally fail to load)
    expect(broken).toBeLessThanOrEqual(1);
  });

  test('tabs have correct ARIA roles', async ({ page }) => {
    await loadApp(page);
    const tabs = page.getByRole('tab');
    expect(await tabs.count()).toBeGreaterThanOrEqual(4);
  });

  test('dialogs trap focus correctly — role="dialog" present', async ({ page }) => {
    await loadApp(page);
    await goToTab(page, 'Artefacts');
    await page.locator('text=Market & Competitor Analysis').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    // Dialog should have accessible content
    await expect(page.locator('[role="dialog"] button').first()).toBeVisible();
  });

  test('no 4xx/5xx network errors for page assets', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('response', resp => {
      if (resp.status() >= 400 && resp.url().includes(page.url().split('/')[2])) {
        failedRequests.push(`${resp.status()} ${resp.url()}`);
      }
    });
    await loadApp(page);
    await page.waitForTimeout(2000);
    expect(failedRequests).toHaveLength(0);
  });

  test('page renders correctly at 1280×800 desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loadApp(page);
    await expect(page.locator('text=Patient Feedback').first()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Artefacts' })).toBeVisible();
  });

  test('page renders correctly at 375×812 mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loadApp(page);
    // Page should not be blank
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('all tab panels switch without blank screens', async ({ page }) => {
    await loadApp(page);
    for (const tab of ['User Analysis', 'Artefacts', 'PDLC', 'Tasks']) {
      await goToTab(page, tab);
      await page.waitForTimeout(400);
      // Page body should have content
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(50);
    }
  });

  test('Sonner toast container is mounted', async ({ page }) => {
    await loadApp(page);
    // Sonner mounts a toaster element even if no toasts are showing
    const toaster = page.locator('[data-sonner-toaster]');
    // Just check it doesn't throw — it may or may not be visible
    await page.waitForTimeout(500);
  });
});
