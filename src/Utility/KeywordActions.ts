/**Author:Santosh Kulkarni
 * Utility to perform keyword-driven actions for test automation
 * */
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WelcomePage } from '../pages/WelcomePage';

export class KeywordActions {
  private loginPage: LoginPage;
  private welcomePage: WelcomePage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.welcomePage = new WelcomePage(page);
  }

  async perform(keyword: string, value?: string) {
    switch (keyword.toLowerCase()) {
      case 'navigate to login page':
        return this.loginPage.navigateToLoginPage();

      case 'enter username':
        return this.loginPage.enterUserName(value!);

      case 'verify username':
        return this.loginPage.verifyUserNameTextField(value!);

      case 'enter password':
        return this.loginPage.enterPassword(value!);

      case 'verify password':
        return this.loginPage.verifyPasswordTextField(value!);

      case 'click login':
        return this.loginPage.clickLoginButton();

      case 'verify login button enabled':
        return this.loginPage.verifyLoginButtonEnabled();

      case 'verify welcome':
        return this.welcomePage.verifyWelcomeMessage();

      case 'logout':
        return this.welcomePage.clickLogoutButton();

      case 'verify username error':
        return this.loginPage.verifyUserNameErrorMessage();

      case 'verify password error':
        return this.loginPage.verifyPasswordErrorMessage();

      case 'verify blank error':
        return this.loginPage.verifyBlankErrorMessage();

      default:
        throw new Error(`Unknown keyword: ${keyword}`);
    }
  }
}
