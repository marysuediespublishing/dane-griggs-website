import { defineConfig, devices } from '@playwright/test';

// Ad landing pages: unit tests for src/lib/landing*.ts, and the built pages in a
// browser. The built site is served by request routing (tests/landing/harness.ts),
// so there is no web server: run `npm run build` first.
export default defineConfig({
  testDir: './tests/landing',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  projects: [
    { name: 'unit', testMatch: /\.unit\.spec\.ts$/ },
    { name: 'chromium', testMatch: /\.page\.spec\.ts$/, use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', testMatch: /\.page\.spec\.ts$/, use: { ...devices['Pixel 5'] } },
  ],
});
