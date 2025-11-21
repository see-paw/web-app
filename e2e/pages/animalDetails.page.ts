import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";
import { ImageGalleryModalComponent } from "../components/ImageGalleryModal.component";
import { AnimalHeaderComponent } from "../components/AnimalHeader.component";

/**
 * Page Object Model for the Animal Details Page.
 *
 * This class encapsulates:
 *  - All locators for core page sections (images, attributes, description)
 *  - Component objects (Header and Image Gallery Modal)
 *  - High-level user interactions
 *  - Utility getters for retrieving text/attributes
 *
 * All interactions within tests should be done through these methods,
 * ensuring maintainability and abstraction from UI changes.
 */
export class AnimalDetailsPage extends BasePage {
    // ================================================================
    // COMPONENT OBJECTS
    // Components encapsulate reusable UI logic
    // ================================================================
    readonly animalHeader: AnimalHeaderComponent;
    readonly imageGalleryModal: ImageGalleryModalComponent;

    // ================================================================
    // LOCATORS - AnimalImages
    // Handles main image, thumbnail grid and "View +X images" button
    // ================================================================
    readonly mainImage: Locator;
    readonly mainImageWrapper: Locator;
    readonly thumbnailGrid: Locator;
    readonly thumbnails: Locator;
    readonly viewMoreButton: Locator;

    // ================================================================
    // LOCATORS - AnimalInfo
    // Handles description and attribute grid below the images
    // ================================================================
    readonly animalDescription: Locator;
    readonly attributesGrid: Locator;

    /**
     * Constructor initializes component objects and all page locators.
     * @param page Playwright Page instance
     */
    constructor(page: Page) {
        super(page);

        // Initialize reusable component objects
        this.animalHeader = new AnimalHeaderComponent(page);
        this.imageGalleryModal = new ImageGalleryModalComponent(page);

        // AnimalImages - selectors for image area
        this.mainImageWrapper = page.locator('[data-testid="main-image-wrapper"]');
        this.mainImage = page.locator('[data-testid="main-image"]');
        this.thumbnailGrid = page.locator('[data-testid="thumbnail-grid"]');
        this.thumbnails = page.locator('[data-testid="thumbnail"]');
        this.viewMoreButton = page.locator('[data-testid="view-more-images"]');

        // AnimalInfo - selectors for text details
        this.animalDescription = page.locator('[data-testid="animal-description"]');
        this.attributesGrid = page.locator('[data-testid="attributes-grid"]');
    }

    // ================================================================
    // PAGE LOAD METHODS
    // Ensures the page is ready before interactions
    // ================================================================

    /**
     * Waits for the page to load completely:
     *  - Waits for the header (component-level)
     *  - Waits for main image and description
     */
    async waitForPageToLoad() {
        // Esperar pelo header (usa o component)
        await this.animalHeader.waitForHeaderToLoad();

        // Esperar pelos elementos específicos da página
        await this.waitForElementToBeVisible(this.mainImage);
        await this.waitForElementToBeVisible(this.animalDescription);
    }

    // ================================================================
    // HEADER METHODS (delegated to component)
    // ================================================================

    /** Returns the animal's name displayed in the header */
    async getAnimalName(): Promise<string> {
        return await this.animalHeader.getAnimalName();
    }

    /** Returns the full header text ("Olá, eu sou a Maria") */
    async getHeaderTitle(): Promise<string> {
        return await this.animalHeader.getFullHeaderText();
    }

    // ================================================================
    // ANIMAL IMAGES METHODS
    // Handles main image, thumbnails and "View more" functionality
    // ================================================================

    /** Returns the 'src' of the main image */
    async getMainImageSrc(): Promise<string> {
        return await this.getElementAttribute(this.mainImage, 'src');
    }

    /** Returns the 'alt' text of the main image */
    async getMainImageAlt(): Promise<string> {
        return await this.getElementAttribute(this.mainImage, 'alt');
    }

    /**
     * Clicks on the main image.
     * Automatically waits for gallery modal to open.
     */
    async clickMainImage() {
        await this.mainImage.click();
        // Esperar o modal abrir
        await this.imageGalleryModal.waitForModalToOpen();
    }

    /** Returns number of thumbnails rendered */
    async getThumbnailCount(): Promise<number> {
        return await this.thumbnails.count();
    }

    /** Returns the src of a specific thumbnail image */
    async getThumbnailSrc(index: number): Promise<string> {
        return await this.thumbnails.nth(index).locator('img').getAttribute('src') || '';
    }

    /**
     * Clicks on a specific thumbnail.
     * Opens the modal automatically.
     */
    async clickThumbnail(index: number) {
        await this.thumbnails.nth(index).click();
        // Esperar o modal abrir
        await this.imageGalleryModal.waitForModalToOpen();
    }

    /** Returns true if the "View more images" button is visible */
    async isViewMoreButtonVisible(): Promise<boolean> {
        return await this.isElementVisible(this.viewMoreButton);
    }

    /** Returns the text of the "View +X images" button */
    async getViewMoreButtonText(): Promise<string> {
        return await this.getElementText(this.viewMoreButton);
    }

    /**
     * Clicks "View more images" button.
     * Automatically waits for modal to open.
     */
    async clickViewMoreButton() {
        await this.viewMoreButton.click();
        // Esperar o modal abrir
        await this.imageGalleryModal.waitForModalToOpen();
    }

    /** Checks if the thumbnails grid is visible */
    async isThumbnailGridVisible(): Promise<boolean> {
        return await this.isElementVisible(this.thumbnailGrid);
    }

    // ================================================================
    // IMAGE GALLERY MODAL METHODS (delegated to component)
    // ================================================================

    /** Returns true if the modal is currently open */
    async isModalOpen(): Promise<boolean> {
        return await this.imageGalleryModal.isModalOpen();
    }

    /** Returns the src of the image currently displayed in the modal */
    async getModalImageSrc(): Promise<string> {
        return await this.imageGalleryModal.getModalImageSrc();
    }

    /** Returns the text of the modal counter, e.g., "1 / 5" */
    async getModalCounter(): Promise<string> {
        return await this.imageGalleryModal.getModalCounter();
    }

    /** Goes to next image in modal gallery */
    async clickModalNextButton() {
        await this.imageGalleryModal.goToNextImage();
    }

    /** Goes to previous image (supports circular navigation) */
    async clickModalPrevButton() {
        await this.imageGalleryModal.goToPreviousImage();
    }

    /** Closes the modal via the X button */
    async closeModal() {
        await this.imageGalleryModal.closeModal();
    }

    /** Closes the modal by clicking on the overlay */
    async closeModalByClickingOverlay() {
        await this.imageGalleryModal.closeModalByClickingOverlay();
    }

    /** Waits until the modal is fully closed */
    async waitForModalToClose() {
        await this.imageGalleryModal.waitForModalToClose();
    }

    // ================================================================
    // ANIMAL INFO METHODS
    // Description, attributes grid, individual attributes
    // ================================================================

    /** Returns the animal's full textual description */
    async getAnimalDescription(): Promise<string> {
        return await this.getElementText(this.animalDescription);
    }

    /**
     * Returns the value of a specific attribute.
     * Example:
     *  getAttributeValue("age") → "3 anos"
     *
     * Valid attribute names:
     *  - species, breed, sex, size, colour, age, sterilized, features
     */
    async getAttributeValue(attributeName: string): Promise<string> {
        const attribute = this.page.locator(`[data-testid="attribute-${attributeName}"]`);
        const value = attribute.locator('[data-testid="attribute-value"]');
        return await this.getElementText(value);
    }

    /**
     * Checks if a specific attribute is visible.
     * Useful for optional attributes such as "features".
     */
    async isAttributeVisible(attributeName: string): Promise<boolean> {
        const attribute = this.page.locator(`[data-testid="attribute-${attributeName}"]`);
        return await this.isElementVisible(attribute);
    }

    /**
     * Returns the total number of rendered attributes.
     * Useful to verify dynamic UI rendering.
     */
    async getAllAttributesCount(): Promise<number> {
        const attributes = this.attributesGrid.locator('[data-testid^="attribute-"]');
        return await attributes.count();
    }

    /** Returns the label (left side text) of an attribute */
    async getAttributeLabel(attributeName: string): Promise<string> {
        const attribute = this.page.locator(`[data-testid="attribute-${attributeName}"]`);
        const label = attribute.locator('.label, [class*="label"]').first();
        return await this.getElementText(label);
    }

    /** Returns true if the description is visible */
    async isDescriptionVisible(): Promise<boolean> {
        return await this.isElementVisible(this.animalDescription);
    }

    /** Returns true if the attribute grid is visible */
    async isAttributesGridVisible(): Promise<boolean> {
        return await this.isElementVisible(this.attributesGrid);
    }
}