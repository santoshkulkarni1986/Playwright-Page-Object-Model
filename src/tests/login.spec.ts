/**
 * Author: Santosh Kulkarni
 */

import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WelcomePage } from '../pages/WelcomePage';
import logger from '../Utility/logger';
import {getFirstUserFromCSV} from '../Utility/csvReader';
import {getFirstUserFromExcel } from '../Utility/readExcel';


test.describe('PracticeTestAutomation Login Tests using POM', () => {
  let loginPage: LoginPage;
  let userName=process.env.USERNAME!;
  let passWord=process.env.PASSWORD!;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('Login successfully with valid credentials', async ({ page }) => {
    console.log(userName);
    await loginPage.enterUserName(userName);
    await loginPage.enterPassword(passWord);
    await loginPage.clickLoginButton();

    const welcomePage = new WelcomePage(page);
    await welcomePage.verifyWelcomeMessage();
    logger.info('Positive login test with valid username and password passed.');
  });

  test('Login fails with invalid username from CSV', async ( ) => {
    const user = getFirstUserFromCSV('./src/data/loginData.csv');
    await loginPage.enterUserName(user.usernameFromCSV);
    await loginPage.enterPassword(user.passwordFromCSV);
    await loginPage.clickLoginButton();
    await loginPage.verifyUserNameErrorMessage();
    logger.info('Negative login test with invalid username passed.');
  });

  test('Login fails with invalid password FromExcel', async () => {
    const user = getFirstUserFromExcel('./src/data/users.xlsx');
    await loginPage.enterUserName(user.userNameFromExcel);
    await loginPage.enterPassword(user.passWordFromExcel);
    await loginPage.clickLoginButton();
    await loginPage.verifyPasswordErrorMessage();
    logger.info('✅ Negative login test with invalid password passed.');
  });

  test('Login fails with blank username and password', async () => {
    await loginPage.enterUserName('');
    await loginPage.enterPassword('');
    await loginPage.clickLoginButton();
    await loginPage.verifyBlankErrorMessage();
    logger.info('Negative login test with blank credentials passed.');
  });
});
