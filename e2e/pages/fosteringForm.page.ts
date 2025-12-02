import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Page Object Model for the Fostering Form page.
 *
 * Contains:
 *  - All form fields
 *  - Form validation messages
 *  - Continue/Submit button
 *  - Navigation back to previous step
 */
export class FosteringFormPage extends BasePage {
    readonly fullNameInput: Locator;
    readonly nifInput: Locator;
    readonly ibanInput: Locator;
    readonly cvvInput: Locator;

    readonly fullNameError: Locator;
    readonly nifError: Locator;
    readonly ibanError: Locator;
    readonly cvvError: Locator;

    readonly backButton: Locator;
    readonly submitButton: Locator;
    readonly apiErrorMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.fullNameInput = page.locator('[data-testid="fullName-input"]');
        this.nifInput = page.locator('[data-testid="nif-input"]');
        this.ibanInput = page.locator('[data-testid="iban-input"]');
        this.cvvInput = page.locator('[data-testid="cvv-input"]');

        this.fullNameError = page.locator('[data-testid="error-fullName"]');
        this.nifError = page.locator('[data-testid="error-nif"]');
        this.ibanError = page.locator('[data-testid="error-iban"]');
        this.cvvError = page.locator('[data-testid="error-cvv"]');

        this.backButton = page.locator('[data-testid="form-back-button"]');
        this.submitButton = page.locator('[data-testid="form-submit-button"]');
        this.apiErrorMessage = page.locator('[data-testid="api-error"]');
    }

    async waitForPageToLoad() {
        await this.waitForElementToBeVisible(this.submitButton);
    }

    async fillForm(data: {
        fullName: string;
        nif: string;
        iban: string;
        cvv: string;
    }) {
        await this.fullNameInput.fill(data.fullName);
        await this.nifInput.fill(data.nif);
        await this.ibanInput.fill(data.iban);
        await this.cvvInput.fill(data.cvv);
    }

    async submit() {
        await this.submitButton.click();
    }

    async goBack() {
        await this.backButton.click();
    }
}
