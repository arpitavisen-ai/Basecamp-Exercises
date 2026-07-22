/**
 * AC-04: Artefacts Tab — CRUD, rich content, modal behaviour, data integrity
 */
import { test, expect } from '@playwright/test';
import { loadApp, goToTab } from './helpers';

test.describe('AC-04 · Artefacts Tab', () => {
  test.beforeEach(async ({ page }) => {
    await loadApp(page);
    await goToTab(page, 'Artefacts');
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  test('Artefact Details heading is visible', async ({ page }) => {
    await expect(page.locator('text=Artefact Details').first()).toBeVisible();
  });

  test('all 10 seeded artefacts are present on page', async ({ page }) => {
    const artefacts = [
      'Market & Competitor Analysis',
      'VMOST',
      'OKRs',
      'Product Roadmap',
      'Target Users',
      'Jobs-to-be-Done',
      'MVP PRD',
      'Discovery Research Plan',
      'Discovery Findings',
      'Business Strategy',
    ];
    for (const name of artefacts) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 8_000 });
    }
  });

  test('hero card (first artefact) renders with "View details" link', async ({ page }) => {
    const viewDetails = page.locator('text=View details').first().or(page.locator('text=Read more').first());
    await expect(viewDetails).toBeVisible();
  });

  test('"Add Activity" button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Add Activity")').first()).toBeVisible();
  });

  test('"Save All Changes" button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Save All Changes")').first()).toBeVisible();
  });

  // ── Modal Open / Close ───────────────────────────────────────────────────────

  test('clicking an artefact card opens detail modal', async ({ page }) => {
    await page.locator('text=Market & Competitor Analysis').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('modal shows title, summary section, and detailed notes editor', async ({ page }) => {
    await page.locator('text=Market & Competitor Analysis').first().click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog.locator('text=Summary')).toBeVisible();
    await expect(dialog.locator('text=Detailed Notes')).toBeVisible();
  });

  test('rich text editor toolbar is visible in modal', async ({ page }) => {
    await page.locator('text=Market & Competitor Analysis').first().click();
    const dialog = page.locator('[role="dialog"]');
    // Toolbar buttons (Bold, Italic, Underline)
    await expect(dialog.locator('button[title="Bold"], button[title="bold"]').first()).toBeVisible();
  });

  test('seeded richContent is loaded into the editor (not empty)', async ({ page }) => {
    await page.locator('text=Market & Competitor Analysis').first().click();
    const dialog = page.locator('[role="dialog"]');
    const editor = dialog.locator('[contenteditable="true"]');
    await expect(editor).toBeVisible();
    const html = await editor.innerHTML();
    // Should not be empty — seed data has tables and text
    expect(html.trim().length).toBeGreaterThan(10);
  });

  test('"Save & Close" button closes the modal', async ({ page }) => {
    await page.locator('text=Market & Competitor Analysis').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.locator('button:has-text("Save & Close")').click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('X button in modal header closes the modal', async ({ page }) => {
    await page.locator('text=Market & Competitor Analysis').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    // Find close X inside dialog
    await page.locator('[role="dialog"] button').filter({ has: page.locator('svg') }).first().click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  // ── Add Artefact ─────────────────────────────────────────────────────────────

  test('Add Activity modal opens and shows required fields', async ({ page }) => {
    await page.locator('button:has-text("Add Activity")').click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input[placeholder*="Competitive"]')).toBeVisible();
    await expect(dialog.locator('textarea')).toBeVisible();
  });

  test('Add Activity submit is disabled with empty title', async ({ page }) => {
    await page.locator('button:has-text("Add Activity")').click();
    const submitBtn = page.locator('button:has-text("Add Artefact")');
    await expect(submitBtn).toBeDisabled();
  });

  test('adding a new artefact appears in the grid', async ({ page }) => {
    await page.locator('button:has-text("Add Activity")').click();
    const dialog = page.locator('[role="dialog"]');
    await dialog.locator('input').first().fill('Test Artefact QA');
    await dialog.locator('textarea').first().fill('QA test description');
    await page.locator('button:has-text("Add Artefact")').click();
    // Dialog should close
    await expect(dialog).not.toBeVisible();
    // New item should appear in grid
    await expect(page.locator('text=Test Artefact QA').first()).toBeVisible();
  });

  // ── Data Integrity ───────────────────────────────────────────────────────────

  test('artefact count matches seeded data (≥10 items)', async ({ page }) => {
    // Count cards — hero (1) + grid (3) + list (6+) = 10
    await page.waitForTimeout(1000);
    const titles = await page.locator('[class*="Card"] h3, article h3, .group h3').count();
    expect(titles).toBeGreaterThanOrEqual(10);
  });

  test('thumbnail images load without broken src', async ({ page }) => {
    const imgs = await page.locator('img').all();
    let loaded = 0;
    for (const img of imgs.slice(0, 5)) {
      const w = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (w > 0) loaded++;
    }
    expect(loaded).toBeGreaterThan(0);
  });

  test('rich text editor accepts typed input', async ({ page }) => {
    await page.locator('text=Market & Competitor Analysis').first().click();
    const editor = page.locator('[role="dialog"] [contenteditable="true"]');
    await editor.click();
    await editor.type(' QA-CHECK');
    const html = await editor.innerHTML();
    expect(html).toContain('QA-CHECK');
  });
});
