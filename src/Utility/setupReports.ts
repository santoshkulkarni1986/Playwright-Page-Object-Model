import fs from 'fs';
import path from 'path';

const folders = [
  'FinalReports/reports/pdf',
  'FinalReports/reports/word',
  'FinalReports/monocart-report',
];

folders.forEach((folder) => {
  const folderPath = path.resolve(folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  }
});
