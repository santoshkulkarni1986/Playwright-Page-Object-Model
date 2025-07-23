/*** Author: Santosh Kulkarni ***/
import { expect, Page } from '@playwright/test';
import logger from '../Utility/logger';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the login page.
   */
  public async navigateToLoginPage(): Promise<void> {
    const action = 'navigating to the login page';
    try {
      const baseUrl = process.env.URL || 'https://practicetestautomation.com/practice-test-login/';
      logger.info(`Start ${action}`);
      console.log('Using base URL:', baseUrl);
      await this.page.goto(baseUrl, { waitUntil: 'load' });
      logger.info('Successfully navigated to the login page.');
    } catch (error) {
      logger.error(`Error navigating to the URL: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Enter the username.
   */
  public async enterUserName(username: string): Promise<void> {
    const action = `entering username: ${username}`;
    try {
      logger.info(`Start ${action}`);
      const userNameInput = this.page.getByLabel('Username').describe('Username Textfield Locator');
      await userNameInput.fill(username);
      logger.info(`Successfully entered username: ${username}`);
    } catch (error) {
      logger.error(`Error entering username: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Enter the password.
   */
  public async enterPassword(password: string): Promise<void> {
    const action = 'entering password';
    try {
      logger.info(`Start ${action}`);
      const passwordInput = this.page.getByLabel('Password').describe('Password Textfield Locator');
      await passwordInput.fill(password);
      logger.info('Successfully entered password');
    } catch (error) {
      logger.error(`Error entering password: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Click the login button.
   */
  public async clickLoginButton(): Promise<void> {
    const action = 'clicking the login button';
    try {
      logger.info(`Start ${action}`);
      const submitButton = this.page.getByRole('button', { name: 'Submit' }).describe('Submit Button Locator');
      await submitButton.click();
      logger.info('Successfully clicked the login button.');
    } catch (error) {
      logger.error(`Error clicking the login button: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Verifies the username error message.
   */
  public async verifyUserNameErrorMessage(): Promise<void> {
    const action = 'verifying username error message';
    try {
      logger.info(`Start ${action}`);
      const message = this.page.locator('#error');
      await expect(message).toContainText('Your username is invalid!');
      logger.info('Username error message verified successfully.');
    } catch (error) {
      logger.error(`Failed to verify username error message: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Verifies the password error message.
   */
  public async verifyPasswordErrorMessage(): Promise<void> {
    const action = 'verifying password error message';
    try {
      logger.info(`Start ${action}`);
      const message = this.page.locator('#error');
      await expect(message).toContainText('Your password is invalid!');
      logger.info('Password error message verified successfully.');
    } catch (error) {
      logger.error(`Failed to verify password error message: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Verifies the blank error message.
   */
  public async verifyBlankErrorMessage(): Promise<void> {
    const action = 'verifying blank error message';
    try {
      logger.info(`Start ${action}`);
      const message = this.page.locator('#error');
      await expect(message).toContainText('Your username is invalid!');
      logger.info('Blank error message verified successfully.');
    } catch (error) {
      logger.error(`Failed to verify blank error message: ${(error as Error).message}`);
      throw error;
    }
  }
}
