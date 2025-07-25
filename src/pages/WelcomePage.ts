/**
 * Author: Santosh Kulkarni
 */
import { expect, Locator, Page } from "@playwright/test";
import logger from "../Utility/logger";

export class WelcomePage {
private page: Page;
readonly succesMessage:Locator;

    constructor(page: Page) {
    this.page = page;
    this.succesMessage= this.page.getByRole('heading', { level: 1 }).describe('WelCome Message Locator');
}

/**
   * Verifies the welcome message after successful login.
   */
    public async verifyWelcomeMessage(): Promise<void> {
    const action = "verifying welcome message";
    try {
    logger.info(`Start ${action}`);
    const message = this.succesMessage;
    await expect(message).toContainText("Logged In Successfully");
    logger.info("Welcome message verified successfully.");
    } catch (error) {
    logger.error(
        `Failed to verify welcome message: ${(error as Error).message}`
    );
    throw error;
    }
}
}
