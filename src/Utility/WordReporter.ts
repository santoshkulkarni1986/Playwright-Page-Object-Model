/**
 * Author: Santosh Kulkarni
 * Word Reporter for Playwright with full step details
 */
import {
  Reporter,
  TestCase,
  TestResult,
  TestStep,
  FullConfig,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
} from 'docx';
import logger from './logger';

interface WordReporterOptions {
  outputDir?: string;
}

interface TestResultData {
  title: string;
  status: string;
  duration: number;
  steps: TestStep[];
}

class WordReporter implements Reporter {
  private outputDir: string;
  private baseURL: string = '';
  private allResults: TestResultData[] = [];

  constructor(options: WordReporterOptions = {}) {
    this.outputDir = options.outputDir || 'word-report';
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // Capture baseURL from Playwright config
  onBegin(config: FullConfig) {
    this.baseURL = config.projects[0].use?.baseURL || '';
  }

  // Collect results for each test
  async onTestEnd(test: TestCase, result: TestResult) {
    this.allResults.push({
      title: test.title,
      status: result.status,
      duration: result.duration || 0,
      steps: result.steps,
    });
  }

  // Build Word report only once after all tests
  async onEnd() {
    const children: any[] = [];

    // Report Header
    children.push(
      new Paragraph({
        text: 'Playwright Custom Report',
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        text: `Base URL: ${this.baseURL}`,
        spacing: { after: 400 },
      }),
    );

    // Each test section
    this.allResults.forEach((test) => {
      // Step rows
      const stepRows = test.steps.map(
        (step: TestStep) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(step.title)] }),
              new TableCell({
                children: [new Paragraph(step.error ? 'Failed' : 'Passed')],
              }),
              new TableCell({
                children: [new Paragraph(String(step.duration || 0))],
              }),
            ],
          }),
      );

      // Total row
      const totalRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Total Test Duration')] }),
          new TableCell({ children: [new Paragraph('')] }),
          new TableCell({
            children: [new Paragraph(String(test.duration))],
          }),
        ],
      });

      const table = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('Step')] }),
              new TableCell({ children: [new Paragraph('Status')] }),
              new TableCell({ children: [new Paragraph('Time Taken (ms)')] }),
            ],
          }),
          ...stepRows,
          totalRow,
        ],
      });

      children.push(
        new Paragraph({
          text: `Test Case: ${test.title}`,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: `Overall Status: ${test.status}`,
          spacing: { after: 200 },
        }),
        table,
        new Paragraph({ text: '', spacing: { after: 300 } }),
      );
    });

    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(this.outputDir, `Playwright_Test_Report.docx`);
    fs.writeFileSync(filePath, buffer);

    logger.info(`Word report generated at: ${filePath}`);
  }
}

export default WordReporter;
