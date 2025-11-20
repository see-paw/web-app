import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";
import { ImageGalleryModalComponent } from "../components/ImageGalleryModal.component";
import { AnimalHeaderComponent } from "../components/AnimalHeader.component";

export class AnimalDetailsPage extends BasePage {
    // ========================================
    // COMPONENT OBJECTS
    // ========================================
    readonly animalHeader: AnimalHeaderComponent;
    readonly imageGalleryModal: ImageGalleryModalComponent;

    // ========================================
    // LOCATORS - AnimalImages
    // ========================================
    readonly mainImage: Locator;
    readonly mainImageWrapper: Locator;
    readonly thumbnailGrid: Locator;
    readonly thumbnails: Locator;
    readonly viewMoreButton: Locator;

    // ========================================
    // LOCATORS - AnimalInfo
    // ========================================
    readonly animalDescription: Locator;
    readonly attributesGrid: Locator;

    constructor(page: Page) {
        super(page);

        // Inicializar Component Objects
        this.animalHeader = new AnimalHeaderComponent(page);
        this.imageGalleryModal = new ImageGalleryModalComponent(page);

        // AnimalImages - Locators específicos desta página
        this.mainImageWrapper = page.locator('[data-testid="main-image-wrapper"]');
        this.mainImage = page.locator('[data-testid="main-image"]');
        this.thumbnailGrid = page.locator('[data-testid="thumbnail-grid"]');
        this.thumbnails = page.locator('[data-testid="thumbnail"]');
        this.viewMoreButton = page.locator('[data-testid="view-more-images"]');

        // AnimalInfo - Locators específicos desta página
        this.animalDescription = page.locator('[data-testid="animal-description"]');
        this.attributesGrid = page.locator('[data-testid="attributes-grid"]');
    }

    // ========================================
    // MÉTODOS DE ESPERA
    // ========================================

    async waitForPageToLoad() {
        // Esperar pelo header (usa o component)
        await this.animalHeader.waitForHeaderToLoad();

        // Esperar pelos elementos específicos da página
        await this.waitForElementToBeVisible(this.mainImage);
        await this.waitForElementToBeVisible(this.animalDescription);
    }

    // ========================================
    // MÉTODOS - AnimalHeader (delegados ao component)
    // ========================================

    async getAnimalName(): Promise<string> {
        return await this.animalHeader.getAnimalName();
    }

    async getHeaderTitle(): Promise<string> {
        return await this.animalHeader.getFullHeaderText();
    }

    // ========================================
    // MÉTODOS - AnimalImages
    // ========================================

    async getMainImageSrc(): Promise<string> {
        return await this.getElementAttribute(this.mainImage, 'src');
    }

    async getMainImageAlt(): Promise<string> {
        return await this.getElementAttribute(this.mainImage, 'alt');
    }

    async clickMainImage() {
        await this.mainImage.click();
        // Esperar o modal abrir
        await this.imageGalleryModal.waitForModalToOpen();
    }

    async getThumbnailCount(): Promise<number> {
        return await this.thumbnails.count();
    }

    async getThumbnailSrc(index: number): Promise<string> {
        return await this.thumbnails.nth(index).locator('img').getAttribute('src') || '';
    }

    async clickThumbnail(index: number) {
        await this.thumbnails.nth(index).click();
        // Esperar o modal abrir
        await this.imageGalleryModal.waitForModalToOpen();
    }

    async isViewMoreButtonVisible(): Promise<boolean> {
        return await this.isElementVisible(this.viewMoreButton);
    }

    async getViewMoreButtonText(): Promise<string> {
        return await this.getElementText(this.viewMoreButton);
    }

    async clickViewMoreButton() {
        await this.viewMoreButton.click();
        // Esperar o modal abrir
        await this.imageGalleryModal.waitForModalToOpen();
    }

    async isThumbnailGridVisible(): Promise<boolean> {
        return await this.isElementVisible(this.thumbnailGrid);
    }

    // ========================================
    // MÉTODOS - ImageGalleryModal (delegados ao component)
    // ========================================

    async isModalOpen(): Promise<boolean> {
        return await this.imageGalleryModal.isModalOpen();
    }

    async getModalImageSrc(): Promise<string> {
        return await this.imageGalleryModal.getModalImageSrc();
    }

    async getModalCounter(): Promise<string> {
        return await this.imageGalleryModal.getModalCounter();
    }

    async clickModalNextButton() {
        await this.imageGalleryModal.goToNextImage();
    }

    async clickModalPrevButton() {
        await this.imageGalleryModal.goToPreviousImage();
    }

    async closeModal() {
        await this.imageGalleryModal.closeModal();
    }

    async closeModalByClickingOverlay() {
        await this.imageGalleryModal.closeModalByClickingOverlay();
    }

    async waitForModalToClose() {
        await this.imageGalleryModal.waitForModalToClose();
    }

    // ========================================
    // MÉTODOS - AnimalInfo
    // ========================================

    async getAnimalDescription(): Promise<string> {
        return await this.getElementText(this.animalDescription);
    }

    /**
     * Obtém o valor de um atributo específico
     * @param attributeName - Nome do atributo (species, breed, sex, size, colour, age, sterilized, features)
     */
    async getAttributeValue(attributeName: string): Promise<string> {
        const attribute = this.page.locator(`[data-testid="attribute-${attributeName}"]`);
        const value = attribute.locator('[data-testid="attribute-value"]');
        return await this.getElementText(value);
    }

    /**
     * Verifica se um atributo está visível
     */
    async isAttributeVisible(attributeName: string): Promise<boolean> {
        const attribute = this.page.locator(`[data-testid="attribute-${attributeName}"]`);
        return await this.isElementVisible(attribute);
    }

    /**
     * Obtém o número total de atributos visíveis
     */
    async getAllAttributesCount(): Promise<number> {
        const attributes = this.attributesGrid.locator('[data-testid^="attribute-"]');
        return await attributes.count();
    }

    /**
     * Obtém o label de um atributo
     */
    async getAttributeLabel(attributeName: string): Promise<string> {
        const attribute = this.page.locator(`[data-testid="attribute-${attributeName}"]`);
        const label = attribute.locator('.label, [class*="label"]').first();
        return await this.getElementText(label);
    }

    /**
     * Verifica se a descrição está visível
     */
    async isDescriptionVisible(): Promise<boolean> {
        return await this.isElementVisible(this.animalDescription);
    }

    /**
     * Verifica se o grid de atributos está visível
     */
    async isAttributesGridVisible(): Promise<boolean> {
        return await this.isElementVisible(this.attributesGrid);
    }
}