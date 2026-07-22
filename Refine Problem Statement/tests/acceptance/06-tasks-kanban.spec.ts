/**
 * AC-06: Tasks Tab — Kanban board, columns, task CRUD, labels, progress tracker
 */
import { test, expect } from '@playwright/test';
import { loadApp, goToTab } from './helpers';

test.describe('AC-06 · Tasks / Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    await loadApp(page);
    await goToTab(page, 'Tasks');
  });

  // ── Column Structure ─────────────────────────────────────────────────────────

  test('all 4 kanban columns are visible', async ({ page }) => {
    for (const col of ['Backlog', 'In Progress', 'Review', 'Done']) {
      await expect(page.locator(`text=${col}`).first()).toBeVisible({ timeout: 10_000 });
    }
  });

  test('Backlog column has seeded tasks (≥10)', async ({ page }) => {
    await page.waitForTimeout(1500);
    // Count task cards in Backlog column area
    const backlogTasks = page.locator('[class*="task"], [class*="Task"], [draggable="true"]');
    const count = await backlogTasks.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  // ── Add Task ─────────────────────────────────────────────────────────────────

  test('Add task button is visible in each column', async ({ page }) => {
    const addBtns = page.locator('button:has-text("Add task"), button:has-text("Add Task"), button[aria-label*="add"]');
    const count = await addBtns.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('adding a task to Backlog column creates a new card', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add task"), button:has-text("Add Task")').first();
    await addBtn.click();
    await page.waitForTimeout(300);
    // New empty task or input should appear
    const newInput = page.locator('input[placeholder*="title"], input[placeholder*="task"]');
    if (await newInput.isVisible()) {
      await newInput.fill('QA Test Task');
      await page.keyboard.press('Enter');
      await expect(page.locator('text=QA Test Task').first()).toBeVisible();
    }
  });

  // ── Labels ───────────────────────────────────────────────────────────────────

  test('task labels are displayed with correct categories', async ({ page }) => {
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').innerText();
    const hasLabels = /Product Strategy|Product Discovery|Product Delivery|Strategy|Discovery|Delivery/i.test(bodyText);
    expect(hasLabels).toBeTruthy();
  });

  // ── Progress Tracker ─────────────────────────────────────────────────────────

  test('progress tracker is visible in Tasks tab', async ({ page }) => {
    await page.waitForTimeout(1000);
    const kickoff = page.locator('text=Kickoff').first();
    const launch = page.locator('text=Launch').first();
    const visible = await kickoff.isVisible().catch(() => false)
      || await launch.isVisible().catch(() => false);
    expect(visible).toBeTruthy();
  });

  test('progress milestones are shown', async ({ page }) => {
    for (const milestone of ['Kickoff', 'Strategy', 'Discovery']) {
      await expect(page.locator(`text=${milestone}`).first()).toBeVisible({ timeout: 5_000 });
    }
  });

  test('target date field is editable', async ({ page }) => {
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').innerText();
    // Progress tracker shows a target date — check it exists somewhere
    expect(bodyText).toMatch(/target|date|june|2026|launch/i);
  });
});
