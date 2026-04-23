import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Timeout cho mỗi test case: 3 phút */
  timeout: 180000,
  /* Timeout cho mỗi action (click, fill...): 30s */
  use: {
    actionTimeout: 30000,
    navigationTimeout: 60000,
    trace: 'on-first-retry',
    viewport: { width: 1920, height: 1080 },
    headless: true,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html'], ['list']],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
