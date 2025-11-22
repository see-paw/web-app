import {AnimalsPage} from "./pages/animals.page";
import {Page} from "@playwright/test";
import PaginationComponent from "./components/PaginationComponent";
import {ErrorPage} from "./pages/error.page";
import {AnimalDetailsPage} from "./pages/animalDetails.page";
import {AnimalHeaderComponent} from "./components/AnimalHeader.component";
import {ImageGalleryModalComponent} from "./components/ImageGalleryModal.component";
import {LoginPage} from "./pages/login.page";
import {NavbarComponent} from "./components/navbar.component";

export class PageManager {
    private readonly animalsPage: AnimalsPage;
    private readonly errorPage: ErrorPage;
    private readonly paginationComponent: PaginationComponent;
    private readonly animalDetailsPage: AnimalDetailsPage;
    private readonly imageGalleryModalComponent: ImageGalleryModalComponent;
    private readonly animalHeaderComponent: AnimalHeaderComponent;
    private readonly loginPage: LoginPage;
    private readonly navbarComponent: NavbarComponent;

    constructor(private page: Page) {
        this.animalsPage = new AnimalsPage(page);
        this.errorPage = new ErrorPage(page);
        this.paginationComponent = new PaginationComponent(page);
        this.animalDetailsPage = new AnimalDetailsPage(page);
        this.imageGalleryModalComponent = new ImageGalleryModalComponent(page);
        this.animalHeaderComponent = new AnimalHeaderComponent(page);
        this.loginPage = new LoginPage(page);
        this.navbarComponent = new NavbarComponent(page);
    }

    getAnimalsPage(): AnimalsPage {
        return this.animalsPage;
    }

    getAnimalDetailsPage(): AnimalDetailsPage {
        return this.animalDetailsPage;
    }

    getPaginationComponent(): PaginationComponent {
        return this.paginationComponent;
    }

    getErrorPage() : ErrorPage {
        return this.errorPage;
    }

    getImageGalleryModalComponent(): ImageGalleryModalComponent {
        return this.imageGalleryModalComponent;
    }

    getAnimalHeaderComponent(): AnimalHeaderComponent {
        return this.animalHeaderComponent;
    }

    getLoginPage(): LoginPage {
        return this.loginPage;
    }

    getNavbarComponent(): NavbarComponent {
        return this.navbarComponent;
    }

    async navigateToAnimals(page: number = 1) {
        await this.page.goto(`/animals?page=${page}`);
    }

    async navigateToAnimalDetails(animalId: string): Promise<void> {
        await this.page.goto(`/animals/${animalId}`);
    }

    async navigateToHome() {
        await this.page.goto('/');
    }

    async navigateToLogin() {
        await this.page.goto('/login');
    }
}
