import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Page Object Model for the final Fostering Confirmation page.
 *
 * Contains:
 *  - Success message
 *  - Receipt download button (mocked)
 *  - Navigation back to animals listing
 */
export class FosterConfirmationPage extends BasePage {
    readonly successMessage: Locator;
    readonly backToAnimalsButton: Locator;
    readonly downloadReceiptButton: Locator;

    constructor(page: Page) {
        super(page);

        this.successMessage = page.locator('[data-testid="fostering-success"]');
        this.backToAnimalsButton = page.locator('[data-testid="back-to-animals"]');
        this.downloadReceiptButton = page.locator('[data-testid="download-receipt"]');
    }

    async waitForPageToLoad() {
        await this.waitForElementToBeVisible(this.successMessage);
    }

    async downloadReceipt() {
        await this.downloadReceiptButton.click();
    }
}
