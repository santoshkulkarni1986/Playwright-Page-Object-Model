/**
 * Author: Santosh Kulkarni
 */
import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WelcomePage } from '../pages/WelcomePage';
import logger from '../Utility/logger';
import { getLoginData } from '../Utility/csvReader';
import * as loginData from '../data/loginData.json';
import { getUserByIndex } from '../Utility/readExcel';
import { getEnv } from '../helper/env/env';

getEnv();

test.describe('Login Test Scenarios Using POM', () => {
  test.beforeAll(async () => {
    logger.info('Starting Login Test Scenarios Using Page Object Model');
  });

  let loginPage: LoginPage;
  let userName = process.env.USERNAME!;
  let passWord = process.env.PASSWORD!;
  let invalidUserName = process.env.INVALID_USERNAME!;
  let invalidPassword = process.env.INVALID_PASSWORD!;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage();
    });
  });

  test('Login successfully with valid credentials from Environment Variables', async ({
    page,
  }) => {
    const welcomePage = new WelcomePage(page);

    await test.step('Enter valid username', async () => {
      await loginPage.enterUserName(userName);
      await loginPage.verifyUserNameTextField(userName);
    });

    await test.step('Enter valid password', async () => {
      await loginPage.enterPassword(passWord);
      await loginPage.verifyPasswordTextField(passWord);
    });

    await test.step('Verify login button is enabled and click', async () => {
      await loginPage.verifyLoginButtonEnabled();
      await loginPage.clickLoginButton();
    });

    await test.step('Verify welcome message', async () => {
      await welcomePage.verifyWelcomeMessage();
    });

    await test.step('Logout from application', async () => {
      await welcomePage.clickLogoutButton();
    });

    logger.info('Positive login test passed with environment variables.');
  });

  test('Login succeeds with valid credentials from CSV', async ({ page }) => {
    const users = getLoginData('./src/data/loginData.csv');
    const user = users[0];
    const welcomePage = new WelcomePage(page);

    await test.step('Enter username from CSV', async () => {
      await loginPage.enterUserName(user.usernameFromCSV);
      await loginPage.verifyUserNameTextField(user.usernameFromCSV);
    });

    await test.step('Enter password from CSV', async () => {
      await loginPage.enterPassword(user.passwordFromCSV);
      await loginPage.verifyPasswordTextField(user.passwordFromCSV);
    });

    await test.step('Click login button and verify success', async () => {
      await loginPage.clickLoginButton();
      await welcomePage.verifyWelcomeMessage();
    });

    await test.step('Logout from application', async () => {
      await welcomePage.clickLogoutButton();
    });

    logger.info(`Valid login passed for user: ${user.usernameFromCSV} (CSV)`);
  });

  test('Login successfully with valid credentials from JSON', async ({
    page,
  }) => {
    const welcomePage = new WelcomePage(page);

    await test.step('Enter username from JSON', async () => {
      await loginPage.enterUserName(loginData.valid.usernameFromJSON);
      await loginPage.verifyUserNameTextField(loginData.valid.usernameFromJSON);
    });

    await test.step('Enter password from JSON', async () => {
      await loginPage.enterPassword(loginData.valid.passwordFromJSON);
      await loginPage.verifyPasswordTextField(loginData.valid.passwordFromJSON);
    });

    await test.step('Click login button and verify success', async () => {
      await loginPage.verifyLoginButtonEnabled();
      await loginPage.clickLoginButton();
      await welcomePage.verifyWelcomeMessage();
    });

    await test.step('Logout from application', async () => {
      await welcomePage.clickLogoutButton();
    });

    logger.info('Valid login test passed using JSON data.');
  });

  test('Login successfully with valid credentials from Excel', async ({
    page,
  }) => {
    const welcomePage = new WelcomePage(page);
    const user = getUserByIndex('./src/data/users.xlsx', 0);
    if (!user) throw new Error('User not found at index 0');

    await test.step('Enter username from Excel', async () => {
      await loginPage.enterUserName(user.userNameFromExcel);
      await loginPage.verifyUserNameTextField(user.userNameFromExcel);
    });

    await test.step('Enter password from Excel', async () => {
      await loginPage.enterPassword(user.passWordFromExcel);
      await loginPage.verifyPasswordTextField(user.passWordFromExcel);
    });

    await test.step('Click login button and verify success', async () => {
      await loginPage.verifyLoginButtonEnabled();
      await loginPage.clickLoginButton();
      await welcomePage.verifyWelcomeMessage();
    });

    await test.step('Logout from application', async () => {
      await welcomePage.clickLogoutButton();
    });

    logger.info('Valid login test passed using Excel data.');
  });

  test('Login fails with invalid username from Environment Variables', async () => {
    await test.step('Enter invalid username with valid password', async () => {
      await loginPage.enterUserName(invalidUserName);
      await loginPage.verifyUserNameTextField(invalidUserName);
      await loginPage.enterPassword(passWord);
      await loginPage.verifyPasswordTextField(passWord);
    });

    await test.step('Click login button and verify username error', async () => {
      await loginPage.verifyLoginButtonEnabled();
      await loginPage.clickLoginButton();
      await loginPage.verifyUserNameErrorMessage();
    });

    logger.info('Negative login test passed with invalid username (Env).');
  });

  test('Login fails with invalid password from Environment Variables', async () => {
    await test.step('Enter valid username with invalid password', async () => {
      await loginPage.enterUserName(userName);
      await loginPage.verifyUserNameTextField(userName);
      await loginPage.enterPassword(invalidPassword);
      await loginPage.verifyPasswordTextField(invalidPassword);
    });

    await test.step('Click login button and verify password error', async () => {
      await loginPage.verifyLoginButtonEnabled();
      await loginPage.clickLoginButton();
      await loginPage.verifyPasswordErrorMessage();
    });

    logger.info('Negative login test passed with invalid password (Env).');
  });

  // ⚡ Repeat the same pattern for CSV / JSON / Excel negative test cases:
  //  - Wrap each meaningful action in `test.step`
  //  - Give descriptive messages ("Enter invalid username from CSV", "Verify password error message")
  //  - Keep logger.info for extra debug logs

  test('Login fails with blank username and password', async () => {
    await test.step('Enter blank username and password', async () => {
      await loginPage.enterUserName('');
      await loginPage.enterPassword('');
    });

    await test.step('Click login button and verify blank error', async () => {
      await loginPage.clickLoginButton();
      await loginPage.verifyBlankErrorMessage();
    });

    logger.info('Negative login test passed with blank credentials.');
  });
});
