// src/utility/pdf-reporter.ts
import { FullResult, Reporter } from '@playwright/test/reporter';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';

interface PdfReporterOptions {
  outputFile?: string;
}

export default class PdfReporterPlaywright implements Reporter {
  private outputFile: string;

  constructor(options: PdfReporterOptions = {}) {
    this.outputFile = options.outputFile || 'playwright-report/report.pdf';
  }

  async onEnd(result: FullResult) {
    console.log(' Generating Playwright PDF report...');

    const reportPath = path.resolve('playwright-report/index.html');
    if (!fs.existsSync(reportPath)) {
      console.error(
        'HTML report not found. Run tests with HTML reporter enabled.',
      );
      return;
    }

    const reportDir = path.dirname(reportPath);
    const server = http.createServer((req, res) => {
      const filePath = path.join(
        reportDir,
        req.url === '/' ? 'index.html' : req.url!,
      );
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      fs.createReadStream(filePath).pipe(res);
    });

    await new Promise<void>((resolve) => server.listen(9323, resolve));

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Expand all collapsible test steps and show screenshots
    await page.goto('http://localhost:9323', { waitUntil: 'networkidle' });

    // Expand all details sections
    await page.evaluate(() => {
      document
        .querySelectorAll('.test-details')
        .forEach((el) => ((el as HTMLElement).style.display = 'block'));
      document.querySelectorAll('.screenshot').forEach((img) => {
        (img as HTMLImageElement).style.maxWidth = '500px';
      });
    });

    // Generate PDF
    await page.pdf({
      path: this.outputFile,
      format: 'A4',
      printBackground: true,
      scale: 0.8,
    });

    await browser.close();
    server.close();

    console.log(`PDF report generated at ${this.outputFile}`);
  }
}
