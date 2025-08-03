import { test as base, expect } from '@playwright/test';
import {
  readExecutableTests,
  writeResultsToExcel,
  TestData,
  TestResult,
} from '../Utility/excelUtility';
import { LoginPage } from '../pages/loginPage';
import { WelcomePage } from '../pages/WelcomePage';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../Utility/logger';

const inputFilePath = './src/data/testData.xlsx';
const outputFilePath = './src/results/test-output.xlsx';
const screenshotDir = './src/results/screenshots';

// Ensure results folder exists
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const testDataList: TestData[] = readExecutableTests(inputFilePath);
const results: TestResult[] = [];

base.describe.parallel('Excel-driven Login Tests', () => {
  for (const data of testDataList) {
    base(`${data.testCaseName}`, async ({ page }, testInfo) => {
      /// Get browser from config/testInfo
      const browserName = testInfo.project.name;
      logger.info(`Running test: ${data.testCaseName} on ${browserName}`);
      const action = `executing test case: ${data.testCaseName}`;
      logger.info(`Start ${action}`);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const result: TestResult = {
        ...data,
        status: 'Pending',
        browser: browserName,
        timestamp,
      };

      try {
        const loginPage = new LoginPage(page);
        const welcomePage = new WelcomePage(page);
        await page.goto(data.url);
        await loginPage.enterUserName(data.username);
        await loginPage.enterPassword(data.password);
        await loginPage.clickLoginButton();
        const isSuccess = await welcomePage.verifyWelcomeMessage();
        if (isSuccess) {
          result.status = 'Pass';
          result.screenshotPath = '';
          await welcomePage.clickLogoutButton();
        } else {
          throw new Error('Login verification failed');
        }
      } catch (error) {
        result.status = 'Fail';
        const screenshotName =
          `${data.testCaseName}_${timestamp}_${browserName}.png`.replace(
            /\s+/g,
            '_',
          );
        logger.info(error);
        const screenshotPath = path.join(screenshotDir, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        result.screenshotPath = screenshotPath;
      } finally {
        results.push(result);
        logger.info(`${data.testCaseName} | ${result.status}`);
        expect(result.status).toBe('Pass');
        logger.info(`End ${action}`);
      }
    });
  }

  base.afterAll(async () => {
    const dir = path.dirname(outputFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // Wait a bit to ensure all file handles are released
    await new Promise((res) => setTimeout(res, 1000));
    writeResultsToExcel(results, outputFilePath);
    logger.info(`Results written to: ${outputFilePath}`);
  });
});
