import {AnimalsPage} from "./pages/animals.page";
import {Page} from "@playwright/test";
import PaginationComponent from "./components/PaginationComponent";
import {AnimalDetailsPage} from "./pages/animalDetails.page";
import {AnimalHeaderComponent} from "./components/AnimalHeader.component";
import {ImageGalleryModalComponent} from "./components/ImageGalleryModal.component";

export class PageManager {
    private animalsPage: AnimalsPage;
    private paginationComponent: PaginationComponent;
    private animalDetailsPage: AnimalDetailsPage;
    private imageGalleryModalComponent: ImageGalleryModalComponent;
    private animalHeaderComponent: AnimalHeaderComponent;

    constructor(private page: Page) {
        this.animalsPage = new AnimalsPage(page);
        this.paginationComponent = new PaginationComponent(page);
        this.animalDetailsPage = new AnimalDetailsPage(page);
        this.imageGalleryModalComponent = new ImageGalleryModalComponent(page);
        this.animalHeaderComponent = new AnimalHeaderComponent(page);
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

    getImageGalleryModalComponent(): ImageGalleryModalComponent {
        return this.imageGalleryModalComponent;
    }

    getAnimalHeaderComponent(): AnimalHeaderComponent {
        return this.animalHeaderComponent;
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
}