import { Locator, Page } from "@playwright/test";
import { BasePage } from "../core/base.page";

/**
 * Component Object for the Image Gallery Modal.
 *
 * This component encapsulates:
 *  - Modal visibility and state validation
 *  - Navigation between images (next/previous)
 *  - Retrieval of modal data such as image src, alt text, and counter
 *  - Modal closing behaviours (via button or overlay)
 *
 * It is reusable in any page that displays a modal-based image gallery.
 */
export class ImageGalleryModalComponent extends BasePage {
    // ================================================================
    // LOCATORS
    // Target all modal-related UI elements
    // ================================================================
    readonly modalOverlay: Locator;
    readonly modalContent: Locator;
    readonly modalImage: Locator;
    readonly modalCloseButton: Locator;
    readonly modalCounter: Locator;
    readonly modalPrevButton: Locator;
    readonly modalNextButton: Locator;

    /**
     * Initializes all modal locators for interaction and validation.
     * @param page Playwright Page instance
     */
    constructor(page: Page) {
        super(page);

        this.modalOverlay = page.locator('[data-testid="modal-overlay"]');
        this.modalContent = page.locator('[data-testid="modal-content"]');
        this.modalImage = page.locator('[data-testid="modal-image"]');
        this.modalCloseButton = page.locator('[data-testid="modal-close-button"]');
        this.modalCounter = page.locator('[data-testid="modal-counter"]');
        this.modalPrevButton = page.locator('[data-testid="modal-prev-button"]');
        this.modalNextButton = page.locator('[data-testid="modal-next-button"]');
    }

    // ================================================================
    // MODAL STATE VALIDATION
    // ================================================================

    /**
     * Checks if the modal is currently open.
     */
    async isModalOpen(): Promise<boolean> {
        return await this.isElementVisible(this.modalOverlay);
    }

    /**
     * Waits until the modal overlay becomes visible.
     * Used right after clicking a thumbnail or main image.
     */
    async waitForModalToOpen() {
        await this.waitForElementToBeVisible(this.modalOverlay);
    }

    /**
     * Waits until the modal overlay disappears.
     * Used after closing the modal.
     */
    async waitForModalToClose() {
        await this.waitForElementToBeHidden(this.modalOverlay);
    }

    // ================================================================
    // MODAL INTERACTIONS
    // ================================================================

    /**
     * Closes the modal by clicking the close (X) button.
     */
    async closeModal() {
        await this.modalCloseButton.click();
    }

    /**
     * Closes the modal by clicking the overlay outside the modal content.
     *
     * The click is positioned intentionally away from the modal content to
     * avoid accidentally clicking within the content area.
     */
    async closeModalByClickingOverlay() {
        const box = await this.modalOverlay.boundingBox();
        // Click near the top-left corner of the overlay to avoid inner content
        await this.modalOverlay.click({ position: { x: 10, y: box!.height - 10} });
    }

    /**
     * Goes to the next image in the modal gallery.
     * Navigation is linear; circular logic is handled by tests if needed.
     */
    async goToNextImage() {
        await this.modalNextButton.click();
    }

    /**
     * Goes to the previous image in the modal gallery.
     */
    async goToPreviousImage() {
        await this.modalPrevButton.click();
    }

    // ================================================================
    // DATA RETRIEVAL METHODS
    // Extract src, alt, and counter information
    // ================================================================

    /**
     * Gets the current modal image's src URL.
     */
    async getModalImageSrc(): Promise<string> {
        return await this.getElementAttribute(this.modalImage, 'src');
    }

    /**
     * Gets the alt text of the current modal image.
     */
    async getModalImageAlt(): Promise<string> {
        return await this.getElementAttribute(this.modalImage, 'alt');
    }

    /**
     * Gets the "X / Y" counter text displayed in the modal.
     * Example: "1 / 5"
     */
    async getModalCounter(): Promise<string> {
        return await this.getElementText(this.modalCounter);
    }

    /**
     * Extracts the current image index from the counter.
     * Example: "2 / 5" → returns 2
     */
    async getCurrentImageIndex(): Promise<number> {
        const counter = await this.getModalCounter();
        const match = counter.match(/^(\d+)\s*\/\s*\d+$/);
        return match ? parseInt(match[1], 10) : 1;
    }

    /**
     * Extracts the total number of images from the counter.
     * Example: "2 / 5" → returns 5
     */
    async getTotalImages(): Promise<number> {
        const counter = await this.getModalCounter();
        const match = counter.match(/^\d+\s*\/\s*(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    }

    // ================================================================
    // STATE VALIDATION HELPERS
    // ================================================================

    /**
     * Checks whether both navigation buttons (prev and next)
     * are visible in the modal.
     *
     * Useful for validating:
     *  - only 1 image → buttons hidden
     *  - multiple images → buttons visible
     */
    async areNavigationButtonsVisible(): Promise<boolean> {
        const prevVisible = await this.isElementVisible(this.modalPrevButton);
        const nextVisible = await this.isElementVisible(this.modalNextButton);
        return prevVisible && nextVisible;
    }

    /**
     * Returns true if navigation buttons should NOT be visible.
     */
    async isNavigationButtonsHidden(): Promise<boolean> {
        return !(await this.areNavigationButtonsVisible());
    }

    // ================================================================
    // HIGH-LEVEL NAVIGATION LOGIC
    // Navigate directly to a specific modal image index
    // ================================================================

    /**
     * Navigates the modal gallery to a specific image index.
     *
     * Example:
     *   navigateToImageByIndex(3) → ensures modal displays image #3
     *
     * Includes simple animation waits to avoid race conditions.
     *
     * @param targetIndex Desired image index (1-based)
     * @throws Error if index is out of range
     */
    async navigateToImageByIndex(targetIndex: number) {
        const currentIndex = await this.getCurrentImageIndex();
        const totalImages = await this.getTotalImages();

        if (targetIndex < 1 || targetIndex > totalImages) {
            throw new Error(`Invalid image index: ${targetIndex}. Must be between 1 and ${totalImages}`);
        }

        const clicks = targetIndex - currentIndex;

        // Move forward
        if (clicks > 0) {
            for (let i = 0; i < clicks; i++) {
                await this.goToNextImage();
                await this.page.waitForTimeout(200); // Pequena pausa para animação
            }
            // Move backward
        } else if (clicks < 0) {
            for (let i = 0; i < Math.abs(clicks); i++) {
                await this.goToPreviousImage();
                await this.page.waitForTimeout(200);
            }
        }
    }
}