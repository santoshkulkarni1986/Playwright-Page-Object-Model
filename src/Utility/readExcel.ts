import * as xlsx from 'xlsx';
import path from 'path';

/**
 * Gets first user from excel
 * @param filePath 
 * @returns  only first row
 */
export function getFirstUserFromExcel(filePath: string) {
    const workbook = xlsx.readFile(path.resolve(filePath));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    return (data as any[])[0]; 
}
