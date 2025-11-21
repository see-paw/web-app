import {BasePage} from "../core/base.page";
import {Page} from "@playwright/test";

export class ErrorPage extends BasePage { // todos os pages devem extender o base page

    constructor(page: Page) {
        super(page);
    }

    async getMainErrorMessage(): Promise<string> {
        return await this.page.getByRole("heading", { level: 1 }).textContent();
    }

    async getMessageText(): Promise<string> {
        const text = await this.page.locator("main p").first().textContent();
        return text?.trim() ?? "";
    }
}