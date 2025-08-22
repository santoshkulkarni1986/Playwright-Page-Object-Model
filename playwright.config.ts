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
    ['./dist/utility/WordReporter.js', { outputDir: 'FinalReports/reports/word' }],
    ['monocart-reporter', {  
      name: "Playwright Custom Report",
      outputFile: './monocart-report/index.html'
    }],
    ['./dist/utility/PdfReporter.js', { outputFile: 'FinalReports/reports/pdf/playwright-Custom-report.pdf' }],
    ['./dist/utility/pdf-reporter.js', { outputFile: 'FinalReports/reports/pdf/playwright-HTML-Convert-report.pdf' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {
    baseURL: process.env.URL || 'https://default-url.com',
    trace: 'on',
    screenshot: 'on',
    video: 'on'
  },

  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }
    },
    {
      name: 'iPhone 13',
      use: { ...devices['iPhone 13'] }
    }
  ]
});
