import {AnimalsPage} from "./pages/animals.page";
import {Page} from "@playwright/test";

export class PageManager {

    readonly animalsPage: AnimalsPage;
    //Adicionar restantes pages

    constructor(private page: Page) {
        this.animalsPage = new AnimalsPage(page);
    }

    getAnimalsPage(): AnimalsPage {
        return this.animalsPage;
    }
}