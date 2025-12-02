import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Page Object for the "Select Foster Value" page.
 *
 * Contains:
 *  - Quick value buttons
 *  - Custom value input
 *  - Continue button
 *  - Back button
 */
export class SelectFosterValuePage extends BasePage {
    readonly valueButtons: Locator;
    readonly customValueInput: Locator;
    readonly continueButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        super(page);

        this.valueButtons = page.locator('[data-testid="foster-value-option"]');
        this.customValueInput = page.locator('[data-testid="custom-value-input"]');
        this.continueButton = page.locator('[data-testid="continue-button"]');
        this.backButton = page.locator('[data-testid="back-button"]');
    }

    async waitForPageToLoad() {
        await this.waitForElementToBeVisible(this.continueButton);
    }

    async selectQuickValue(index: number) {
        await this.valueButtons.nth(index).click();
    }

    async enterCustomValue(value: string) {
        await this.customValueInput.fill(value);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async clickBack() {
        await this.backButton.click();
    }
}
