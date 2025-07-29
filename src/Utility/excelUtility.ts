import * as XLSX from 'xlsx';
import * as fs from 'fs';

export interface TestData {
  testCaseName: string;
  execute: string;
  env: string;
  url: string;
  username: string;
  password: string;
}
/**
 * Reads executable tests from the Excel file.
 * @param filePath Path to the Excel file
 * @returns Array of test data objects
 */

export function readExecutableTests(filePath: string): TestData[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData: TestData[] = XLSX.utils.sheet_to_json(sheet);

  return jsonData.filter((row) => row.execute?.toLowerCase() === 'yes');
}

/**
 * Represents the result of a test case.
 */

export interface TestResult extends TestData {
  status: string;
  browser: string;
  timestamp: string;
  screenshotPath?: string;
}
/**
 * Writes results to excel
 * @param results 
 * @param filePath 
 */
export function writeResultsToExcel(
  results: TestResult[],
  filePath: string,
): void {
  let workbook: XLSX.WorkBook;
  let worksheet: XLSX.WorkSheet;
  const sheetName = 'Results';

  // If file exists, read and append to it
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[sheetName] || XLSX.utils.aoa_to_sheet([]);
    const existingData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][];

    const newData = results.map((r) => [
      r.testCaseName,
      r.execute,
      r.env,
      r.url,
      r.username,
      r.password,
      r.status,
      r.browser,
      r.timestamp,
      r.screenshotPath || '',
    ]);

    const updatedData = existingData.concat(newData);
    const updatedSheet = XLSX.utils.aoa_to_sheet(updatedData);
    workbook.Sheets[sheetName] = updatedSheet;
  } else {
    // Create new workbook and worksheet
    const headers = [
      'Test Case Name',
      'Execute',
      'Env',
      'URL',
      'Username',
      'Password',
      'Status',
      'Browser',
      'Timestamp',
      'Screenshot Path',
    ];

    const data = [
      headers,
      ...results.map((r) => [
        r.testCaseName,
        r.execute,
        r.env,
        r.url,
        r.username,
        r.password,
        r.status,
        r.browser,
        r.timestamp,
        r.screenshotPath || '',
      ]),
    ];

    worksheet = XLSX.utils.aoa_to_sheet(data);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  XLSX.writeFile(workbook, filePath);
}