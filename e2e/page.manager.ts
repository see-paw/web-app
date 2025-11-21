import {AnimalsPage} from "./pages/animals.page";
import {Page} from "@playwright/test";
import PaginationComponent from "./components/PaginationComponent";
import {ErrorPage} from "./pages/error.page";

export class PageManager {
    private readonly animalsPage: AnimalsPage;
    private readonly errorPage: ErrorPage;
    private readonly paginationComponent: PaginationComponent;

    constructor(private page: Page) {
        this.animalsPage = new AnimalsPage(page);
        this.errorPage = new ErrorPage(page);
        this.paginationComponent = new PaginationComponent(page);
    }

    getAnimalsPage(): AnimalsPage {
        return this.animalsPage;
    }

    getPaginationComponent(): PaginationComponent {
        return this.paginationComponent;
    }

    getErrorPage() : ErrorPage {
        return this.errorPage;
    }

    async navigateToAnimals(page: number = 1) {
        await this.page.goto(`/animals?page=${page}`);
    }

    async navigateToHome() {
        await this.page.goto('/');
    }
}