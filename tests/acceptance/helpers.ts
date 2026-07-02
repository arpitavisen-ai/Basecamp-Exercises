import { Page, expect } from '@playwright/test';

/** Navigate to the app and wait for Firebase to hydrate data (spinner gone + content visible). */
export async function loadApp(page: Page) {
  await page.goto('/');
  // Wait for the hero problem-statement section to appear (proves Firebase seeded & React rendered)
  await expect(page.locator('text=Patient Feedback').first()).toBeVisible({ timeout: 25_000 });
}

/** Click a tab by its visible label. */
export async function goToTab(page: Page, label: string) {
  await page.getByRole('tab', { name: label }).click();
  await page.waitForTimeout(300);
}

/** Open an artefact modal by clicking its card. */
export async function openArtefact(page: Page, titleSubstring: string) {
  await page.locator(`text=${titleSubstring}`).first().click();
  // Wait for dialog to be visible
  await expect(page.locator('[role="dialog"]')).toBeVisible();
}

/** Close the open dialog via Save & Close. */
export async function saveAndClose(page: Page) {
  await page.locator('button:has-text("Save & Close")').click();
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
}

/** Wait for a Sonner toast with given text. */
export async function expectToast(page: Page, text: string) {
  await expect(page.locator(`[data-sonner-toast] >> text=${text}`).first()).toBeVisible({ timeout: 5_000 });
}
