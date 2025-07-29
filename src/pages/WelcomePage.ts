/**
 * Author: Santosh Kulkarni
 */
import { expect, Locator, Page } from '@playwright/test';
import logger from '../Utility/logger';

export class WelcomePage {
  private page: Page;
  readonly succesMessage: Locator;
  readonly logOutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.succesMessage = this.page
      .getByRole('heading', { level: 1 })
      .describe('WelCome Message Locator');
    this.logOutButton = this.page.getByRole('link', { name: 'Log out' });
  }

  /**
   * Verifies the welcome message after successful login.
   */
  public async verifyWelcomeMessage(): Promise<boolean> {
    const action = 'verifying welcome message';
    try {
      logger.info(`Start ${action}`);
      const message = this.succesMessage;
      // await expect(message).toContainText('Logged In Successfully');
      await expect(this.page.getByRole('strong')).toContainText(
        'Congratulations student. You successfully logged in!',
      );
      await expect(this.page.getByRole('heading')).toContainText(
        'Logged In Successfully',
      );

      logger.info('Welcome message verified successfully.');
      return true;
    } catch (error) {
      logger.error(
        `Failed to verify welcome message: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  public async clickLogoutButton(): Promise<void> {
    const action = 'clicking logout button';
    try {
      logger.info(`Start ${action}`);
      await this.logOutButton.click();
      logger.info('Logout button clicked successfully.');
    } catch (error) {
      logger.error(`Error clicking logout button: ${(error as Error).message}`);
      throw error;
    }
  }
}
