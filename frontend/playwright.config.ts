import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['line'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'https://localhost:4200',
    ignoreHTTPSErrors: true,
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
