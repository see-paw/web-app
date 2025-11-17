import {AnimalsPage} from "./pages/animals.page";
import {Page} from "@playwright/test";
import PaginationComponent from "./components/PaginationComponent";

export class PageManager {
    private animalsPage: AnimalsPage;
    private paginationComponent: PaginationComponent;

    constructor(private page: Page) {
        this.animalsPage = new AnimalsPage(page);
        this.paginationComponent = new PaginationComponent(page);
    }

    getAnimalsPage(): AnimalsPage {
        return this.animalsPage;
    }

    getPaginationComponent(): PaginationComponent {
        return this.paginationComponent;
    }

    async navigateToAnimals(page: number = 1) {
        await this.page.goto(`/animals?page=${page}`);
    }

    async navigateToHome() {
        await this.page.goto('/');
    }
}