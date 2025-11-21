import {Locator, Page} from "@playwright/test";

export class BasePage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async waitForElementToBeVisible(locator: Locator, timeout: number = 5000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async waitForElementToBeHidden(locator: Locator, timeout: number = 5000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    async waitForNumberOfElements(locator: Locator, expectedCount: number, timeout: number = 5000) {
        await this.page.waitForFunction(
            ({ selector, count }) => {
                const elements = document.querySelectorAll(selector);
                return elements.length === count;
            },
            { selector: await locator.first().evaluate(el => {
                    const testId = el.getAttribute('data-testid');
                    return testId ? `[data-testid="${testId}"]` : el.className;
                }), count: expectedCount },
            { timeout }
        );
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }

    async scrollToElement(locator: Locator) {
        await locator.scrollIntoViewIfNeeded();
    }

    async fillFormField(locator: Locator, value: string) {
        await locator.clear();
        await locator.fill(value);
    }

    async selectDropdownOption(locator: Locator, value: string) {
        await locator.selectOption(value);
    }

    async clickAndWaitForNavigation(locator: Locator, urlPattern: string) {
        await locator.click();
        await this.page.waitForURL(urlPattern);
    }

    async getElementText(locator: Locator): Promise<string> {
        const text = await locator.textContent();
        return text ?? '';
    }

    async getElementAttribute(locator: Locator, attribute: string): Promise<string> {
        const attr = await locator.getAttribute(attribute);
        return attr ?? '';
    }

    async waitForLoadingToComplete(loadingSelector: string = '[data-testid="loading-spinner"]') {
        const loadingLocator = this.page.locator(loadingSelector);
        const isVisible = await this.isElementVisible(loadingLocator);

        if (isVisible) {
            await this.waitForElementToBeHidden(loadingLocator);
        }
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}