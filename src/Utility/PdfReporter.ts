/**
 * Custom Playwright PDF Reporter
 * Author: Santosh Kulkarni
 */
import {
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

class PdfReporter implements Reporter {
  private testResults: {
    testCase: string;
    overallStatus: string;
    totalDuration: string;
    steps: { step: string; status: string; time: string }[];
  }[] = [];

  // Called after every test
  onTestEnd(test: TestCase, result: TestResult) {
    const steps =
      result.steps?.map((s) => ({
        step: s.title,
        status: s.error ? 'Failed' : 'Passed',
        time: s.duration.toString(),
      })) || [];

    this.testResults.push({
      testCase: test.title,
      overallStatus: result.status.toUpperCase(),
      totalDuration: `${result.duration} ms`,
      steps,
    });
  }

  // Called when all tests finish
  async onEnd(result: FullResult) {
    const outputDir = path.resolve('FinalReports/reports/pdf');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const pdfPath = path.join(outputDir, 'TestReport.pdf');

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Title
    doc.fontSize(18).text('Playwright Test Execution Report', {
      align: 'center',
    });
    doc.moveDown(1.5);

    this.testResults.forEach((result, index) => {
      doc
        .fontSize(14)
        .text(`Test Case: ${result.testCase}`, { underline: true });
      doc.fontSize(12).text(`Overall Status: ${result.overallStatus}`);
      doc.text(`Total Test Duration: ${result.totalDuration}`);
      doc.moveDown(0.5);

      // Table headers
      const tableTop = doc.y;
      const rowHeight = 25;
      const colWidths = [250, 100, 120];
      const startX = 50;

      const drawRow = (
        y: number,
        step: { step: string; status: string; time: string } | null,
        isHeader = false,
      ) => {
        let x = startX;
        const headers = ['Step', 'Status', 'Time (ms)'];
        const data = step ? [step.step, step.status, step.time] : headers;

        data.forEach((text, i) => {
          const width = colWidths[i];
          // Draw border
          doc.rect(x, y, width, rowHeight).stroke();

          doc.fontSize(10);
          if (isHeader) doc.font('Helvetica-Bold');
          else doc.font('Helvetica');

          doc.text(text, x + 5, y + 8, {
            width: width - 10,
            align: 'left',
          });
          x += width;
        });
      };

      // Header row
      drawRow(tableTop, null, true);

      // Steps rows
      result.steps.forEach((s, i) => {
        drawRow(tableTop + rowHeight * (i + 1), s);
      });

      doc.moveDown(2);

      if (index < this.testResults.length - 1) {
        doc.addPage();
      }
    });

    doc.end();
    
    console.log(`✅ PDF Report generated at: ${pdfPath}`);
  }
}

export default PdfReporter;
