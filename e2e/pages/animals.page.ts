import {Page} from "@playwright/test";
import {BasePage} from "../base.page";

export class AnimalsPage extends BasePage { // todos os pages devem extender o base page

    constructor(page: Page) {
        super(page);
    }

    async goToAnimalDetail(id: string) {
        await this.page.locator(`a[href="/animals/${id}"]`).click();
    }
}