import fs from 'fs';
import path from 'path';
import { parse } from 'papaparse';
/**
 * 
 * @param filePath 
 * @returns first row
 */
export function getFirstUserFromCSV(filePath: string) {
    const file = fs.readFileSync(path.resolve(filePath), 'utf8');
    const parsed = parse(file, { header: true }).data as any[];
    return parsed[0]};
