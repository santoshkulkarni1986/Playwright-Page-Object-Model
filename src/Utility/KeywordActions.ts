/**
 * Author: Santosh Kulkarni
 * Keyword-driven action handler
 */
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WelcomePage } from '../pages/WelcomePage';
import logger from './logger';

export class KeywordActions {
  private page: Page;
  private loginPage: LoginPage;
  private welcomePage: WelcomePage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.welcomePage = new WelcomePage(page);
  }

  /**
   * Perform action based on keyword
   * @param keyword - action to perform
   * @param value - optional value (like username or password)
   */
  public async perform(keyword: string, value?: string): Promise<void> {
    switch (keyword.toLowerCase()) {
      // -----------------------------
      // LoginPage actions
      // -----------------------------
      case 'navigate to login page':
        await this.loginPage.navigateToLoginPage();
        break;

      case 'enter username':
        if (!value) throw new Error('Username value is required');
        await this.loginPage.enterUserName(value);
        break;

      case 'enter password':
        if (!value) throw new Error('Password value is required');
        await this.loginPage.enterPassword(value);
        break;

      case 'click login':
        await this.loginPage.clickLoginButton();
        break;

      case 'verify username error':
        await this.loginPage.verifyUserNameErrorMessage();
        break;

      case 'verify password error':
        await this.loginPage.verifyPasswordErrorMessage();
        break;

      case 'verify blank error':
        await this.loginPage.verifyBlankErrorMessage();
        break;

      // -----------------------------
      // WelcomePage actions
      // -----------------------------
      case 'verify welcome':
        await this.welcomePage.verifyWelcomeMessage();
        break;

      case 'logout':
        await this.welcomePage.clickLogoutButton();
        break;

      default:
        throw new Error(`Unknown keyword: ${keyword}`);
    }
    logger.info(
      `Performed keyword: ${keyword}${value ? ` with value: ${value}` : ''}`,
    );
  }
}
