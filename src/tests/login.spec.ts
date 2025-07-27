/**
 * Author: Santosh Kulkarni
 */
import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WelcomePage } from '../pages/WelcomePage';
import logger from '../Utility/logger';
import { getLoginData } from '../Utility/csvReader';
import * as loginData from '../data/loginData.json';
import { getUserByIndex } from '../Utility/readExcel';

test.describe('Login Test Scenarios Using POM', () => {
  test.beforeAll(async () => {
    logger.info('Starting Login Test Sceanrios Using Page Object Model');
  });
  let loginPage: LoginPage;
  let userName = process.env.USERNAME!;
  let passWord = process.env.PASSWORD!;
  let invalidUserName = process.env.INVALID_USERNAME!;
  let invalidPassword = process.env.INVALID_PASSWORD!;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('Login successfully with valid credentials from Environment Vairables', async ({
    page,
  }) => {
    const welcomePage = new WelcomePage(page);
    await loginPage.enterUserName(userName);
    await loginPage.enterPassword(passWord);
    await loginPage.clickLoginButton();
    await welcomePage.verifyWelcomeMessage();
    logger.info(
      'Positive login test with valid username and password passed From Environment Variables.',
    );
  });

  test('Login succeeds with valid credentials from CSV', async ({ page }) => {
    const users = getLoginData('./src/data/loginData.csv');
    // First row (valid)
    const user = users[0];
    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);
    await loginPage.enterUserName(user.usernameFromCSV);
    await loginPage.enterPassword(user.passwordFromCSV);
    await loginPage.clickLoginButton();
    await welcomePage.verifyWelcomeMessage();
    logger.info(`Valid login passed for user: ${user.usernameFromCSV}`);
    logger.info(
      'Positive login test with valid username and password passed from CSV.',
    );
  });

  test('Login successfully with valid credentials from JSON', async ({
    page,
  }) => {
    const welcomePage = new WelcomePage(page);
    await loginPage.enterUserName(loginData.valid.usernameFromJSON);
    await loginPage.enterPassword(loginData.valid.passwordFromJSON);
    await loginPage.clickLoginButton();
    await welcomePage.verifyWelcomeMessage();
    logger.info(
      'Positive login test with valid username and password passed from JSON.',
    );
  });

  test('Login succeeds with valid credentials from Excel', async ({ page }) => {
    const welcomePage = new WelcomePage(page);
    const user = getUserByIndex('./src/data/users.xlsx', 0); // 0 = first row
    if (!user) throw new Error('User not found at index 0');
    await loginPage.enterUserName(user.userNameFromExcel);
    await loginPage.enterPassword(user.passWordFromExcel);
    await loginPage.clickLoginButton();
    await welcomePage.verifyWelcomeMessage();
    logger.info(
      'Positive login test with valid credentials passed from Excel.',
    );
  });

  test('Login fails with invalid username from Environment Vairables', async () => {
    await loginPage.enterUserName(invalidUserName);
    await loginPage.enterPassword(passWord);
    await loginPage.clickLoginButton();
    await loginPage.verifyUserNameErrorMessage();
    logger.info(
      'Negative login test with invalid username passed from Environment Variables.',
    );
  });

  test('Login fails with invalid password from Environment Vairables', async () => {
    await loginPage.enterUserName(userName);
    await loginPage.enterPassword(invalidPassword);
    await loginPage.clickLoginButton();
    await loginPage.verifyPasswordErrorMessage();
    logger.info(
      'Negative login test with invalid password passed from Environment Variables.',
    );
  });

  test('Login fails with invalid username from CSV', async () => {
    const users = getLoginData('./src/data/loginData.csv');
    // Second row (invalid)
    const user = users[1];
    await loginPage.enterUserName(user.usernameFromCSV);
    await loginPage.enterPassword(user.passwordFromCSV);
    await loginPage.clickLoginButton();
    await loginPage.verifyUserNameErrorMessage();
    logger.info('Negative login test with invalid username passed from CSV.');
  });

  test('Login fails with invalid password from CSV', async () => {
    const users = getLoginData('./src/data/loginData.csv');
    // Third row (invalid)
    const user = users[2];
    await loginPage.enterUserName(user.usernameFromCSV);
    await loginPage.enterPassword(user.passwordFromCSV);
    await loginPage.clickLoginButton();
    await loginPage.verifyPasswordErrorMessage();
    logger.info('Negative login test with invalid password passed from CSV.');
  });

  test('Login fails with invalid username from JSON', async () => {
    await loginPage.enterUserName(loginData.invalidUserName.usernameFromJSON);
    await loginPage.enterPassword(loginData.invalidUserName.passwordFromJSON);
    await loginPage.clickLoginButton();
    await loginPage.verifyUserNameErrorMessage();
    logger.info('Negative login test with invalid username passed from JSON.');
  });

  test('Login fails with invalid password from JSON', async () => {
    await loginPage.enterUserName(loginData.valid.usernameFromJSON);
    await loginPage.enterPassword(loginData.invalidPassword.passwordFromJSON);
    await loginPage.clickLoginButton();
    await loginPage.verifyPasswordErrorMessage();
    logger.info('Negative login test with invalid password passed from JSON.');
  });

  test('Login fails with invalid username FromExcel', async () => {
    const user = getUserByIndex('./src/data/users.xlsx', 2); // 0 = first row
    if (!user) throw new Error('User not found at index 0');
    await loginPage.enterUserName(user.userNameFromExcel);
    await loginPage.enterPassword(user.passWordFromExcel);
    await loginPage.clickLoginButton();
    await loginPage.verifyUserNameErrorMessage();
    logger.info('Negative login test with invalid username passed using Excel.');
  });

  test('Login fails with invalid password FromExcel', async () => {
    const user = getUserByIndex('./src/data/users.xlsx', 1); // 0 = first row
    if (!user) throw new Error('User not found at index 0');
    await loginPage.enterUserName(user.userNameFromExcel);
    await loginPage.enterPassword(user.passWordFromExcel);
    await loginPage.clickLoginButton();
    await loginPage.verifyPasswordErrorMessage();
    logger.info('Negative login test with invalid password passed using Excel.');
  });

  test('Login fails with invalid username and invalid password from Environment Variables', async () => {
    await loginPage.enterUserName(invalidUserName);
    await loginPage.enterPassword(invalidPassword);
    await loginPage.clickLoginButton();
    await loginPage.verifyBlankErrorMessage();
    logger.info(
      'Negative login test with invalid username and invalid password passed using Environment Variables.',
    );
  });

  test('Login fails with invalid username and invalid password from Excel', async () => {
    const user = getUserByIndex('./src/data/users.xlsx', 2); // 0 = first row
    if (!user) throw new Error('User not found at index 0');
    await loginPage.enterUserName(user.userNameFromExcel);
    await loginPage.enterPassword(user.passWordFromExcel);
    await loginPage.clickLoginButton();
    await loginPage.verifyBlankErrorMessage();
    logger.info(
      'Negative login test with invalid username and invalid password from Excel passed.',
    );
  });

  test('Login fails with invalid username and invalid password from CSV', async () => {
    const users = getLoginData('./src/data/loginData.csv');
    // Third row (invalid)
    const user = users[3];
    await loginPage.enterUserName(user.usernameFromCSV);
    await loginPage.enterPassword(user.passwordFromCSV);
    await loginPage.clickLoginButton();
    await loginPage.verifyBlankErrorMessage();
    logger.info(
      'Negative login test with invalid username and invalid password from CSV passed.',
    );
  });

  test('Login fails with invalid username and invalid password from JSON', async () => {
    await loginPage.enterUserName(loginData.invalidDetails.usernameFromJSON);
    await loginPage.enterPassword(loginData.invalidDetails.passwordFromJSON);
    await loginPage.clickLoginButton();
    await loginPage.verifyBlankErrorMessage();
    logger.info(
      'Negative login test with invalid username and invalid password from JSON passed.',
    );
  });

  test('Login fails with blank username and password', async () => {
    await loginPage.enterUserName('');
    await loginPage.enterPassword('');
    await loginPage.clickLoginButton();
    await loginPage.verifyBlankErrorMessage();
    logger.info('Negative login test with blank credentials passed.');
  });
});
