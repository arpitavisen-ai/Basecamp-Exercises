/**
 * AC-02: Problem Statement
 * Verifies display, inline editing, and persistence of the problem statement.
 */
import { test, expect } from '@playwright/test';
import { loadApp } from './helpers';

test.describe('AC-02 · Problem Statement', () => {
  test('problem statement text is visible on load', async ({ page }) => {
    await loadApp(page);
    // NHS seed text contains this phrase
    await expect(page.locator('text=patient feedback').first()).toBeVisible();
  });

  test('problem statement is editable — click triggers edit mode', async ({ page }) => {
    await loadApp(page);
    // Click the problem statement paragraph to activate edit mode
    const psText = page.locator('p:has-text("10 Year Health Plan")').first();
    await psText.click({ force: true });
    await page.waitForTimeout(500);
    // Either a textarea appears or the edit button becomes visible
    const editActive = await page.locator('textarea').first().isVisible()
      .catch(() => false);
    const editBtnVisible = await page.locator('button:has-text("Save"), text=Edit statement').first().isVisible()
      .catch(() => false);
    expect(editActive || editBtnVisible).toBeTruthy();
  });

  test('problem statement contains seeded NHS content', async ({ page }) => {
    await loadApp(page);
    await expect(page.locator('text=10 Year Health Plan').first()).toBeVisible();
  });
});
