/**
 * Author: Santosh Kulkarni
 */

import { test, expect,Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WelcomePage } from '../pages/WelcomePage';
import logger from '../Utility/logger';

test.describe('PracticeTestAutomation Login Tests using POM', () => {
  let loginPage: LoginPage;

  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    (loginPage as any).page = page; // injecting page instance
    await loginPage.navigateToLoginPage();
  });

  test('Login successfully with valid credentials', async ({ page }) => {
    await loginPage.enterUserName('student');
    await loginPage.enterPassword('Password123');
    await loginPage.clickLoginButton();

    const welcomePage = new WelcomePage(page);
    await welcomePage.verifyWelcomeMessage();
    logger.info('Negative login test with valid username and password credentials passed.');

  });

  test('Login fails with invalid username', async ({ page }) => {
    await loginPage.enterUserName('invalidUser');
    await loginPage.enterPassword('Password123');
    await loginPage.clickLoginButton();
    await loginPage.verifyUserNameErrorMessage();
    logger.info('Negative login test with blank username credentials passed.');

  });

  test('Login fails with invalid password', async ({ page }) => {
    await loginPage.enterUserName('student');
    await loginPage.enterPassword('WrongPassword');
    await loginPage.clickLoginButton();
    await loginPage.verifyPasswordErrorMessage();
    logger.info('Negative login test with blank password credentials passed.');


  });

  test('Login fails with blank username and password', async ({ page }) => {
    await loginPage.enterUserName('');
    await loginPage.enterPassword('');
    await loginPage.clickLoginButton();
    await loginPage.verifyBlankErrorMessage();
    logger.info('Negative login test with blank credentials passed.');
  });
});
