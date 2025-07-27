/*** Author: Santosh Kulkarni ***/
import { expect, Page, Locator } from '@playwright/test';
import logger from '../Utility/logger';

export class LoginPage {
  private page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButon: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page
      .getByLabel('Username')
      .describe('Username Textfield Locator');
    this.passwordInput = page
      .getByLabel('Password')
      .describe('Password Textfield Locator');
    this.submitButon = page
      .getByRole('button', { name: 'Submit' })
      .describe('Submit Button Locator');
    this.errorMessage = page
      .locator('#error')
      .describe('Error Message Locator');
  }

  /**
   * Navigate to the login page.
   */
  public async navigateToLoginPage(): Promise<void> {
    const action = 'navigating to the login page';
    try {
      const baseUrl =
        process.env.URL ||
        'https://practicetestautomation.com/practice-test-login/';
      logger.info(`Start ${action}`);
      await this.page.goto(baseUrl, { waitUntil: 'load' });
      logger.info(`Successfully navigated to the login page: ${baseUrl}`);
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
      await this.usernameInput.fill(username);
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
      await this.passwordInput.fill(password);
      logger.info(`Successfully entered password: ${password}`);
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
      await this.submitButon.click();
      logger.info('Successfully clicked the login button.');
    } catch (error) {
      logger.error(
        `Error clicking the login button: ${(error as Error).message}`,
      );
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
      const message = this.errorMessage;
      await expect(message).toContainText('Your username is invalid!');
      logger.info('Username error message verified successfully.');
    } catch (error) {
      logger.error(
        `Failed to verify username error message: ${(error as Error).message}`,
      );
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
      const message = this.errorMessage;
      await expect(message).toContainText('Your password is invalid!');
      logger.info('Password error message verified successfully.');
    } catch (error) {
      logger.error(
        `Failed to verify password error message: ${(error as Error).message}`,
      );
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
      const message = this.errorMessage;
      await expect(message).toContainText('Your username is invalid!');
      logger.info('Blank error message verified successfully.');
    } catch (error) {
      logger.error(
        `Failed to verify blank error message: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  /**
   * Verify that the username text field has the expected value.
   */
  public async verifyUserNameTextField(expected: string): Promise<void> {
    const action = 'verifying username text field';
    try {
      logger.info(`Start ${action}`);
      await expect(this.usernameInput).toHaveValue(expected);
      logger.info('Username text field verified successfully.');
    } catch (error) {
      logger.error(
        `Failed to verify username text field: ${(error as Error).message}`,
      );
      throw error;
    }
  }
  /**
   * Verify that the password text field has the expected value.
   */
  public async verifyPasswordTextField(expected: string): Promise<void> {
    const action = 'verifying password text field';
    try {
      logger.info(`Start ${action}`);
      await expect(this.passwordInput).toHaveValue(expected);
      logger.info('Password text field verified successfully.');
    } catch (error) {
      logger.error(
        `Failed to verify password text field: ${(error as Error).message}`,
      );
      throw error;
    }
  }
  /**
   * Verify that the login button is enabled.
   */
  public async verifyLoginButtonEnabled(): Promise<void> {
    const action = 'verifying login button is enabled';
    try {
      logger.info(`Start ${action}`);
      await expect(this.submitButon).toBeEnabled();
      logger.info('Login button is enabled.');
    } catch (error) {
      logger.error(
        `Failed to verify login button enabled: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
