import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface LoginUser {
    usernameFromCSV: string;
    passwordFromCSV: string;
}

export function getLoginData(filePath: string): LoginUser[] {
    const file = fs.readFileSync(path.resolve(filePath));
    return parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    }) as LoginUser[];
}
