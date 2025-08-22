import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// ✅ Ensure report folders exist before tests run
const reportFolders = [
  'FinalReports/reports/pdf',
  'FinalReports/reports/word',
  'FinalReports/monocart-report',
];

reportFolders.forEach(folder => {
  const folderPath = path.resolve(folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  }
});

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

    // Compiled JS reporters (dist folder)
    ['./dist/Utility/WordReporter.js', { outputDir: 'FinalReports/reports/word' }],
    ['./dist/Utility/PdfReporter.js', { outputFile: 'FinalReports/reports/pdf/playwright-Custom-report.pdf' }],
    ['./dist/Utility/pdf-reporter.js', { outputFile: 'FinalReports/reports/pdf/playwright-HTML-Convert-report.pdf' }],

    ['monocart-reporter', {  
      name: "Playwright Custom Report",
      outputFile: './FinalReports/monocart-report/index.html'
    }],

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
