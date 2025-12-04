import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

export class LoginPage extends BasePage {
    readonly pageHeading: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly registerLink: Locator;
    readonly rootErrorMessage: Locator;
    readonly emailErrorMessage: Locator;
    readonly passwordErrorMessage: Locator;
    readonly logo: Locator;

    constructor(page: Page) {
        super(page);

        this.logo = page.locator('img[alt="Seepaw"]');
        this.emailInput = page.getByRole('textbox', { name: /email/i });
        this.passwordInput = page.getByLabel(/password/i);
        this.submitButton = page.getByRole('button', { name: /entrar/i });
        this.registerLink = page.getByRole('link', { name: /registar/i });
        
        this.rootErrorMessage = page.locator('[class*="errorMessage"]').first();
        this.emailErrorMessage = page.locator('[class*="fieldError"]').first();
        this.passwordErrorMessage = page.locator('[class*="fieldError"]').last();
    }

    async waitForPageToLoad() {
        await this.waitForElementToBeVisible(this.logo);
        await this.waitForElementToBeVisible(this.emailInput);
        await this.waitForElementToBeVisible(this.passwordInput);
        await this.waitForElementToBeVisible(this.submitButton);
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickSubmit() {
        await this.submitButton.click();
    }

    async fillAndSubmitLogin(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickSubmit();
    }

    async isSubmitButtonDisabled(): Promise<boolean> {
        return await this.submitButton.isDisabled();
    }

    async getSubmitButtonText(): Promise<string> {
        return await this.getElementText(this.submitButton);
    }

    async getRootErrorMessage(): Promise<string> {
        return await this.getElementText(this.rootErrorMessage);
    }

    async getEmailErrorMessage(): Promise<string> {
        return await this.getElementText(this.emailErrorMessage);
    }

    async getPasswordErrorMessage(): Promise<string> {
        return await this.getElementText(this.passwordErrorMessage);
    }

    async isRootErrorVisible(): Promise<boolean> {
        return await this.isElementVisible(this.rootErrorMessage);
    }

    async isEmailErrorVisible(): Promise<boolean> {
        return await this.isElementVisible(this.emailErrorMessage);
    }

    async isPasswordErrorVisible(): Promise<boolean> {
        return await this.isElementVisible(this.passwordErrorMessage);
    }

    async clickRegisterLink() {
        await this.registerLink.click();
    }

    async isLogoVisible(): Promise<boolean> {
        return await this.isElementVisible(this.logo);
    }

    async waitForToast(message: string, timeout: number = 5000) {
        const toast = this.page.locator(`text="${message}"`);
        await toast.waitFor({ state: 'visible', timeout });
    }

    async isToastVisible(message: string): Promise<boolean> {
        const toast = this.page.locator(`text="${message}"`);
        return await this.isElementVisible(toast);
    }

    async waitForNavigation(expectedUrl: string) {
        await this.page.waitForURL(expectedUrl);
    }

    async clearForm() {
        await this.emailInput.clear();
        await this.passwordInput.clear();
    }


}
