import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 3 : 3,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report', title: 'Santosh Kulkarni POC' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['@estruyf/github-actions-reporter'],
    ['./src/utility/WordReporter.ts', { outputDir: 'FinalReports/reports/word' }],
    ['monocart-reporter', {  
            name: "Playwright Data Driven Tests Report",
            outputFile: './FinalReports/monocart-report/index.html'
    }],
    ['./src/utility/PdfReporter.ts', { outputFile: 'FinalReports/reports/pdf/playwright-Custom-report.pdf' }],
    ['./src/utility/pdf-reporter.ts', { outputFile: 'FinalReports/reports/pdf/playwright-HTML-Convert-report.pdf' }], // ✅ Use module path as string
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: process.env.URL || 'https://default-url.com',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },

  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'iPhone 13',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
