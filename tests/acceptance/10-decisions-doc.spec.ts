/**
 * AC-10: DECISIONS.md Integrity Check
 *
 * Static (no browser) checks that run on every release to verify DECISIONS.md
 * exists, is structurally complete, and has been updated alongside architectural
 * source changes. Fails CI if the doc drifts out of date.
 *
 * These tests use Node.js fs — no page/browser required.
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(__dirname, '../../');
const DECISIONS_PATH = path.join(ROOT, 'DECISIONS.md');

// Source paths whose changes should always be reflected in DECISIONS.md
const ARCHITECTURAL_PATHS = [
  'src/app/hooks/useFirebaseSync.ts',
  'src/app/firebase.ts',
  'src/app/data/seedData.ts',
  'src/app/App.tsx',
  'src/app/components/PDLCSection.tsx',
  '.github/workflows/ci.yml',
];

const REQUIRED_SECTIONS = [
  '## Architectural Decisions',
  '## Design Decisions',
  '## Coding Decisions / Best Practices',
];

const REQUIRED_ENTRIES = [
  'AD-01',
  'AD-02',
  'AD-03',
  'DD-01',
  'CD-01',
  'Last updated:',
];

// ─── File existence & structure ───────────────────────────────────────────────

test.describe('AC-10 · DECISIONS.md Integrity', () => {
  test('DECISIONS.md exists at project root', () => {
    expect(fs.existsSync(DECISIONS_PATH), 'DECISIONS.md not found at project root').toBe(true);
  });

  test('DECISIONS.md is not empty', () => {
    const size = fs.statSync(DECISIONS_PATH).size;
    expect(size, 'DECISIONS.md is empty').toBeGreaterThan(500);
  });

  test('DECISIONS.md contains all required sections', () => {
    const content = fs.readFileSync(DECISIONS_PATH, 'utf-8');
    for (const section of REQUIRED_SECTIONS) {
      expect(content, `Missing section: "${section}"`).toContain(section);
    }
  });

  test('DECISIONS.md contains required decision entries and last-updated date', () => {
    const content = fs.readFileSync(DECISIONS_PATH, 'utf-8');
    for (const entry of REQUIRED_ENTRIES) {
      expect(content, `Missing entry: "${entry}"`).toContain(entry);
    }
  });

  test('DECISIONS.md Last updated date is not stale (within 90 days)', () => {
    const content = fs.readFileSync(DECISIONS_PATH, 'utf-8');
    const match = content.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/);
    expect(match, '"Last updated: YYYY-MM-DD" line not found in DECISIONS.md').toBeTruthy();

    const lastUpdated = new Date(match![1]);
    const now = new Date();
    const daysDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

    expect(
      daysDiff,
      `DECISIONS.md "Last updated" is ${Math.floor(daysDiff)} days ago — update it if architectural changes were made recently`
    ).toBeLessThanOrEqual(90);
  });

  // ─── Git-diff check: architectural files changed without DECISIONS.md ────────

  test('DECISIONS.md was updated when architectural source files changed (git check)', () => {
    let changedFiles: string[] = [];
    try {
      // Compare HEAD to its parent — works in CI (on a PR branch) and locally
      const diff = execSync('git diff --name-only HEAD~1 HEAD', {
        cwd: ROOT,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
      changedFiles = diff.split('\n').filter(Boolean);
    } catch {
      // On a repo with a single commit (no HEAD~1) or a detached HEAD, skip gracefully
      console.warn('AC-10: Could not determine changed files via git diff — skipping drift check.');
      return;
    }

    const architecturalChanged = ARCHITECTURAL_PATHS.some(p =>
      changedFiles.some(f => f.endsWith(p.replace(/\\/g, '/')) || f === p)
    );
    const decisionsChanged = changedFiles.some(f => f === 'DECISIONS.md');

    if (architecturalChanged && !decisionsChanged) {
      const changed = changedFiles.filter(f =>
        ARCHITECTURAL_PATHS.some(p => f.endsWith(p.replace(/\\/g, '/')))
      );
      throw new Error(
        `Architectural files changed without updating DECISIONS.md:\n  ${changed.join('\n  ')}\n\n` +
        `Update DECISIONS.md to reflect any new or changed architectural, design, or coding decisions.`
      );
    }
  });

  // ─── Structural quality checks ────────────────────────────────────────────────

  test('each decision entry has Status, Decision, and Rationale fields', () => {
    const content = fs.readFileSync(DECISIONS_PATH, 'utf-8');

    // Extract individual decision blocks (### AD-xx, DD-xx, CD-xx)
    const blocks = content.split(/\n(?=###\s+(?:AD|DD|CD)-\d+)/);
    const decisionBlocks = blocks.filter(b => /###\s+(AD|DD|CD)-\d+/.test(b));

    expect(decisionBlocks.length, 'No decision entries found in DECISIONS.md').toBeGreaterThan(0);

    for (const block of decisionBlocks) {
      const id = block.match(/###\s+(\S+)/)?.[1] ?? 'unknown';
      expect(block, `${id} is missing a Status field`).toMatch(/\*\*Status:\*\*/);
      expect(block, `${id} is missing a Decision field`).toMatch(/\*\*Decision:\*\*/);
      expect(block, `${id} is missing a Rationale field`).toMatch(/\*\*Rationale:\*\*/);
    }
  });

  test('DECISIONS.md has at least 5 Architectural, 4 Design, and 5 Coding entries', () => {
    const content = fs.readFileSync(DECISIONS_PATH, 'utf-8');
    const adCount = (content.match(/###\s+AD-\d+/g) ?? []).length;
    const ddCount = (content.match(/###\s+DD-\d+/g) ?? []).length;
    const cdCount = (content.match(/###\s+CD-\d+/g) ?? []).length;

    expect(adCount, `Only ${adCount} AD entries — expected at least 5`).toBeGreaterThanOrEqual(5);
    expect(ddCount, `Only ${ddCount} DD entries — expected at least 4`).toBeGreaterThanOrEqual(4);
    expect(cdCount, `Only ${cdCount} CD entries — expected at least 5`).toBeGreaterThanOrEqual(5);
  });
});
