import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://refine-problem-statement.vercel.app';

export default defineConfig({
  testDir: './tests/acceptance',
  timeout: 30_000,
  retries: 1,
  reporter: [['html', { outputFolder: 'tests/report', open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
