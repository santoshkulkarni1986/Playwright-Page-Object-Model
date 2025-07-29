import * as xlsx from 'xlsx';
import path from 'path';

export interface ExcelUser {
  userNameFromExcel: string;
  passWordFromExcel: string;
}

/**
 * Reads all users from the Excel file.
 * @param filePath Absolute or relative path to the Excel file
 * @returns Array of user objects
 */
export function getAllUsersFromExcel(filePath: string): ExcelUser[] {
  const workbook = xlsx.readFile(path.resolve(filePath));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json<ExcelUser>(sheet, { defval: '' });
  return data;
}

/**
 * Returns a user by specific row index (0-based).
 * @param filePath Path to the Excel file
 * @param index Row index (starting from 0)
 */
export function getUserByIndex(
  filePath: string,
  index: number,
): ExcelUser | undefined {
  const users = getAllUsersFromExcel(filePath);
  return users[index];
}
